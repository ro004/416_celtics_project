import axios from "axios";

//Create a custom instance of the api so we don't have to rewrite backend url and can just do api.get
export const api = axios.create({
    baseURL: "/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

//Logs failed requests for easier debugging
api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API Error:", err.message);
        return Promise.reject(err);
    }
)