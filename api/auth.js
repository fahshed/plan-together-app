import axios from "axios";

const authApi = axios.create({
  baseURL: "http://34.49.45.45" + "/api/auth",
});

authApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default authApi;
