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

  const path = pathname.replace(/^\/+/, "");
  // Bundled images avoid an external fetch on each image optimizer cache miss.
  return path.startsWith("images/") ? `/${path}` : `${mediaBaseUrl}/${path}`;
}
