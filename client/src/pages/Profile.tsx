import { useEffect, useState } from "react";
import { IoPersonCircle, IoLockClosed } from "react-icons/io5";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileMessageType, setProfileMessageType] = useState<
    "error" | "success"
  >("success");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState<
    "error" | "success"
  >("success");

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:5001/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    setFirstName(data.first_name || "");
    setLastName(data.last_name || "");
    setPhone(data.phone || "");
    setEmail(data.email || "");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileMessageType("error");
        setProfileMessage(data.error || "Chyba pri ukladaní profilu.");
        return;
      }

      setProfileMessageType("success");
      setProfileMessage("Profil bol aktualizovaný.");
    } catch {
      setProfileMessageType("error");
      setProfileMessage("Nepodarilo sa spojiť so serverom.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setPasswordMessageType("error");
      setPasswordMessage("Nové heslo musí mať aspoň 8 znakov.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessageType("error");
      setPasswordMessage("Heslá sa nezhodujú.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessageType("error");
        setPasswordMessage(data.error || "Zmena hesla zlyhala.");
        return;
      }

      setPasswordMessageType("success");
      setPasswordMessage("Heslo bolo úspešne zmenené.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setPasswordMessageType("error");
      setPasswordMessage("Nepodarilo sa spojiť so serverom.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b mt-5 from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10">
      <div className="max-w-2xl mx-auto py-10 ">
        <div className="bg-white p-4 rounded-xl shadow-xl/25 mb-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-2">
            <IoPersonCircle className="text-4xl text-[#78e778]" />
            Môj profil
          </h2>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="bg-white p-6 rounded-xl shadow-xl/25 mb-10"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Osobné údaje
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Meno
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Priezvisko
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Telefón
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                E-mail
              </label>
              <input
                value={email}
                disabled
                className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>
          </div>

          <button className="w-full mt-6 px-4 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold hover:bg-[#78e778] hover:text-white transition">
            Uložiť zmeny
          </button>
          {profileMessage && (
            <p
              className={`text-center mt-4 ${
                profileMessageType === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {profileMessage}
            </p>
          )}
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-6 rounded-xl shadow-xl/25"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <IoLockClosed />
            Zmena hesla
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Aktuálne heslo
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nové heslo
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Potvrď nové heslo
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
              />
            </div>
          </div>

          <button className="w-full mt-6 px-4 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold hover:bg-[#78e778] hover:text-white transition">
            Zmeniť heslo
          </button>
          {passwordMessage && (
            <p
              className={`text-center mt-4 ${
                passwordMessageType === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {passwordMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
