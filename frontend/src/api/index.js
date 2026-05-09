import axios from "axios"

const API = axios.create({
    baseURL: "https://habit-tracker-b7iv.onrender.com"
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