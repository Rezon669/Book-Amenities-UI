// const API_BASE = process.env.VITE_API_BASE || "http://localhost:8080/api/book-amenities";

// async function request(path, options = {}) {
//   const token = localStorage.getItem("token");
//   const headers = options.headers || {};
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   headers["Content-Type"] = headers["Content-Type"] || "application/json";

//   const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
//   return res;
// }

// export async function getProfile(userId) {
//   return request(`/users/${userId}`, { method: "GET" });
// }

// export async function deleteAccount(userId) {
//   return request(`/users/${userId}`, { method: "DELETE" });
// }

// export async function logout() {
//   return request(`/logout`, { method: "POST" });
// }

// export default { request, getProfile, deleteAccount, logout };
