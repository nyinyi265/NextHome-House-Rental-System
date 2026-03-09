import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      <div className="text-xl font-bold text-emerald-600">NextHome</div>
      <ul className="flex gap-6 list-none m-0 p-0">
        <li>
          <Link to="/" className="no-underline text-gray-700 text-base hover:text-emerald-600">Home</Link>
        </li>
        <li>
          <Link to="/explore" className="no-underline text-gray-700 text-base hover:text-emerald-600">Explore</Link>
        </li>
        <li>
          <Link to="/about" className="no-underline text-gray-700 text-base hover:text-emerald-600">About</Link>
        </li>
        <li>
          <Link to="/host" className="no-underline text-gray-700 text-base hover:text-emerald-600">Become a Host</Link>
        </li>
      </ul>
      {user ? (
        <>
          <span className="text-gray-600">{user.email}</span>
          <button 
            onClick={logout}
            className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer text-base border-none hover:bg-emerald-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer text-base no-underline border-none hover:bg-emerald-700"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer text-base no-underline border-none hover:bg-emerald-700"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
