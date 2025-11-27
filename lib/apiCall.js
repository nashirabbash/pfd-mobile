import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "https://api.portable-fitness-detector.shop/api";
const USER_TOKEN_KEY = "userToken";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token to outgoing requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

function handleData(res) {
  // consistent: return res.data if axios response
  return res && res.data ? res.data : res;
}

// --- Auth / Profile ---
export async function registerUser(payload) {
  // payload: { email, username, password, name, birthdate, role }
  const res = await api.post("/user/register", payload);
  return handleData(res);
}

export async function loginUser(email, password) {
  const res = await api.post("/user/login", { email, password });
  return handleData(res);
}

/**
 * Normalize axios errors into a friendly object: { message, status, data }
 */
export function parseApiError(error) {
  // axios error shapes: error.response, error.request, error.message
  if (!error) return { message: "Unknown error", status: null, data: null };

  // If server responded
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    // Prefer server-provided message
    const serverMsg =
      data &&
      (data.message || data.error || (typeof data === "string" ? data : null));
    let message = serverMsg || `Request failed (${status})`;

    if (status === 401)
      message = "Invalid credentials. Please check your email and password.";
    else if (status === 400)
      message = serverMsg || "Invalid request. Please check the entered data.";
    else if (status >= 500) message = "Server error. Please try again later.";

    return { message, status, data };
  }

  // Request made but no response (network error)
  if (error.request) {
    return {
      message: "Network error. Please check your internet connection.",
      status: null,
      data: null,
    };
  }

  // Fallback
  return {
    message: error.message || "An error occurred",
    status: null,
    data: null,
  };
}

export async function getServerHealth() {
  const res = await api.get("/health");
  return handleData(res);
}

export async function getProfile() {
  // docs list either /profile or /users/me; backend supports /profile
  const res = await api.get("/profile");
  return handleData(res);
}

export async function fetchUserProfile() {
  // fallback to /users/me if needed
  const res = await api.get("/users/me");
  return handleData(res);
}

export async function updateUserProfile(profileData) {
  const res = await api.patch("/users/me", profileData);
  return handleData(res);
}

