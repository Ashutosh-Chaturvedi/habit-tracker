

import { useMemo } from "react"

function HeatmapCalendar({ data, color = "#42a5f5", year = 2026 }) {
    console.log("HeatmapCalendar received data:", data)
    // Convert array to a map for O(1) lookup { "2026-01-15": 3 }
    const dataMap = useMemo(() => {
        const map = {}
        data.forEach(entry => {
            map[entry.date] = entry.count
        })
        return map
    }, [data])

    // Generate all days of the year grouped by week
    // const weeks = useMemo(() => {
    //     const weeks = []
    //     const startDate = new Date(year, 0, 1)  // Jan 1st
    //     const endDate = new Date(year, 11, 31)  // Dec 31st

    //     // Move back to the nearest Sunday
    //     const start = new Date(startDate)
    //     start.setDate(start.getDate() - start.getDay())

    //     let current = new Date(start)
    //     while (current <= endDate) {
    //         const week = []
    //         for (let i = 0; i < 7; i++) {
    //             week.push(new Date(current))
    //             current.setDate(current.getDate() + 1)
    //         }
    //         weeks.push(week)
    //     }
    //     return weeks
    // }, [year])

    // Convert hex color to RGB for intensity calculation
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 66, g: 165, b: 245 }
    }

    const formatReadable = (date) => {
        return date.toLocaleDateString("en-US", { 
            weekday: "short",
            month: "short", 
            day: "numeric", 
            year: "numeric" 
        })
    }

    const getColor = (count) => {
        if (!count) return "#374151"      
        const rgb = hexToRgb(color)
        if (count >= 4) return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`           
        if (count === 3) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`   // 75%
        if (count === 2) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.50)`   // 50%
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`                    // 25%
    }

    const formatDate = (date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    // const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4">
            {Array.from({ length: 12 }, (_, monthIndex) => {
                // Get all days in this month
                const days = []
                const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
                for (let d = 1; d <= daysInMonth; d++) {
                    days.push(new Date(year, monthIndex, d))
                }

                // Group into weeks (columns) starting from first day
                const weeks = []
                const firstDay = days[0].getDay()  // 0=Sun, 6=Sat

                // pad the first week
                let week = Array(firstDay).fill(null)
                days.forEach(day => {
                    week.push(day)
                    if (week.length === 7) {
                        weeks.push(week)
                        week = []
                    }
                })
                if (week.length > 0) {
                    while (week.length < 7) week.push(null)
                    weeks.push(week)
                }

                return (
                    <div key={monthIndex} className="flex flex-col">
                        {/* Month label */}
                        <div className="text-xs text-gray-400 mb-2 font-medium">
                            {MONTHS[monthIndex]}
                        </div>

                        {/* Day grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[3px]">
                                    {week.map((day, di) => {
                                        if (!day) return (
                                            <div key={di} className="w-4 h-4" />
                                        )
                                        const dateStr = formatDate(day)
                                        const count = dataMap[dateStr]
                                        return (
                                            <div
                                                key={di}
                                                className="w-4 h-4 rounded cursor-pointer"
                                                style={{ backgroundColor: getColor(count) }}
                                                title={`${count || "No"} activit${count === 1 ? "y" : "ies"} on ${formatReadable(day)}`}
                                            />
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
)
}

export default HeatmapCalendar