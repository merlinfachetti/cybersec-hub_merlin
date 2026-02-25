// Cliente HTTP para chamar a API
// No browser, sempre usa URL relativa para evitar erro em produção.
const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    : '';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorPayload = (await response.json()) as {
        error?: string;
        details?: string;
      };
      if (errorPayload.error) {
        message = errorPayload.details
          ? `${errorPayload.error}: ${errorPayload.details}`
          : errorPayload.error;
      }
    } catch {
      // Ignora parsing de erro quando body não for JSON
    }

    throw new ApiError(
      response.status,
      message
    );
  }

  return response.json();
}
