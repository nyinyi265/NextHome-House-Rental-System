import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCompare } from "../../context/CompareContext";
import {
  User,
  LogOut,
  ChevronDown,
  Loader2,
  Bell,
  Scale,
  Home,
  X,
  Menu,
  LayoutDashboard,
  FileText,
  Building2,
  Info,
  Phone,
} from "lucide-react";
import env from "../../environment/environment";
import api from "../../config/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/Dialog";

export default function Navbar() {
  const { user, logout, logoutLoading, token } = useContext(AuthContext);
  const { getCompareCount, compareProperties, removeFromCompare, clearCompare } = useCompare();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  const compareCount = getCompareCount();
  const eventSourceRef = useRef(null);

  const handleClearAll = async () => {
    setIsClearing(true);
    await clearCompare();
    setIsClearing(false);
    setShowClearDialog(false);
    setCompareOpen(false);
  };

  // Close mobile menu when navigating
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [mobileMenuOpen]);

  const fetchNotifications = useCallback(async () => {
    try {
      let url;
      if (user?.role === "landlord") {
        url = api.landlord.notifications();
      } else {
        url = api.tenant.notifications();
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        const notifs = result.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read_at).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [user?.role, token]);

  const setupSSE = useCallback(() => {
    if (!user || !token || !user.role) return;

    const streamUrl = user.role === "landlord"
      ? api.landlord.notificationsStream()
      : api.tenant.notificationsStream();

    const eventSourceUrl = `${streamUrl}?token=${token}`;
    const eventSource = new EventSource(eventSourceUrl);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("notification", (event) => {
      const newNotification = JSON.parse(event.data);
      console.log("SSE notification received:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
      if (!newNotification.read_at) {
        setUnreadCount((prev) => prev + 1);
      }

      if (
        ["rental_application_status", "rental_application_submitted", "rental_application_updated"].includes(newNotification.type)
      ) {
        console.log("Dispatching rentalStatusChanged event");
        window.dispatchEvent(new CustomEvent("rentalStatusChanged", {
          detail: newNotification,
        }));
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
      eventSourceRef.current = null;

      setTimeout(() => {
        if (user && token && !eventSourceRef.current) {
          fetchNotifications();
          setupSSE();
        }
      }, 3000);
    };
  }, [user, token, fetchNotifications]);

  useEffect(() => {
    if (!user || !token || !user.role) return;

    fetchNotifications();
    setupSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user, token, setupSSE]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    if (user?.role === "landlord") {
      navigate("/landlord/profile");
    } else {
      navigate("/tenant/profile");
    }
  };

  const toggleNotifications = useCallback(() => {
    const newState = !notificationsOpen;
    setNotificationsOpen(newState);
    if (newState) {
      setProfileOpen(false);
      setCompareOpen(false);
    }
  }, [notificationsOpen]);

  const toggleCompare = useCallback(() => {
    const newState = !compareOpen;
    setCompareOpen(newState);
    if (newState) {
      setProfileOpen(false);
      setNotificationsOpen(false);
    }
  }, [compareOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if click is outside navbar
      if (event.target.closest('nav') === null) {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setCompareOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation items configuration
  const getNavItems = () => {
    const items = [
      { path: "/", label: "Home", icon: Home },
      { path: "/explore", label: "Explore", icon: Building2 },
    ];

    if (user?.role === "tenant") {
      items.push(
        { path: "/my-rentals", label: "My Rentals", icon: LayoutDashboard },
        { path: "/my-applications", label: "My Applications", icon: FileText }
      );
    }

    items.push(
      { path: "/about", label: "About", icon: Info },
      { path: "/contact", label: "Contact Us", icon: Phone }
    );

    return items;
  };

  const renderDesktopNav = () => (
    <>
      {/* Desktop Navigation Links - Hidden on mobile, visible on lg+ */}
      <ul className="hidden lg:flex gap-1 xl:gap-2 list-none m-0 p-0 items-center">
        {getNavItems().map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `no-underline px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Desktop Right Section - Notifications, Compare, Profile */}
      <div className="hidden lg:flex items-center gap-1 xl:gap-2">
        {/* Notifications */}
        {(user?.role === "tenant" || user?.role === "landlord") && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNotifications();
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                  {unreadCount}
                </Badge>
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
                        className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                          !notification.read_at ? "bg-blue-50" : ""
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

        {/* Compare Dropdown - for tenants only */}
        {user?.role === "tenant" && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare();
              }}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={`Compare properties${compareCount > 0 ? ` (${compareCount} selected)` : ""}`}
              aria-expanded={compareOpen}
            >
              <Scale className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 text-sm hidden sm:inline">Compare</span>
              {compareCount > 0 && (
                <Badge variant="default" className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-primary text-white">
                  {compareCount}
                </Badge>
              )}
            </button>

            {/* Compare Dropdown Menu */}
            {compareOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Compare ({compareCount})</h3>
                  {compareCount > 0 && (
                    <Link
                      to="/compare"
                      onClick={() => {
                        setProfileOpen(false);
                        setNotificationsOpen(false);
                        setCompareOpen(false);
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      View All
                    </Link>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {compareProperties.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No properties selected
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {compareProperties.slice(0, 4).map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
                        >
                          {/* Property Thumbnail */}
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {property.housePhotos?.[0] ? (
                              <img
                                src={env.getImageUrl(property.housePhotos[0].photo_path)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Property Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {property.title || property.location || "Property"}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${property.price || property.price_per_month}/mo
                            </p>
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCompare(property.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            aria-label="Remove from compare"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {compareProperties.length > 0 && (
                  <div className="p-3 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowClearDialog(true);
                      }}
                      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
           </div>
        )}

           {/* Clear All Confirmation Dialog for Desktop */}
           <Dialog open={showClearDialog && !mobileMenuOpen} onOpenChange={(open) => {
              if (!open) setShowClearDialog(false);
            }}>
             <DialogHeader>
               <DialogTitle>Clear All Properties</DialogTitle>
               <DialogDescription>
                 Are you sure you want to remove all properties from the comparison list? This action cannot be undone.
               </DialogDescription>
             </DialogHeader>
             <DialogFooter>
               <Button variant="outline" onClick={() => setShowClearDialog(false)} disabled={isClearing}>
                 Cancel
               </Button>
               <Button variant="destructive" onClick={handleClearAll} disabled={isClearing}>
                 {isClearing ? (
                   <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Clearing...
                   </>
                 ) : (
                   'Clear All'
                 )}
               </Button>
             </DialogFooter>
           </Dialog>

            {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(!profileOpen);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="User menu"
              aria-expanded={profileOpen}
            >
            {/* Profile Picture or Default Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user?.profile_path ? (
                <AvatarImage
                  src={env.getProfileUrl(user.profile_path)}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback>
                  <User className="w-4 h-4 text-primary" />
                </AvatarFallback>
              )}
            </div>
            <span className="text-gray-700 text-sm hidden sm:inline">
              {user?.name || "User"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <p className="font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:bg-red-50 disabled:opacity-50"
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
    </>
  );

  // Mobile menu navigation items
  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="no-underline flex-shrink-0">
            <img
              src="/NextHomeLogo.png"
              alt="NextHome"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          {renderDesktopNav()}

          {/* Hamburger Menu Button - Visible only on mobile/tablet */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Compare Button with Badge */}
            {user?.role === "tenant" && (
              <Link
                to="/compare"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={`Compare properties${compareCount > 0 ? ` (${compareCount} selected)` : ""}`}
              >
                <Scale className="w-5 h-5 text-gray-600" />
                {compareCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-primary text-white">
                    {compareCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* Hamburger / Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet/Drawer */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="right" className="p-0 w-80 max-w-[85vw]">
              <SheetHeader className="p-4 border-b flex items-center justify-between">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="flex items-center gap-3">
                  {/* User avatar or default */}
                  <Avatar className="w-10 h-10">
                    {user?.profile_path ? (
                      <AvatarImage
                        src={env.getProfileUrl(user.profile_path)}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role || "Guest"}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </SheetHeader>

          {/* Mobile Navigation Items */}
          <div className="flex-1 overflow-y-auto py-2">
            {getNavItems().map((item) => (
              <NavItem key={item.path} item={item} onClick={closeMobileMenu} />
            ))}


            {/* Compare Section - Mobile */}
            {user?.role === "tenant" && (
              <>
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Compare</span>
                    <Badge variant={compareCount > 0 ? "default" : "secondary"}>
                      {compareCount} selected
                    </Badge>
                  </div>
                </div>
                {compareCount > 0 && (
                  <div className="px-4 py-2 space-y-2">
                    {compareProperties.slice(0, 4).map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {property.housePhotos?.[0] ? (
                            <img
                              src={env.getImageUrl(property.housePhotos[0].photo_path)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {property.title || property.location || "Property"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${property.price || property.price_per_month}/mo
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCompare(property.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          aria-label="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <Link
                      to="/compare"
                      onClick={closeMobileMenu}
                      className="block text-center text-sm text-primary hover:underline py-2"
                    >
                      View All Properties
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Notifications Section - Mobile */}
            {(user?.role === "tenant" || user?.role === "landlord") && (
              <>
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive">{unreadCount} unread</Badge>
                    )}
                  </div>
                </div>
                <div className="px-4 py-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No notifications
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            !notification.read_at ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* User Profile Section - Mobile */}
            <div className="border-t border-gray-200 mt-auto">
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    {user?.profile_path ? (
                      <AvatarImage
                        src={env.getProfileUrl(user.profile_path)}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2 space-y-1">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
          </div>

          {/* Mobile Compare Quick Actions */}
          {user?.role === "tenant" && compareCount > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <Link
                to="/compare"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Scale className="w-5 h-5" />
                Compare Properties ({compareCount})
              </Link>
            </div>
          )}
        </SheetContent>

        {/* Clear All Confirmation Dialog for Mobile */}
        <Dialog open={showClearDialog && mobileMenuOpen} onOpenChange={(open) => {
          if (!open) setShowClearDialog(false);
        }}>
          <DialogHeader>
            <DialogTitle>Clear All Properties</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all properties from the comparison list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)} disabled={isClearing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={isClearing}>
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear All'
              )}
            </Button>
          </DialogFooter>
        </Dialog>
      </Sheet>
    </nav>
  );
}
