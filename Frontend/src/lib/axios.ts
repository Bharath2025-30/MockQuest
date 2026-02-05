import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,   //allows browser to send cookies to server automatically, on every single req
});

export default axiosInstance;