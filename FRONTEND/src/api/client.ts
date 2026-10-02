import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: "192.168.10.135:3000/api",
  headers: { "Content-Type": "application/json" },
});