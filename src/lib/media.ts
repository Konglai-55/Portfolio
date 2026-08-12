const defaultMediaBaseUrl =
  "https://zuopinji.cn-nb1.rains3.com/portfolio-assets/v1";

export const mediaBaseUrl = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim() || defaultMediaBaseUrl
).replace(/\/+$/, "");

export const mediaOrigin = new URL(mediaBaseUrl).origin;

export function mediaUrl(pathname: string) {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  return `${mediaBaseUrl}/${pathname.replace(/^\/+/, "")}`;
}
