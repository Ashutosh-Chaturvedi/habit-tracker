import Home from "./pages/Home"
import { Routes, Route } from "react-router-dom"
import HabitDetail from "./pages/HabitDetail"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habit/:habitId" element={<HabitDetail />} />
        </Routes>
    )
}

export default App