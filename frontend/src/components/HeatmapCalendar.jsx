import { useMemo } from "react"

function HeatmapCalendar({ data, color = "#42a5f5", year = 2026 }) {
    // console.log("HeatmapCalendar received data:", data)
    const dataMap = useMemo(() => {
        const map = {}
        data.forEach(entry => {
            map[entry.date] = entry.count
        })
        return map
    }, [data])

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
        if (count === 3) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`   
        if (count === 2) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.50)`  
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`                   
    }

    const formatDate = (date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4">
            {Array.from({ length: 12 }, (_, monthIndex) => {
                const days = []
                const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
                for (let d = 1; d <= daysInMonth; d++) {
                    days.push(new Date(year, monthIndex, d))
                }

                const weeks = []
                const firstDay = days[0].getDay() 

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