import { useState, useEffect } from "react";

function Register() {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success",
  );

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError || passwordError || confirmError) return;

    try {
      const res = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
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
      setMessageType("error");
      setMessage("Nepodarilo sa spojiť so serverom.");
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    setFirstNameError(value.length < 2 ? "Meno musí mať aspoň 2 znaky" : "");
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    setLastNameError(
      value.length < 2 ? "Priezvisko musí mať aspoň 2 znaky" : "",
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);

    const phoneRegex = /^(\+421|0)\d{9}$/;
    setPhoneError(
      value && !phoneRegex.test(value) ? "Zadaj platné telefónne číslo" : "",
    );
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

    if (confirmPassword && value !== confirmPassword) {
      setConfirmError("Heslá sa nezhodujú");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmError(password !== value ? "Heslá sa nezhodujú" : "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 sm:px-6 overflow-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl/25 w-full max-w-md mt-30 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
          Registrácia
        </h2>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Meno</label>
            <input
              required
              type="text"
              id="firstname"
              placeholder="Jožko"
              value={firstName}
              onChange={handleFirstNameChange}
              className={`w-full px-4 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black ${
                firstNameError
                  ? "border-red-500 focus:ring-red-500 text-red-600"
                  : ""
              }`}
            />
            <p className="text-red-500 text-sm mt-1">
              {firstNameError || "\u00A0"}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Priezvisko
            </label>
            <input
              required
              type="text"
              id="lastname"
              placeholder="Mrkvička"
              value={lastName}
              onChange={handleLastNameChange}
              className={`w-full px-4 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black ${
                lastNameError
                  ? "border-red-500 focus:ring-red-500 text-red-600"
                  : ""
              }`}
            />
            <p className="text-red-500 text-sm mt-1">
              {lastNameError || "\u00A0"}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Telefónne číslo
            </label>
            <input
              required
              type="text"
              id="phonenumber"
              placeholder="+421 123 456 789"
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full px-4 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black ${
                phoneError
                  ? "border-red-500 focus:ring-red-500 text-red-600"
                  : ""
              }`}
            />
            <p className="text-red-500 text-sm mt-1">
              {phoneError || "\u00A0"}
            </p>
          </div>
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-1"
            >
              Potvrď heslo
            </label>
            <input
              required
              type="password"
              id="confirmPassword"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={handleConfirmChange}
              className={`w-full px-4 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78e778] text-black ${
                confirmError ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            <p className="text-red-500 text-sm mt-1">
              {confirmError || "\u00A0"}
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 sm:px-4 sm:py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold transition-all duration-200 hover:bg-[#78e778] hover:text-white hover:shadow-lg disabled:opacity-50"
            disabled={!!emailError || !!passwordError || !!confirmError}
          >
            Registrovať sa
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
      </div>
    </div>
  );
}

export default Register;
