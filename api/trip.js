import axios from "axios";

const tripApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TRIP_SERVICE_URL + "/api/trips",
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
