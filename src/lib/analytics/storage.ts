import "server-only";

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { StoredAnalyticsEvent } from "./types";

const EVENT_PREFIX = "portfolio-analytics/events";
const MAX_EVENT_OBJECTS = 24_000;
const DOWNLOAD_CONCURRENCY = 12;

type StorageConfig = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

let cachedClient: S3Client | null = null;
let cachedClientKey = "";

function readStorageConfig(): StorageConfig | null {
  const endpoint = process.env.RAIN_S3_ENDPOINT?.trim().replace(/\/$/, "");
  const bucket = process.env.RAIN_S3_BUCKET?.trim();
  const accessKeyId = process.env.RAIN_S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.RAIN_S3_SECRET_ACCESS_KEY?.trim();

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    endpoint,
    bucket,
    accessKeyId,
    secretAccessKey,
    region: process.env.RAIN_S3_REGION?.trim() || "us-east-1",
  };
}

function getStorageClient(config: StorageConfig) {
  const clientKey = [
    config.endpoint,
    config.region,
    config.bucket,
    config.accessKeyId,
  ].join("|");

  if (cachedClient && cachedClientKey === clientKey) {
    return cachedClient;
  }

  cachedClient = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: process.env.RAIN_S3_FORCE_PATH_STYLE !== "false",
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  cachedClientKey = clientKey;
  return cachedClient;
}

export function isAnalyticsStorageConfigured() {
  return readStorageConfig() !== null;
}

function datePrefix(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${EVENT_PREFIX}/${year}/${month}/${day}/`;
}

export async function storeAnalyticsEvent(event: StoredAnalyticsEvent) {
  const config = readStorageConfig();
  if (!config) {
    return false;
  }

  const client = getStorageClient(config);
  const occurredAt = new Date(event.occurredAt);
  const safeDate = Number.isNaN(occurredAt.valueOf()) ? new Date() : occurredAt;
  const key = `${datePrefix(safeDate)}${safeDate.getTime()}-${event.id}.json`;

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: JSON.stringify(event),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "private, no-store",
    }),
  );

  return true;
}

function enumerateUtcDays(from: Date, to: Date) {
  const days: Date[] = [];
  const cursor = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  );
  const end = new Date(
    Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()),
  );

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

async function listKeysForPrefix(
  client: S3Client,
  bucket: string,
  prefix: string,
) {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }),
    );

    for (const object of response.Contents ?? []) {
      if (object.Key?.endsWith(".json")) {
        keys.push(object.Key);
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken && keys.length < MAX_EVENT_OBJECTS);

  return keys;
}

async function readEventObject(
  client: S3Client,
  bucket: string,
  key: string,
) {
  try {
    const response = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const text = await response.Body?.transformToString("utf-8");
    if (!text) {
      return null;
    }
    const parsed = JSON.parse(text) as StoredAnalyticsEvent;
    return parsed.version === 1 && parsed.id ? parsed : null;
  } catch {
    return null;
  }
}

export async function readAnalyticsEvents(from: Date, to: Date) {
  const config = readStorageConfig();
  if (!config) {
    return {
      configured: false,
      events: [] as StoredAnalyticsEvent[],
      truncated: false,
      message: "等待配置雨云对象存储凭据",
    };
  }

  const client = getStorageClient(config);
  const days = enumerateUtcDays(from, to);
  const prefixGroups: string[][] = [];

  for (let index = 0; index < days.length; index += 6) {
    const group = days.slice(index, index + 6);
    const listed = await Promise.all(
      group.map((day) =>
        listKeysForPrefix(client, config.bucket, datePrefix(day)),
      ),
    );
    prefixGroups.push(...listed);
  }

  const allKeys = prefixGroups.flat();
  const truncated = allKeys.length >= MAX_EVENT_OBJECTS;
  const keys = allKeys.slice(0, MAX_EVENT_OBJECTS);
  const events: StoredAnalyticsEvent[] = [];

  for (let index = 0; index < keys.length; index += DOWNLOAD_CONCURRENCY) {
    const batch = keys.slice(index, index + DOWNLOAD_CONCURRENCY);
    const downloaded = await Promise.all(
      batch.map((key) => readEventObject(client, config.bucket, key)),
    );
    for (const event of downloaded) {
      if (event) {
        events.push(event);
      }
    }
  }

  return {
    configured: true,
    events,
    truncated,
    message: truncated
      ? `已读取最近 ${MAX_EVENT_OBJECTS.toLocaleString("zh-CN")} 条事件，更多数据建议按月归档`
      : "雨云对象存储连接正常",
  };
}
