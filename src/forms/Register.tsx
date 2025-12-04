import { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError || passwordError || confirmError) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.error || "Registrácia zlyhala");
        return;
      }

      setMessageType("success");
      setMessage(data.message || "Registrácia úspešná!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Nepodarilo sa spojiť so serverom.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value.includes("@")) {
      setEmailError("Zadaj platný e-mail");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setPasswordError("Heslo musí mať aspoň 8 znakov");
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmError("Heslá sa nezhodujú");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setConfirmError("Heslá sa nezhodujú");
    } else {
      setConfirmError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d8f5d8] via-[#b8f0b8] to-[#78e778]">
      <div className="bg-white p-8 rounded-xl shadow-xl/25 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Registrácia
        </h2>

        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              E-mail
            </label>
            <input
              required
              type="email"
              id="email"
              placeholder="tvoj@email.sk"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78E778] text-black
              ${emailError ? "border-red-500 focus:ring-red-500" : ""}`}
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
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78E778] text-black
              ${passwordError ? "border-red-500 focus:ring-red-500" : ""}`}
            />

            <p className="text-red-500 text-sm mt-1">
              {passwordError || "\u00A0"}
            </p>
          </div>

          <div>
            {" "}
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              {" "}
              Potvrď heslo{" "}
            </label>{" "}
            <input
              required
              type="password"
              id="confirmPassword"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={handleConfirmChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black
              ${confirmError ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            <p className="text-red-500 text-sm mt-1">
              {confirmError || "\u00A0"}
            </p>
          </div>

          <button
            type="submit"
            className="px-3 py-3 rounded-xl bg-gray-100 text-gray-500 
           font-semibold transition-all duration-200 
           hover:bg-[#78e778] hover:!text-white hover:shadow-lg mx-auto block disabled:opacity-50"
            disabled={!!emailError || !!passwordError || !!confirmError}
          >
            Registrovať sa
          </button>
          {message && (
            <p
              className={`text-sm mt-2 ${
                messageType === "error" ? "text-red-500" : "text-green-500"
              } text-center`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
export default Register;
