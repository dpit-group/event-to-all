import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api", // Use the Android emulator's loopback address
  // baseURL: "192.168.10.135:3000/api",
   headers: { "Content-Type": "application/json" },
});