import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getHeatmap } from "../api"
import HeatmapCalendar from "../components/HeatmapCalendar"

function HabitDetail() {
    const { habitId } = useParams()
    const [heatmapData, setHeatmapData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getHeatmap(habitId, 2026)
                setHeatmapData(res.data)
            } catch (err) {
                console.log("Error fetching heatmap:", err)
            }
        }
        fetchData()
    }, [habitId])

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">Habit Detail</h1>
            <HeatmapCalendar data={heatmapData} color="#42a5f5" year={2026} />
        </div>
    )
}

export default HabitDetail