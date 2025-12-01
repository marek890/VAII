import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Login from "./forms/Login";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" />
        <Route path="/forms" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
