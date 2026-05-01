const API_BASE_URL_ENV = "NEXT_PUBLIC_API_BASE_URL";
const API_BASE_URL_ERROR_PREFIX =
  "NEXT_PUBLIC_API_BASE_URL must be configured with an absolute HTTP/HTTPS URL";

function buildConfigError(reason) {
  return new Error(
    `${API_BASE_URL_ERROR_PREFIX}. ${reason}. Example: ${API_BASE_URL_ENV}=http://localhost:3001`
  );
}

export function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (apiBaseUrl === undefined) {
    throw buildConfigError("The value is missing");
  }

  const trimmedApiBaseUrl = apiBaseUrl.trim();

  if (trimmedApiBaseUrl === "") {
    throw buildConfigError("The value is empty");
  }

  if (["undefined", "null"].includes(trimmedApiBaseUrl.toLowerCase())) {
    throw buildConfigError(`The literal "${trimmedApiBaseUrl}" is not valid`);
  }

  let parsedApiBaseUrl;

  try {
    parsedApiBaseUrl = new URL(trimmedApiBaseUrl);
  } catch {
    throw buildConfigError("The value is not a valid absolute URL");
  }

  if (!["http:", "https:"].includes(parsedApiBaseUrl.protocol)) {
    throw buildConfigError("Only HTTP and HTTPS URLs are supported");
  }

  return trimmedApiBaseUrl.replace(/\/+$/, "");
}

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
