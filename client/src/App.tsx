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
import AdminDashboard from "./pages/AdminDashboard";

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
            <ProtectedRoute allowedRoles={["Admin", "Customer"]}>
              {" "}
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Mechanic"]}>
              {" "}
              <MechanicDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin_dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              {" "}
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
