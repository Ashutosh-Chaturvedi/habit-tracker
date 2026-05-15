import { useState } from "react"
import HeatmapCalendar from "./HeatmapCalendar"
import { getHeatmap, logActivity, deleteHabit } from "../api"

function HabitCard({ habit, userId, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [heatmapData, setHeatmapData] = useState([])
    const [loaded, setLoaded] = useState(false)

    const getTodayStr = () => {
        const today = new Date()
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, "0")
        const d = String(today.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    const calculateStreak = (data) => {
        if (data.length === 0) return 0
        const dataMap = {}
        data.forEach(entry => { dataMap[entry.date] = entry.count })
        let streak = 0
        const today = new Date()
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, "0")
        const d = String(today.getDate()).padStart(2, "0")
        let current = new Date(`${y}-${m}-${d}`)
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

    const handleExpand = async () => {
        setIsExpanded(!isExpanded)
        if (!loaded) {
            try {
                const res = await getHeatmap(habit.id, 2026)
                setHeatmapData(res.data)
                setLoaded(true)
            } catch (err) {
                console.log("Error fetching heatmap:", err)
            }
        }
    }

    const handleLogToday = async () => {
        try {
            await logActivity(userId, habit.id, { date: getTodayStr(), count: 1 })
            const res = await getHeatmap(habit.id, 2026)
            setHeatmapData(res.data)
        } catch (err) {
            console.log("Error logging activity:", err)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteHabit(habit.id)
            onDelete(habit.id)
        } catch (err) {
            console.log("Error deleting habit:", err)
        }
    }

    const total = heatmapData.reduce((sum, e) => sum + e.count, 0)
    const streak = calculateStreak(heatmapData)

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl mb-3 overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={handleExpand}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-white font-medium">{habit.name}</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm">
                        {streak > 0 ? `🔥 ${streak} day streak` : "No streak yet"}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete() }}
                        className="text-gray-600 hover:text-red-400 transition-colors text-sm"
                    >
                        🗑️
                    </button>
                    <span className="text-gray-600 text-xs">
                        {isExpanded ? "▲" : "▼"}
                    </span>
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-800">
                    <div className="mt-4">
                        <HeatmapCalendar data={heatmapData} color={habit.color} year={2026} />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-6 text-sm text-gray-500">
                            <span>Total: <span className="text-white font-medium">{total}</span></span>
                            <span>Streak: <span className="text-white font-medium">{streak} days</span></span>
                        </div>

                        <button
                            onClick={handleLogToday}
                            className="bg-white text-gray-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Log Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HabitCard