// --- Profile completion / avatar ---
export async function uploadAvatar(file /* { uri, name, type } */) {
  const form = new FormData();
  // file is expected to be an object with uri, name, type (React Native)
  form.append("avatar", {
    uri: file.uri,
    name: file.name || "avatar.jpg",
    type: file.type || "image/jpeg",
  });

  const res = await api.post("/profile/complete/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return handleData(res);
}

export async function deleteAvatar() {
  const res = await api.delete("/profile/complete/avatar");
  return handleData(res);
}

export async function submitHealthData(payload) {
  // payload: { birthdate, gender, height, weight }
  const res = await api.post("/profile/complete/health-data", payload);
  return handleData(res);
}

export async function getProfileCompleteStatus() {
  const res = await api.get("/profile/complete/status");
  return handleData(res);
}

/**
 * Request OTP for logged-in user
 * Endpoint: GET /api/user/otp
 */
export async function requestOTP() {
  const res = await api.get("/user/otp");
  return handleData(res);
}

/**
 * Verify OTP code
 * Endpoint: POST /api/user/verify-otp
 */
export async function verifyOTP(code) {
  const res = await api.post("/user/verify-otp", { code });
  return handleData(res);
}

// Simple front-end logout helper: remove stored JWT token
export async function logout() {
  const res = await api.get("/user/logout");
  return handleData(res);
}

// --- User search ---
export async function searchUsers(query, { limit = 20, offset = 0 } = {}) {
  const res = await api.get("/users/search", {
    params: { query, limit, offset },
  });
  return handleData(res);
}

// --- Teams ---
export async function createTeam(body) {
  const res = await api.post("/teams", body);
  return handleData(res);
}

export async function getTeam(teamId) {
  const res = await api.get(`/teams/${teamId}`);
  return handleData(res);
}

export async function updateTeam(teamId, body) {
  const res = await api.put(`/teams/${teamId}`, body);
  return handleData(res);
}

export async function deleteTeam(teamId) {
  const res = await api.delete(`/teams/${teamId}`);
  return handleData(res);
}

export async function addTeamMember(teamId, body) {
  const res = await api.post(`/teams/${teamId}/members`, body);
  return handleData(res);
}

export async function removeTeamMember(teamId, memberId) {
  const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return handleData(res);
}

export async function getTeamDevices(teamId) {
  const res = await api.get(`/teams/${teamId}/devices`);
  return handleData(res);
}

// --- Activity / Sessions ---
export async function startActivity(body) {
  // body: { activityType, startLocation }
  const res = await api.post(`/activities/start`, body);
  return handleData(res);
}

export async function trackActivity(activityId, body) {
  // body: { trackPoints: [...] }
  const res = await api.post(`/activities/${activityId}/track`, body);
  return handleData(res);
}

export async function streamVitals(body) {
  // body: { activityId, vitalSigns: [...] }
  const res = await api.post(`/vitals/stream`, body);
  return handleData(res);
}

export async function completeActivity(activityId, body) {
  const res = await api.put(`/activities/${activityId}/complete`, body);
  return handleData(res);
}

export async function getActivity(activityId) {
  const res = await api.get(`/activities/${activityId}`);
  return handleData(res);
}

export async function getActivitiesHistory({ limit = 20, offset = 0 } = {}) {
  const res = await api.get(`/activities/history`, {
    params: { limit, offset },
  });
  return handleData(res);
}

// --- Dashboard & Reports ---
export async function getDashboardToday() {
  const res = await api.get(`/dashboard/today`);
  return handleData(res);
}

export async function generateFitnessReport(body) {
  // body: { activityId }
  const res = await api.post(`/fitness-reports/generate`, body);
  return handleData(res);
}

export async function getLatestFitnessReport() {
  const res = await api.get(`/fitness-reports/latest`);
  return handleData(res);
}

// --- History & Reports ---
export async function getHistorySessions({ limit = 20, offset = 0 } = {}) {
  const res = await api.get(`/history/sessions`, { params: { limit, offset } });
  return handleData(res);
}

export async function getHistoryReport(sessionId) {
  const res = await api.get(`/history/reports/${sessionId}`);
  return handleData(res);
}

export async function exportSessionCsv(sessionId) {
  const res = await api.get(`/export/${sessionId}/csv`, {
    responseType: "blob",
  });
  return handleData(res);
}

// --- Notifications & Coach Notes ---
export async function getNotifications({ limit = 20, offset = 0 } = {}) {
  const res = await api.get(`/notifications`, { params: { limit, offset } });
  return handleData(res);
}

export async function getCoachNotes({ limit = 20, offset = 0 } = {}) {
  const res = await api.get(`/coach-notes`, { params: { limit, offset } });
  return handleData(res);
}

// --- Devices ---
export async function getDevices() {
  const res = await api.get(`/devices`);
  return handleData(res);
}

export async function getDeviceDetails(deviceId) {
  const res = await api.get(`/devices/${deviceId}`);
  return handleData(res);
}

export async function addDevice(body) {
  // body: { serialCode, name }
  const res = await api.post(`/devices`, body);
  return handleData(res);
}

export async function removeDevice(deviceId) {
  const res = await api.delete(`/devices/${deviceId}`);
  return handleData(res);
}

export async function updateDeviceStatus(deviceId, body) {
  // body: { status, batteryLevel, firmwareVersion }
  const res = await api.patch(`/devices/${deviceId}/status`, body);
  return handleData(res);
}

export async function getDeviceLogs(deviceId, params = {}) {
  // params: { startDate, endDate }
  const res = await api.get(`/devices/${deviceId}/logs`, { params });
  return handleData(res);
}

export default api;
