function hasExplicitScheme(href: string) {
  return /^(?:[a-z]+:)?\/\//i.test(href);
}

export function resolvePublicAssetHref(baseUrl: string, href: string) {
  if (
    href.length === 0 ||
    !href.startsWith("/") ||
    hasExplicitScheme(href) ||
    href.startsWith("data:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedHref = href.replace(/^\/+/, "");

  return `${normalizedBase}${normalizedHref}`;
}

export function resolveRemotionPublicAssetHref(href: string) {
  return resolvePublicAssetHref(import.meta.env.BASE_URL ?? "/", href);
}
