import axios from "axios";

export const BASE_API_URL = import.meta.env.VITE_ULTRASHUB_BASE_URL || "http://localhost:8080/api";

export default axios.create({
    baseURL: BASE_API_URL,
});
