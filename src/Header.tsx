import "./Header.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { IoCar } from "react-icons/io5";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 border-b border-gray-200 px-6 py-3 shadow-md z-50">
      <div className="flex justify-between items-center w-full">
        <Link
          to="/"
          className="text-4xl tracking-tight text-gray-500 hover:text-[#78E778] transition-all duration-200 flex items-center"
        >
          <IoCar className="mr-1" />
          VajkoServis
        </Link>

        <ul className="hidden md:flex items-center space-x-6 text-lg">
          <li>
            <Link
              to="/"
              className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium transition-all duration-200 hover:shadow-md hover:text-[#78E778]"
            >
              Domov
            </Link>
          </li>
          <li>
            <Link
              to="/reservation"
              className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium transition-all duration-200 hover:shadow-md hover:text-[#78E778]"
            >
              Rezervácia
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium transition-all duration-200 hover:shadow-md hover:text-[#78E778]"
            >
              Kontakt
            </Link>
          </li>
        </ul>

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="hidden md:inline-block px-6 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-semibold transition-all duration-200 hover:bg-[#78E778] hover:text-white hover:shadow-lg"
          >
            Prihlásiť sa
          </Link>
        ) : (
          <div className="hidden md:block relative">
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-[#78E778] hover:text-white transition-all duration-200"
            >
              Môj účet ▾
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-2 z-50 text-gray-600">
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profil
                </Link>
                <Link
                  to="/vehicles"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Vozidlá
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 text-red-500"
                >
                  Odhlásiť sa
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className="md:hidden text-2xl text-gray-500"
          onClick={toggleMenu}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <ul className="flex flex-col mt-3 space-y-2 md:hidden pb-4">
          <li>
            <Link
              to="/"
              className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Domov
            </Link>
          </li>
          <li>
            <Link
              to="/reservation"
              className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Rezervácia
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Kontakt
            </Link>
          </li>

          {!isLoggedIn ? (
            <li>
              <Link
                to="/login"
                className="block px-4 py-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-[#78E778] hover:text-white transition-all duration-200"
                onClick={toggleMenu}
              >
                Prihlásiť sa
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  onClick={toggleMenu}
                >
                  Profil
                </Link>
              </li>
              <li>
                <Link
                  to="/vehicles"
                  className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  onClick={toggleMenu}
                >
                  Vozidlá
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Odhlásiť sa
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Header;
