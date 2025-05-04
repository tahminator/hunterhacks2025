export const apiFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(`${process.env.EXPO_PUBLIC_API_URL}${input}`, init);
};
