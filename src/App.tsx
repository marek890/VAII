import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Login from "./forms/Login";
import Register from "./forms/Register";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
