import { Routes, Route } from "react-router-dom";
import Header from "./utils/Header";
import Login from "./forms/Login";
import Register from "./forms/Register";
import Vehicles from "./pages/Vehicles";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./pages/Profile";
import Appointment from "./pages/Appointment";
import MechanicDashboard from "./pages/MechanicDashboard";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MechanicDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
