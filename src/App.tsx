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
        <Route path="/forms" element={<Login />} />
        <Route path="/forms" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
