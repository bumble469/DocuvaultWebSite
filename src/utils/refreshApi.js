import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const refreshApi = async (url, options = {}) => {
  const method = (options.method || "GET").toLowerCase();

  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (method === "get" || method === "delete") {
    return axios[method](`${API_URL}${url}`, config);
  }

  return axios[method](
    `${API_URL}${url}`,
    options.data || {},   
    config                
  );
};

export default refreshApi;