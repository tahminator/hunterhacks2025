export function apiFetch(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${process.env.EXPO_PUBLIC_API_URL}${input}`, init);
}
