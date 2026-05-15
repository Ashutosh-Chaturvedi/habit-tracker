function Navbar({ onNewHabit, onLogout, isLoggedIn }) {
    return (
        <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-500" />
                <span className="font-semibold text-white text-lg">Habit Tracker</span>
            </div>

            {isLoggedIn && (
                <div className="flex items-center gap-3">
                    <button
                        onClick={onNewHabit}
                        className="bg-white text-gray-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        + New Habit
                    </button>
                    <button
                        onClick={onLogout}
                        className="text-sm text-gray-400 border border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar