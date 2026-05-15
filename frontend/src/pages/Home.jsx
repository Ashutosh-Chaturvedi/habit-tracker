import { useState } from "react"
import { createUser, createHabit, getHabits, getUser } from "../api"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal"
import HabitCard from "../components/HabitCard"

function Home() {
    const [userId, setUserId] = useState("")
    const [username, setUsername] = useState("")
    const [habits, setHabits] = useState([])
    const [habitName, setHabitName] = useState("")
    const [habitColor, setHabitColor] = useState("#42a5f5")
    const [showUserModal, setShowUserModal] = useState(false)
    const [showHabitModal, setShowHabitModal] = useState(false)
    const [message, setMessage] = useState("")
    const [currentUsername, setCurrentUsername] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    const handleCreateUser = async () => {
        try {
            const res = await createUser(username)
            setUserId(String(res.data.id))
            setCurrentUsername(res.data.username)
            setShowUserModal(false)
            setUsername("")
            setModalMessage("")
            const habitsRes = await getHabits(String(res.data.id))
            setHabits(habitsRes.data)
        } catch (err) {
            setModalMessage(err.response?.data?.detail || "Error creating user")
        }
    }

    const handleFindUser = async () => {
        try {
            const res = await getUser(username)
            setUserId(String(res.data.id))
            setCurrentUsername(res.data.username)
            setShowUserModal(false)
            setUsername("")
            setModalMessage("")
            const habitsRes = await getHabits(String(res.data.id))
            setHabits(habitsRes.data)
        } catch (err) {
            setModalMessage("User not found — try creating an account!")
        }
    }

    const handleLogout = () => {
        setUserId("")
        setCurrentUsername("")
        setHabits([])
        setMessage("")
    }

    const handleCreateHabit = async () => {
        try {
            await createHabit(userId, { name: habitName, color: habitColor })
            const res = await getHabits(userId)
            setHabits(res.data)
            setShowHabitModal(false)
            setHabitName("")
            setHabitColor("#42a5f5")
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error creating habit")
        }
    }

    const handleLoadHabits = async () => {
        try {
            const res = await getHabits(userId)
            setHabits(res.data)
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error loading habits")
        }
    }

    const handleDeleteHabit = (habitId) => {
        setHabits(prev => prev.filter(h => h.id !== habitId))
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar
                onNewHabit={() => setShowHabitModal(true)}
                onLogout={handleLogout}
                isLoggedIn={!!userId}
            />

            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Welcome / User section */}
                {!userId ? (
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-semibold mb-3">Welcome to Habit Tracker</h1>
                        <p className="text-gray-500 mb-8">Track your daily habits and visualize your consistency.</p>
                        <button
                            onClick={() => setShowUserModal(true)}
                            className="bg-white text-gray-950 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <>
                        {/* User bar */}
                        <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-gray-500 text-sm">Logged in as</p>
                            <p className="text-white font-medium">
                                {currentUsername} <span className="text-gray-600 text-sm">#{userId}</span>
                            </p>
                        </div>
                    </div>

                        {/* Message */}
                        {message && (
                            <p className="text-green-400 text-sm mb-4">{message}</p>
                        )}

                        {/* Habits list */}
                        {habits.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl">
                                <p className="text-gray-600 mb-4">No habits yet</p>
                                <button
                                    onClick={() => setShowHabitModal(true)}
                                    className="text-sm text-white border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                                >
                                    + Create your first habit
                                </button>
                            </div>
                        ) : (
                            habits.map(habit => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    userId={userId}
                                    onDelete={handleDeleteHabit}
                                />
                            ))
                        )}
                    </>
                )}
            </div>

            <Modal
                isOpen={showUserModal}
                onClose={() => { setShowUserModal(false); setModalMessage("") }}
                title="Welcome"
            >
                <div className="flex flex-col gap-4">
                    <input
                        className="bg-gray-950 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gray-500"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {modalMessage && (
                        <p className="text-red-400 text-sm">{modalMessage}</p>
                    )}
                    <button
                        onClick={handleCreateUser}
                        className="bg-white text-gray-950 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Create Account
                    </button>
                    <button
                        onClick={handleFindUser}
                        className="border border-gray-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                        Find my account
                    </button>
                </div>
            </Modal>

            {/* Create Habit Modal */}
            <Modal
                isOpen={showHabitModal}
                onClose={() => setShowHabitModal(false)}
                title="New Habit"
            >
                <div className="flex flex-col gap-4">
                    <input
                        className="bg-gray-950 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-gray-500"
                        placeholder="Habit name"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <label className="text-gray-400 text-sm">Color</label>
                        <input
                            type="color"
                            value={habitColor}
                            onChange={(e) => setHabitColor(e.target.value)}
                            className="cursor-pointer rounded"
                        />
                    </div>
                    <button
                        onClick={handleCreateHabit}
                        className="bg-white text-gray-950 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Create Habit
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default Home