export function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl || apiBaseUrl.trim() === "") {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
