import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const projectRoot = process.cwd();
const publicDirectory = path.join(projectRoot, "public");
const assetPrefix = "portfolio-assets/v1";
const mediaExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".m4v",
  ".mov",
  ".mp4",
  ".png",
  ".svg",
  ".webm",
  ".webp",
]);

const contentTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".m4v": "video/x-m4v",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

async function collectMedia(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMedia(fullPath)));
    } else if (mediaExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

const endpoint = requiredEnvironment("RAIN_S3_ENDPOINT").replace(/\/$/, "");
const bucket = requiredEnvironment("RAIN_S3_BUCKET");
const publicBaseUrl = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim() ||
  `https://${bucket}.${new URL(endpoint).hostname}/${assetPrefix}`
).replace(/\/$/, "");

const client = new S3Client({
  endpoint,
  region: process.env.RAIN_S3_REGION?.trim() || "us-east-1",
  forcePathStyle: process.env.RAIN_S3_FORCE_PATH_STYLE !== "false",
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: requiredEnvironment("RAIN_S3_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnvironment("RAIN_S3_SECRET_ACCESS_KEY"),
  },
});

const files = (await collectMedia(publicDirectory)).sort();
let uploadedBytes = 0;

for (const filePath of files) {
  const relativePath = path
    .relative(publicDirectory, filePath)
    .split(path.sep)
    .join("/");
  const key = `${assetPrefix}/${relativePath}`;
  const fileStat = await stat(filePath);
  const extension = path.extname(filePath).toLowerCase();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(filePath),
      ContentLength: fileStat.size,
      ContentType: contentTypes[extension] || "application/octet-stream",
      ContentDisposition: "inline",
      CacheControl: "public, max-age=604800, stale-while-revalidate=2592000",
    }),
  );

  uploadedBytes += fileStat.size;
  console.log(`uploaded ${relativePath}`);
}

console.log(
  `done: ${files.length} files, ${(uploadedBytes / 1024 / 1024).toFixed(2)} MB`,
);
console.log(`public base: ${publicBaseUrl}`);
