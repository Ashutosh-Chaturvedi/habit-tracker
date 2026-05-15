import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
})

// Users
export const createUser = (username) => 
    API.post("/users/", { username })

// Habits
export const createHabit = (userId, habit) => 
    API.post(`/habits/${userId}`, habit)

// Logs
export const logActivity = (userId, habitId, log) =>
    API.post(`/logs/${userId}/${habitId}`, log)

export const getHeatmap = (habitId, year) =>
    API.get(`/logs/${habitId}/heatmap`, { params: { year } })

export const getHabits = (userId) =>        // ← add this
    API.get(`/habits/${userId}`)

export const deleteHabit = (habitId) => 
    API.delete(`/habits/${habitId}`)

export const getUser = (username) =>
    API.get(`/users/${username}`)