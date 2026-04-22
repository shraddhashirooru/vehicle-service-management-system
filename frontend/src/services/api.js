import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 5000,
});

// REQUEST LOGGER
API.interceptors.request.use((config) => {
  console.log("API Request:", config.method.toUpperCase(), config.url);
  return config;
});

// ERROR HANDLER
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

//  VEHICLES
export const getVehicles = () => API.get("/vehicles");

export const createVehicle = (data) =>
  API.post("/vehicles", data);

//  ISSUES
export const getIssues = () => API.get("/issues");

export const createIssue = (data) =>
  API.post("/issues", data);

export const updateIssue = (id, data) =>
  API.put(`/issues/${id}`, data);

export const deleteIssue = (id) =>
  API.delete(`/issues/${id}`);

// COMPONENTS
export const getComponents = (type = null) =>
  API.get(`/components${type ? `?type=${type}` : ""}`);

export const createComponent = (data) =>
  API.post("/components", data);

export const updateComponentPrice = (id, data) =>
  API.patch(`/components/${id}/price`, data);

export const deleteComponent = (id) =>
  API.delete(`/components/${id}`);

// ISSUE COMPONENTS
export const addComponentToIssue = (data) =>
  API.post("/issue-components", data);

export const updateIssueComponent = (id, data) =>
  API.patch(`/issue-components/${id}`, data);

export const deleteIssueComponent = (id) =>
  API.delete(`/issue-components/${id}`);


//  BILLING
export const getBill = (vehicleId) =>
  API.get(`/vehicles/${vehicleId}/bill`);

// REVENUE
export const getDailyRevenue = () =>
  API.get("/revenue/daily");

export const getMonthlyRevenue = () =>
  API.get("/revenue/monthly");

export const getYearlyRevenue = () =>
  API.get("/revenue/yearly");