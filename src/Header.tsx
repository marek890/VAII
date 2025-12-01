import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 px-10 py-3 shadow-md z-50">
      <div className="flex justify-between items-center w-full">
        <a
          href="/"
          className="navbar-text text-3xl font-bold tracking-tight text-gray-500 decoration-none transition-all duration-200 hover:text-[#78E778]"
        >
          Brand
        </a>

        <ul className="hidden md:flex items-center space-x-6 text-lg">
          <li>
            <a
              href="/"
              className="navbar-text inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 
            font-medium decoration-none transition-all duration-200 
            hover:bg-gray-200 hover:shadow-md hover:text-[#78E778]"
            >
              Domov
            </a>
          </li>

          <li>
            <a
              href="#"
              className="navbar-text inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 
            font-medium decoration-none transition-all duration-200 
            hover:bg-gray-200 hover:shadow-md hover:text-[#78E778]"
            >
              Rezervácia
            </a>
          </li>

          <li>
            <a
              href="#"
              className="navbar-text inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-500 
            font-medium transition-all duration-200 
            hover:bg-gray-200 hover:shadow-md hover:text-[#78E778]"
            >
              Kontakt
            </a>
          </li>
        </ul>

        <Link
          to="/login"
          className="navbar-text-form inline-block px-6 py-2.5 rounded-xl bg-gray-900 text-white 
        font-semibold decoration-none transition-all duration-200 
        hover:bg-[#78E778] hover:shadow-lg"
        >
          Prihlásiť sa
        </Link>
      </div>
    </nav>
  );
}
export default Header;
