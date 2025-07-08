import axios from "axios";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BackEndUrl,
  withCredentials: true,
});

export default api;