import { refreshSession } from "@/features/auth/services/authApi";

// If several requests fail together, they all wait for one refresh call
let refreshing: Promise<string | null> | null = null;

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
}

function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export async function fetchWithAuth(url: string, init: RequestInit = {}): Promise<Response> {
  const send = (token: string | null) =>
    fetch(url, {
      ...init,
      headers: {
        ...((init.headers as Record<string, string>) || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const res = await send(getToken());
  if (res.status !== 401) return res;

  // Access token rejected: try one refresh, then retry once
  if (!refreshing) {
    refreshing = refreshSession().finally(() => {
      refreshing = null;
    });
  }
  const newToken = await refreshing;

  if (!newToken) {
    forceLogout();
    return res;
  }
  return send(newToken);
}