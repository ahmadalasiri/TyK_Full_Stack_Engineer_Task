const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function handleResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      data && data.error ? data.error : { message: "Request failed" };
    const err = new Error(error.message || "Request failed");
    err.code = error.code;
    err.fieldErrors = error.field_errors || error.fieldErrors || {};
    throw err;
  }
  return data;
}

export async function checkUsernameAvailability(username) {
  if (!username || username.length < 6) {
    return { username, available: false };
  }
  const res = await fetch(
    `${API_BASE}/api/username-availability?username=${encodeURIComponent(
      username
    )}`
  );
  return handleResponse(res);
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
