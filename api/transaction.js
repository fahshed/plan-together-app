import axios from "axios";

const transactionApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TRANSACTION_SERVICE_URL + "/transactions",
});

transactionApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default transactionApi;
