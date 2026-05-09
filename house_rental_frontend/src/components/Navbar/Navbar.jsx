import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, LogOut, ChevronDown, Loader2, Bell } from "lucide-react";
import env from "../../environment/environment";
import api from "../../config/api";
import { useEffect } from "react";

export default function Navbar() {
  const { user, logout, logoutLoading, token } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sseConnected, setSseConnected] = useState(false);
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

  // Fetch notifications for tenant or landlord
  useEffect(() => {
    if (user && token) {
      if (user.role === "tenant") {
        fetchNotifications();
        window.addEventListener('rentalApplicationSubmitted', fetchNotifications);
        return () => {
          window.removeEventListener('rentalApplicationSubmitted', fetchNotifications);
        };
      } else if (user.role === "landlord") {
        fetchNotifications();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
      setNotificationsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(api.tenant.notifications(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        const notifs = result.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.read_at).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const toggleNotifications = async () => {
    const newState = !notificationsOpen;
    setNotificationsOpen(newState);
    if (newState && user && token) {
      await fetchNotifications();
    }
  };

  const markAsRead = async (id, url = null) => {
    try {
      await fetch(`${api.tenant.notifications()}/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (url) {
        navigate(url);
      }
      setNotificationsOpen(false);
      setProfileOpen(false);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // SSE connection for real-time notifications
  useEffect(() => {
    let eventSource = null;

    if (user && token && notificationsOpen) {
      // Get last notification ID
      const lastId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) : 0;
      
      // Determine API endpoint based on user role
      const baseEndpoint = user.role === "tenant" ? api.tenant.notifications() : api.landlord.notifications();
      
      // Use query param for token since EventSource doesn't support custom headers
      const sseUrl = `${baseEndpoint}/stream?last_id=${lastId}&token=${encodeURIComponent(token)}`;
      
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('notification', (event) => {
        const data = JSON.parse(event.data);
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      eventSource.addEventListener('error', (err) => {
        console.error('SSE error:', err);
        if (eventSource) {
          eventSource.close();
          setSseConnected(false);
        }
      });

      eventSource.onopen = () => {
        console.log('SSE connected');
        setSseConnected(true);
      };
    }

    return () => {
      if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, notificationsOpen, notifications]);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <div>
        <Link to="/" className="no-underline">
          <img 
            src="/NextHomeLogo.png" 
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
        <li>
          <NavLink
            to="/landlord-register"
            className={({ isActive }) => 
              `no-underline px-4 py-2 rounded-lg text-base font-medium transition ${isActive 
                ? "bg-green-100 text-green-700" 
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`
            }
          >
            Become a Landlord
          </NavLink>
        </li>
      </ul>
      {user ? (
        <div className="flex items-center gap-2">
  {/* Notifications for tenants and landlords */}
  {(user.role === "tenant" || user.role === "landlord") && (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleNotifications();
        }}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  // onClick={() => markAsRead(notification.id, notification.url)}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read_at ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )}

          {/* Profile Dropdown */}
          <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen(!profileOpen);
            }}
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
             <div 
               className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
               onClick={(e) => e.stopPropagation()}
             >
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
