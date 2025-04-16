export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line no-undef
  return !!localStorage.getItem("token");
}

export function getUserFromLocalStorage() {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line no-undef
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
