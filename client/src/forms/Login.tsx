import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn } from "../utils/auth";

function Login() {
  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = "/";
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError || passwordError) return;

    try {
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.error || "Prihlásenie zlyhalo");
        return;
      }

      localStorage.setItem("token", data.token);
      setMessageType("success");
      setMessage(data.message || "Prihlásenie úspešné!");
      window.location.href = "/";
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessageType("error");
      setMessage("Nepodarilo sa spojiť so serverom.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value) ? "Zadaj platný e-mail" : "");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length < 8 ? "Heslo musí mať aspoň 8 znakov" : "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 sm:px-6 overflow-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl/25 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
          Prihlásenie
        </h2>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              placeholder="tvoj@email.sk"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black ${
                emailError
                  ? "border-red-500 focus:ring-red-500 text-red-600"
                  : ""
              }`}
            />
            <p className="text-red-500 text-sm mt-1">
              {emailError || "\u00A0"}
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Heslo
            </label>
            <input
              required
              type="password"
              id="password"
              placeholder="••••••••••"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black ${
                passwordError
                  ? "border-red-500 focus:ring-red-500 text-red-600"
                  : ""
              }`}
            />
            <p className="text-red-500 text-sm mt-1">
              {passwordError || "\u00A0"}
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 sm:px-4 sm:py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold transition-all duration-200 hover:bg-[#78e778] hover:text-white hover:shadow-lg disabled:opacity-50"
            disabled={!!emailError || !!passwordError}
          >
            Prihlásiť sa
          </button>

          {message && (
            <p
              className={`text-sm mt-2 text-center ${
                messageType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Nemáš účet?{" "}
          <Link to="/register" className="text-gray-600 hover:text-[#78e778]">
            Zaregistruj sa
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
