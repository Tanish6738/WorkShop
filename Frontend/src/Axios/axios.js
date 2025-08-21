import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // allow sending/receiving HTTP-only refresh token cookies
});

export default instance;
