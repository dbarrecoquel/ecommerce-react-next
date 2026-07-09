// Helper à utiliser dans tous tes fetch qui nécessitent un token
// Usage : await fetchWithAuth(`${API_BASE}/basket`, getAuthHeaders())
export async function fetchWithAuth(
  url: string,
  authHeaders: Record<string, string>,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers as Record<string, string> ?? {}),
    },
  });

  // 401 = token expiré côté serveur
  if (res.status === 401) {
    // Dispatch un event custom pour que AuthContext puisse signOut
    window.dispatchEvent(new Event("auth:expired"));
  }

  return res;
}