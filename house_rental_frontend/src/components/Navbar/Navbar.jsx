import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, LogOut, ChevronDown, Loader2 } from "lucide-react";
import env from "../../environment/environment";

export default function Navbar() {
  const { user, logout, logoutLoading } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
    if (user?.role === "landlord") {
      navigate("/landlord/profile");
    } else {
      navigate("/tenant/profile");
    }
  };

  const handleResetPasswordClick = () => {
    setProfileOpen(false);
    navigate("/reset-password");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <div>
        <Link to="/" className="no-underline">
          <img 
            src="/logo512.png" 
            alt="NextHome" 
            className="h-[50px] w-auto"
          />
        </Link>
      </div>
      <ul className="flex gap-x-2 list-none m-0 p-0 items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => 
              `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                ? "bg-green-100 text-green-700" 
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) => 
              `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                ? "bg-green-100 text-green-700" 
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
            }
          >
            Explore
          </NavLink>
        </li>
        {user && user.role === "tenant" && (
          <li>
            <NavLink
              to="/my-rentals"
              className={({ isActive }) => 
                `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                  ? "bg-green-100 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
              }
            >
              My Rentals
            </NavLink>
          </li>
        )}
        {user && user.role === "tenant" && (
          <li>
            <NavLink
              to="/my-applications"
              className={({ isActive }) => 
                `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                  ? "bg-green-100 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
              }
            >
              My Applications
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => 
              `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                ? "bg-green-100 text-green-700" 
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => 
              `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                ? "bg-green-100 text-green-700" 
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
            }
          >
            Contact Us
          </NavLink>
        </li>
        {user && user.role === "landlord" && (
          <li>
            <NavLink
              to="/host"
              className={({ isActive }) => 
                `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                  ? "bg-green-100 text-green-700" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
              }
            >
              Become a Host
            </NavLink>
          </li>
        )}
      </ul>
      {user ? (
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            {/* Profile Picture or Default Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {/* <span>{user.profile_path}</span> */}
              {user.profile_path ? (
                <img
                  src={env.getProfileUrl(user.profile_path)}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </div>
            <span className="text-gray-700 text-sm hidden sm:inline">
              {user.name || "User"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
              <div className="p-4 border-b">
                <p className="font-medium text-gray-900">
                  {user.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer bg-transparent border-none text-left"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
                >
                  {logoutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 bg-primary text-white rounded cursor-pointer text-base no-underline border-none hover:opacity-90"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-primary text-white rounded cursor-pointer text-base no-underline border-none hover:opacity-90"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
