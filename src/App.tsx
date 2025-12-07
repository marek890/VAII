import { Routes, Route } from "react-router-dom";
import Header from "./utils/Header";
import Login from "./forms/Login";
import Register from "./forms/Register";
import Vehicles from "./pages/Vehicles";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";

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
      </Routes>
    </>
  );
}

export default App;
