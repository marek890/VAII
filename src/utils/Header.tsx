import "./Header.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { IoCar } from "react-icons/io5";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    setMobileDropdown(false);
    window.location.href = "/login";
  };

  return (
    <nav className="header-nav">
      <div className="flex justify-between items-center w-full">
        <Link to="/" className="header-logo">
          <IoCar className="mr-1" />
          VajkoServis
        </Link>

        <ul className="nav-list hidden md:flex">
          <li>
            <Link to="/" className="nav-link">
              Domov
            </Link>
          </li>
          <li>
            <Link to="/reservation" className="nav-link">
              Rezervácia
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Kontakt
            </Link>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className="hidden md:block relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="account-btn"
            >
              Môj účet ▾
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  Profil
                </Link>
                <Link to="/vehicles" className="dropdown-item">
                  Vozidlá
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Odhlásiť sa
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="account-btn hidden md:inline-block">
            Prihlásiť sa
          </Link>
        )}

        <button
          className="md:hidden text-2xl text-gray-600"
          onClick={toggleMenu}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 md:hidden bg-white p-4 rounded-xl shadow-lg">
          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/" className="nav-link w-full text-center">
                Domov
              </Link>
            </li>
            <li>
              <Link to="/reservation" className="nav-link w-full text-center">
                Rezervácia
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link w-full text-center">
                Kontakt
              </Link>
            </li>
          </ul>

          {isLoggedIn ? (
            <div className="mt-4">
              <button
                onClick={() => setMobileDropdown(!mobileDropdown)}
                className="account-btn w-full text-center"
              >
                Môj účet ▾
              </button>

              {mobileDropdown && (
                <div className="mt-2 w-full bg-gray-50 shadow-sm rounded-xl flex flex-col overflow-hidden">
                  <Link
                    to="/profile"
                    className="dropdown-item py-3 text-center"
                  >
                    Profil
                  </Link>
                  <Link
                    to="/vehicles"
                    className="dropdown-item py-3 text-center"
                  >
                    Vozidlá
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="logout-btn py-3 text-center"
                  >
                    Odhlásiť sa
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="account-btn w-full block text-center mt-4"
            >
              Prihlásiť sa
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
