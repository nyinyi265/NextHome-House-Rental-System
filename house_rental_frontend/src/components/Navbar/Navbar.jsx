import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";
import env from "../../environment/environment";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
    if (user?.role === 'landlord') {
      navigate('/landlord/profile');
    } else {
      navigate('/tenant/profile');
    }
  };

  const handleResetPasswordClick = () => {
    setProfileOpen(false);
    navigate('/reset-password');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      <div className="text-xl font-bold text-primary">
        <Link to="/" className="no-underline text-primary">NextHome</Link>
      </div>
      <ul className="flex gap-6 list-none m-0 p-0">
        <li>
          <Link to="/" className="no-underline text-gray-700 text-base hover:text-primary">Home</Link>
        </li>
        <li>
          <Link to="/explore" className="no-underline text-gray-700 text-base hover:text-primary">Explore</Link>
        </li>
        {user && user.role === 'tenant' && (
          <li>
            <Link to="/my-rentals" className="no-underline text-gray-700 text-base hover:text-primary">My Rentals</Link>
          </li>
        )}
        {user && user.role === 'landlord' && (
          <li>
            <Link to="/landlord" className="no-underline text-gray-700 text-base hover:text-primary">Dashboard</Link>
          </li>
        )}
        <li>
          <Link to="/about" className="no-underline text-gray-700 text-base hover:text-primary">About</Link>
        </li>
        {user && user.role === 'landlord' && (
          <li>
            <Link to="/host" className="no-underline text-gray-700 text-base hover:text-primary">Become a Host</Link>
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
            <span className="text-gray-700 text-sm hidden sm:inline">{user.name || 'User'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
              <div className="p-4 border-b">
                <p className="font-medium text-gray-900">{user.name || 'User'}</p>
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
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link 
            to="/login" 
            className="ml-4 px-4 py-2 bg-primary text-white rounded cursor-pointer text-base no-underline border-none hover:opacity-90"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="ml-2 px-4 py-2 bg-primary text-white rounded cursor-pointer text-base no-underline border-none hover:opacity-90"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
