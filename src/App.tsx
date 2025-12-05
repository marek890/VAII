import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Login from "./forms/Login";
import Register from "./forms/Register";
import Vehicles from "./pages/Vehicles";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles" element={<Vehicles />} />
      </Routes>
    </>
  );
}

export default App;
