import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://vehicle-service-backend-pflq.onrender.com/api",
});

// REQUEST LOGGER
API.interceptors.request.use((config) => {
  console.log(
  "API Request:",
  config.method.toUpperCase(),
  config.url,
  config.params ?? config.data ?? null
 );
  return config;
});

// ERROR HANDLER
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout. Try again." });
    }

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", message);

    return Promise.reject({ message, original: error, });
  }
);

//  VEHICLES
export const getVehicles = () => API.get("/vehicles");

export const createVehicle = (data) =>
  API.post("/vehicles", data);

export const updateVehicle = (id, data) =>
  API.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id) =>
  API.delete(`/vehicles/${id}`);

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
export const getBill = (vehicleId, type) =>
  API.get(`/vehicles/${vehicleId}/bill`, {
    params: type ? { type } : {},
  });

// REVENUE
export const getDailyRevenue = () =>
  API.get("/revenue/daily");

export const getMonthlyRevenue = () =>
  API.get("/revenue/monthly");

export const getYearlyRevenue = () =>
  API.get("/revenue/yearly");

// SERVICES
export const createService = (data) =>
  API.post("/service-records", data);

export const getServices = (
  status = null,
  type = null
) =>
  API.get("/service-records", {
    params: {
      ...(status && { status }),
      ...(type && { type }),
    },
  });

export const updateServiceStatus = (id, data) => {
  console.log("PATCH ID:", id, "DATA:", data); // 🔥 ADD THIS
  return API.patch(`/service-records/${Number(id)}`, data);
};