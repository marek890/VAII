import "./Header.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 border-b border-gray-200 px-6 py-3 shadow-md z-50">
      <div className="flex justify-between items-center w-full">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-gray-500 hover:text-[#78E778] transition-all duration-200"
        >
          Brand
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

        <Link
          to="/login"
          className="hidden md:inline-block px-6 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-semibold transition-all duration-200 hover:bg-[#78E778] hover:text-white hover:shadow-lg"
        >
          Prihlásiť sa
        </Link>

        <button
          className="md:hidden text-2xl text-gray-500"
          onClick={toggleMenu}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <ul className="flex flex-col mt-3 space-y-2 md:hidden">
          <li>
            <Link
              to="/"
              className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Domov
            </Link>
          </li>
          <li>
            <Link
              to="/reservation"
              className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Rezervácia
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Kontakt
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="block px-4 py-2 rounded-xl bg-gray-100 text-gray-500 font-medium hover:bg-[#78E778] hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Prihlásiť sa
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Header;
