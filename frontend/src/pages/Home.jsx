import { useState } from "react"
import { createUser, createHabit, getHabits, getHeatmap, logActivity, deleteHabit } from "../api"
// import { useNavigate } from "react-router-dom"
import HeatmapCalendar from "../components/HeatmapCalendar"

function Home() {

    // const navigate = useNavigate()

    const [userId, setUserId] = useState("")
    const [habitName, setHabitName] = useState("")
    const [habitColor, setHabitColor] = useState("#42a5f5")
    const [habits, setHabits] = useState([])
    const [expandedHabitId, setExpandedHabitId] = useState(null)
    const [heatmapData, setHeatmapData] = useState({})

    const getTodayStr = () => {
        const today = new Date()
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, "0")
        const d = String(today.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    const handleLogActivity = async (habitId) => {
        try {
            await logActivity(userId, habitId, { date: getTodayStr(), count: 1 })
            const res = await getHeatmap(habitId, 2026)
            setHeatmapData(prev => ({ ...prev, [habitId]: res.data }))
            setMessage("Activity logged!")
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error logging activity")
        }
    }

    const handleFetchHabits = async () => {
        try {
            const res = await getHabits(userId)
            setHabits(res.data)
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error fetching habits")
        }
    }

    const handleDeleteHabit = async (habitId) => {
        try {
            await deleteHabit(habitId)
            setHabits(prev => prev.filter(h => h.id !== habitId))
            setMessage("Habit deleted!")
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error deleting habit")
        }

    }

    const handleCreateHabit = async () => {
        console.log("userId:", userId)
        console.log("habitName:", habitName)
        console.log("habitColor:", habitColor)
        try {
            const res = await createHabit(userId, { name: habitName, color: habitColor })
            setMessage(`Habit created: ${res.data.name}`)
            handleFetchHabits()
        } catch (err) {
            console.log("Full error:", err)
            setMessage(err.response?.data?.detail || "Error creating habit")
        }
    }

    const calculateStreak = (data) => {
        if (data.length === 0) return 0
        
        const dataMap = {}
        data.forEach(entry => { dataMap[entry.date] = entry.count })
        
        let streak = 0
        const today = new Date()
        
        // Build today's date string without timezone issues
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, "0")
        const d = String(today.getDate()).padStart(2, "0")
        
        let current = new Date(`${y}-${m}-${d}`)  // midnight local time, no timezone shift
        
        while (true) {
            const dateStr = current.toISOString().split("T")[0]
            if (dataMap[dateStr]) {
                streak++
                current.setDate(current.getDate() - 1)
            } else {
                break
            }
        }
        return streak
    }

    const handleExpandHabit = async (habitId) => {
        if (expandedHabitId === habitId) {
            setExpandedHabitId(null)  // collapse if already open
            return
        }
        setExpandedHabitId(habitId)
        if (!heatmapData[habitId]) {  // only fetch if not already fetched
            try {
                const res = await getHeatmap(habitId, 2026)
                console.log("Fetched heatmap:", res.data)
                setHeatmapData(prev => ({ ...prev, [habitId]: res.data }))
            } catch (err) {
                console.log("Error fetching heatmap:", err)
            }
        }
    }

    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")

    const handleCreateUser = async () => {
        try {
            const res = await createUser(username)
            setMessage(`User created with ID: ${res.data.id}`)
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error occurred")
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">Habit Tracker</h1>

            <div className="mb-4">
                <input
                    className="bg-gray-800 text-white px-4 py-2 rounded mr-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleCreateUser}
                >
                    Create User
                </button>
            </div>

            {message && <p className="text-green-400">{message}</p>}

            <div className="mb-4 mt-8">
                <h2 className="text-xl font-semibold mb-4">Create Habit</h2>
                <input
                    className="bg-gray-800 text-white px-4 py-2 rounded mr-2"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    className="bg-gray-800 text-white px-4 py-2 rounded mr-2"
                    placeholder="Habit name"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                />
                <input
                    type="color"
                    value={habitColor}
                    onChange={(e) => setHabitColor(e.target.value)}
                    className="mr-2 cursor-pointer"
                />
                <button
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleCreateHabit}
                >
                    Create Habit
                </button>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
                <button
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 mb-4"
                    onClick={handleFetchHabits}
                >
                    Load Habits
                </button>
                {habits.map(habit => {
                    const isExpanded = expandedHabitId === habit.id
                    const data = heatmapData[habit.id] || []
                    const total = data.reduce((sum, e) => sum + e.count, 0)
                    const streak = calculateStreak(data)

                    return (
                        <div key={habit.id} className="bg-gray-800 rounded mb-2">
                            {/* Header row */}
                            <div
                                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 rounded"
                                onClick={() => handleExpandHabit(habit.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: habit.color }}
                                    />
                                    <span>{habit.name}</span>
                                </div>
                                <span className="text-gray-400">{isExpanded ? "▲" : "▼"}</span>
                                <button
                                    className="text-red-400 hover:text-red-300 text-sm px-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteHabit(habit.id)
                                    }}
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Expandable section */}
                            {isExpanded && (
                                <div className="px-4 pb-4">
                                    <HeatmapCalendar data={data} color={habit.color} year={2026} />
                                    <div className="flex gap-8 mt-4 text-sm text-gray-400">
                                        <span>Total: <span className="text-white font-bold">{total}</span></span>
                                        <span>Current Streak: <span className="text-white font-bold">{streak} days</span></span>
                                        <button
                                            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mt-4 text-sm"
                                            onClick={() => handleLogActivity(habit.id)}
                                        >
                                            Log Today
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Home