import { useState } from "react"
import { createUser, createHabit, getHabits } from "../api"


function Home() {

    const [userId, setUserId] = useState("")
    const [habitName, setHabitName] = useState("")
    const [habitColor, setHabitColor] = useState("#42a5f5")
    const [habits, setHabits] = useState([])

    const handleFetchHabits = async () => {
        try {
            const res = await getHabits(userId)
            setHabits(res.data)
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error fetching habits")
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
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        className="flex items-center gap-4 bg-gray-800 px-4 py-3 rounded mb-2"
                    >
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: habit.color }}
                        />
                        <span>{habit.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home