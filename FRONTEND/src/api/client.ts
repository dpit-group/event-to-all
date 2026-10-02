import axios from "axios";

export const api = axios.create({
  baseURL: "localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});