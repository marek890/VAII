import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Link } from "react-router-dom";
import { BsCalendarCheck } from "react-icons/bs";
import { IoCar } from "react-icons/io5";
import { FaTools } from "react-icons/fa";

function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5001/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserName(data.name || ""))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl/20 mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Vitajte vo VajkoServise
          </h1>

          {userName && (
            <p className="text-lg text-gray-700">
              Prihlásený používateľ:{" "}
              <span className="font-semibold text-gray-900">{userName}</span>
            </p>
          )}

          <p className="text-gray-600 mt-3 text-lg">
            Jednoduchý rezervačný systém pre autoservis. Spravujte vozidlá,
            rezervácie a svoj profil.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            to="/reservation"
            className="bg-white p-7 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
          >
            <BsCalendarCheck className="text-[#78e778] text-6xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Vytvoriť rezerváciu
            </h3>
            <p className="text-gray-600">
              Vyberte vozidlo a zarezervujte si termín servisnej prehliadky.
            </p>
          </Link>

          <Link
            to="/vehicles"
            className="bg-white p-7 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
          >
            <IoCar className="text-[#78e778] text-6xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Moje vozidlá
            </h3>
            <p className="text-gray-600">
              Spravujte svoje autá — pridávajte nové alebo upravujte existujúce.
            </p>
          </Link>

          <Link
            to="/my-reservations"
            className="bg-white p-7 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
          >
            <FaTools className="text-[#78e778] text-6xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Moje rezervácie
            </h3>
            <p className="text-gray-600">
              Zobraziť nadchádzajúce a minulé servisné termíny.
            </p>
          </Link>
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-xl/25 text-center mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Potrebujete pomoc?
          </h3>
          <p className="text-gray-700 text-lg">
            Kontaktujte nás:
            <span className="font-semibold"> +421 900 123 456</span>
            <br />
            Email: <span className="font-semibold">info@vajkoservis.sk</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
