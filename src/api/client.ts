/**
 * Tiny fetch wrapper for the Spring Boot REST API.
 * - sends the JWT as "Authorization: Bearer <token>"
 * - throws ApiError with the server's {"error": "..."} message
 * - tells the app when the session has expired (401) so it can sign the user out
 */
const BASE_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
const TOKEN_KEY = 'sdc_token';

export const UNAUTHORIZED_EVENT = 'sdc:unauthorized';

export const tokenStore = {
  get: (): string | null => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (token: string): void => {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage unavailable */ }
  },
  clear: (): void => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
  }
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : 'Something went wrong. Please try again.';

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenStore.get();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Cannot reach the clinic server. Is the backend running on port 8080?', 0);
  }

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = null; }
  }

  if (!res.ok) {
    const payload = (data ?? {}) as { error?: string; message?: string };
    const message = payload.error || payload.message || `Request failed (${res.status})`;
    // A 401 on a protected call means the token is missing/expired. (Login failures are 400, not 401.)
    if (res.status === 401 && token) {
      tokenStore.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(res.status === 403 ? 'You are not allowed to do that.' : message, res.status);
  }
  return data as T;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body ?? {}),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body ?? {}),
  del: <T = void>(path: string) => request<T>('DELETE', path)
};
