import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d8f5d8] via-[#b8f0b8] to-[#78e778]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Prihlásenie
        </h2>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="tvoj@email.sk"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78E778]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Heslo
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78E778]"
            />
          </div>

          <button
            type="submit"
            className="px-3 py-3 rounded-xl bg-gray-100 text-gray-500 
           font-semibold transition-all duration-200 
           hover:bg-[#78e778] hover:!text-white hover:shadow-lg mx-auto block"
          >
            Prihlásiť sa
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-4">
          Nemáš účet?{" "}
          <Link to="/register" className="text-gray-600 hover:!text-[#78e778]">
            Zaregistruj sa
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
