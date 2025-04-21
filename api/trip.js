import axios from "axios";

const tripApi = axios.create({
  baseURL: "http://34.49.45.45" + "/trips",
});

tripApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default tripApi;
