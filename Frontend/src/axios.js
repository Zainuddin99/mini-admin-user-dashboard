import axios from "axios";

const token = localStorage.getItem("token");

let baseURL
if (process.env.NODE_ENV === "production") {
    baseURL = "/api";
} else {
    baseURL = "http://localhost:4000/api";
}

export const AXIOS = axios.create({ baseURL });

AXIOS.interceptors.request.use((req) => {
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});
