import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  FileText,
  Star,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  LockKeyhole,
  Eye,
  EyeOff,
  Home,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  MapPin,
  Ruler,
  Layers,
  Check,
  Heart,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import houseService from "../../services/houseService";
import AddHouseModal from "../../components/AddHouseModal";
import EditHouseModal from "../../components/EditHouseModal";
import PanoramaViewer from "../../components/PanoramaViewer";
import env from "../../environment/environment";

// Settings Content Component
function SettingsContent({ user, token }) {
  const { updateUser } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    profileImage: null,
    profilePreview: null,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        profileImage: null,
        profilePreview: user.profile_path
          ? `${env.STORAGE_URL}/${user.profile_path}`
          : null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profilePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("_method", "PUT");
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone_number", formData.phone_number);

      if (formData.profileImage) {
        formDataToSend.append("profile_path", formData.profileImage);
      }

      console.log("FormData to send:", formDataToSend);
      const response = await authService.updateProfile(formDataToSend);

      console.log("Profile Response", response);
      if (response.data?.user) {
        updateUser(response.data.user);
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Failed to update profile", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      console.error("Failed to change password", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-1 flex gap-1">
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "profile"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <User className="w-4 h-4 inline-block mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveSection("password")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "password"
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LockKeyhole className="w-4 h-4 inline-block mr-2" />
          Change Password
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      {activeSection === "profile" && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Edit Profile
          </h3>

          <form onSubmit={handleProfileSubmit}>
            {/* Profile Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                  {formData.profilePreview ? (
                    <img
                      src={formData.profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </span>
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Password Section */}
      {activeSection === "password" && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Change Password
          </h3>

          <form onSubmit={handlePasswordSubmit}>
            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LockKeyhole className="w-4 h-4" />
              )}
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [editingHouse, setEditingHouse] = useState(null);
  const [deletingHouse, setDeletingHouse] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [houses, setHouses] = useState([]);
  const [housesLoading, setHousesLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [rentalApplications, setRentalApplications] = useState([]);
  const [rentalAppsLoading, setRentalAppsLoading] = useState(false);
  const [rentalAppsRefetch, setRentalAppsRefetch] = useState(0);
  const [rentals, setRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'approve' or 'reject'
  const [showEditDurationModal, setShowEditDurationModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [editDuration, setEditDuration] = useState(3);
  const [editDurationLoading, setEditDurationLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    totalRentals: 0,
    totalRevenue: 0,
    pendingApplications: 0,
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [recentApplications, setRecentApplications] = useState([]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch houses when properties tab is active
  useEffect(() => {
    const fetchHouses = async () => {
      setHousesLoading(true);
      try {
        const response = await houseService.list(token, "landlord");
        const housesData = response.data?.houses || response.houses || [];
        setHouses(housesData);
      } catch (err) {
        console.error("Failed to fetch houses", err);
      } finally {
        setHousesLoading(false);
      }
    };

    if (activeTab === "properties" && token) {
      fetchHouses();
    }
  }, [activeTab, token, refetchTrigger]);

  const handleHouseCreated = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  const handleHouseDeleted = () => {
    setSelectedHouse(null);
    setCurrentPhotoIndex(0);
    setRefetchTrigger((prev) => prev + 1);
  };

  // Navigate back to card grid if selected house is no longer in the list
  useEffect(() => {
    if (
      selectedHouse &&
      houses.length > 0 &&
      !houses.some((h) => h.id === selectedHouse.id)
    ) {
      setSelectedHouse(null);
      setCurrentPhotoIndex(0);
    }
  }, [houses, selectedHouse?.id]);

  // Fetch rental applications when reservations tab is active
  useEffect(() => {
    const fetchRentalApplications = async () => {
      setRentalAppsLoading(true);
      try {
        const response =
          await houseService.getLandlordRentalApplications(token);
        const appsData =
          response.data?.rental_applications ||
          response.rental_applications ||
          [];
        
          console.log("Rental applications data:", appsData);
        setRentalApplications(appsData);
      } catch (err) {
        console.error("Failed to fetch rental applications", err);
      } finally {
        setRentalAppsLoading(false);
      }
    };

    if (activeTab === "reservations" && token) {
      fetchRentalApplications();
    }
  }, [activeTab, token, rentalAppsRefetch]);

  // Fetch rentals when rentals tab is active
  useEffect(() => {
    const fetchRentals = async () => {
      setRentalsLoading(true);
      try {
        const response = await houseService.getLandlordRentals(token);
        const rentalsData = response.data?.rentals || response.rentals || [];
        console.log("Rentals data:", rentalsData);
        console.log("House 1", rentalsData[0].house.house_photos[0].photo_path);
        setRentals(rentalsData);
      } catch (err) {
        console.error("Failed to fetch rentals", err);
      } finally {
        setRentalsLoading(false);
      }
    };

    if (activeTab === "rentals" && token) {
      fetchRentals();
    }
  }, [activeTab, token]);

  // Fetch dashboard data for overview
  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      try {
        // Fetch houses
        const housesResponse = await houseService.list(token, "landlord");
        const housesData =
          housesResponse.data?.houses || housesResponse.houses || [];

        // Fetch rentals
        const rentalsResponse = await houseService.getLandlordRentals(token);
        const rentalsData =
          rentalsResponse.data?.rentals || rentalsResponse.rentals || [];

        // Fetch rental applications
        const appsResponse =
          await houseService.getLandlordRentalApplications(token);
        const appsData =
          appsResponse.data?.rental_applications ||
          appsResponse.rental_applications ||
          [];
        setRentalApplications(appsData);

        // Calculate total revenue from active rentals
        const totalRevenue = rentalsData
          .filter((r) => r.status === "active")
          .reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);

        // Count pending applications
        const pendingApplications = appsData.filter(
          (a) => a.status === "pending",
        ).length;

        // Store recent applications (last 5)
        const sortedApps = [...appsData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setRecentApplications(sortedApps.slice(0, 5));

        setDashboardStats({
          totalProperties: housesData.length,
          totalRentals: rentalsData.length,
          totalRevenue: totalRevenue,
          pendingApplications: pendingApplications,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setDashboardError(
          err.message || "Failed to load dashboard data. Please try again.",
        );
      } finally {
        setDashboardLoading(false);
      }
    };

    if (activeTab === "overview" && token) {
      fetchDashboardData();
    }
  }, [activeTab, token, refetchTrigger, rentalAppsRefetch]);

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await houseService.updateRentalApplicationStatus(
        token,
        applicationId,
        status,
      );
      setRentalAppsRefetch((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update application status", err);
      alert("Failed to update application status");
    }
  };

  const openConfirmModal = (application, action) => {
    setSelectedApplication(application);
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedApplication(null);
    setModalAction(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !modalAction) return;

    try {
      const status = modalAction === "approve" ? "approved" : "rejected";
      await houseService.updateRentalApplicationStatus(
        token,
        selectedApplication.id,
        status,
      );
      setRentalAppsRefetch((prev) => prev + 1);
      closeConfirmModal();
    } catch (err) {
      console.error("Failed to update application status", err);
      alert("Failed to update application status");
    }
  };

  const openEditDurationModal = (application) => {
    setEditingApplication(application);
    setEditDuration(application.rental_duration || 3);
    setShowEditDurationModal(true);
  };

  const closeEditDurationModal = () => {
    setShowEditDurationModal(false);
    setEditingApplication(null);
    setEditDuration(3);
  };

  const handleUpdateDuration = async () => {
    if (!editingApplication) return;

    setEditDurationLoading(true);
    try {
      await houseService.updateRentalApplicationDuration(
        token,
        editingApplication.id,
        editDuration,
      );
      setRentalAppsRefetch((prev) => prev + 1);
      closeEditDurationModal();
    } catch (err) {
      console.error("Failed to update duration", err);
      alert("Failed to update duration");
    } finally {
      setEditDurationLoading(false);
    }
  };

  // Dynamic stats based on real data
  const stats = [
    {
      title: "Total Properties",
      value: dashboardStats.totalProperties,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: "Active Rentals",
      value: dashboardStats.totalRentals,
      icon: CalendarDays,
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `${dashboardStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "Pending Applications",
      value: dashboardStats.pendingApplications,
      icon: Star,
      color: "bg-purple-500",
    },
  ];

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "reservations", label: "Reservations", icon: CalendarDays },
    { id: "rentals", label: "Rentals", icon: FileText },
    // { id: 'reviews', label: 'Reviews', icon: Star },
    // { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
    // { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:transform-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <img
              src="/NextHomeLogo.png"
              alt="NextHome"
              className="h-[60px] w-auto"
            />
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              {user?.profile_path ? (
                <img
                  src={`${env.STORAGE_URL}/${user.profile_path}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ),
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {logoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.id === activeTab)?.label ||
                "Dashboard"}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Error Message */}
              {dashboardError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {dashboardError}
                </div>
              )}

              {/* Skeleton Loading for Stats Cards */}
              {dashboardLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-6 shadow-sm border animate-pulse"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm border"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                              {stat.value}
                            </p>
                          </div>
                          <div
                            className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                          >
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reservations Overview */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Reservations Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Pending</p>
                        <p className="text-2xl font-bold text-blue-800">
                          {
                            rentalApplications.filter(
                              (a) => a.status === "pending",
                            ).length
                          }
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Approved</p>
                        <p className="text-2xl font-bold text-green-800">
                          {
                            rentalApplications.filter(
                              (a) => a.status === "approved",
                            ).length
                          }
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-800">
                          {
                            rentalApplications.filter(
                              (a) => a.status === "rejected",
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Recent Reservations
                      </h3>
                    </div>
                    {dashboardLoading ? (
                      <div className="p-12 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
                        <p className="text-gray-500">Loading reservations...</p>
                      </div>
                    ) : recentApplications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        No recent reservations
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentApplications.map((app) => (
                          <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                {app.house?.house_photos && app.house.house_photos.length > 0 ? (
                                  <img src={env.getImageUrl(app.house.house_photos[0].photo_path)} alt={app.house?.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{app.house?.title || "-"}</p>
                                <p className="text-sm text-gray-500 truncate">{app.tenantProfile?.user?.name || "-"}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    app.status === "approved" ? "bg-green-100 text-green-800" : app.status === "rejected" ? "bg-red-100 text-red-800" : app.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                                  }`}>
                                    {app.status || "pending"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : "-"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${app.house?.price_per_month || app.house?.price || "-"}</p>
                                <p className="text-xs text-gray-500">/month</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "properties" && selectedHouse ? (
            /* ========== PROPERTY DETAIL VIEW ========== */
            <div className="space-y-6">
              {/* Back Button + Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedHouse(null);
                    setCurrentPhotoIndex(0);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Properties</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingHouse(selectedHouse)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingHouse(selectedHouse)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Photo Gallery */}
              {(() => {
                const photos = selectedHouse.house_photos || [];
                const getPhotoUrl = (photo) => {
                  if (!photo) return null;
                  if (photo.photo_url) return photo.photo_url;
                  if (photo.photo_path) return env.getImageUrl(photo.photo_path);
                  return null;
                };
                const mainPhoto =
                  photos.length > 0
                    ? getPhotoUrl(photos[currentPhotoIndex])
                    : null;
                const currentPhoto = photos[currentPhotoIndex];
                const isPanorama =
                  currentPhoto?.is_panorama === 1 ||
                  currentPhoto?.is_panorama === true ||
                  currentPhoto?.is_panorama === "1";

                const nextPhoto = () => {
                  if (photos.length <= 1) return;
                  setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
                };
                const prevPhoto = () => {
                  if (photos.length <= 1) return;
                  setCurrentPhotoIndex(
                    (prev) => (prev - 1 + photos.length) % photos.length,
                  );
                };

                return (
                  <>
                    {/* Main Image */}
                    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden bg-gray-200 mb-4">
                      {mainPhoto && mainPhoto.startsWith("http") ? (
                        isPanorama ? (
                          <PanoramaViewer image={mainPhoto} />
                        ) : (
                          <img
                            src={mainPhoto}
                            alt={selectedHouse.title}
                            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-white/60" />
                        </div>
                      )}

                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={prevPhoto}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <button
                            onClick={nextPhoto}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </>
                      )}

                      {photos.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {currentPhotoIndex + 1} / {photos.length}
                        </div>
                      )}

                      {/* Status Badge on Photo */}
                      <span
                        className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                          selectedHouse.is_available
                            ? "bg-green-100/90 text-green-800"
                            : "bg-gray-100/90 text-gray-800"
                        }`}
                      >
                        {selectedHouse.is_available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    {/* Thumbnail Row */}
                    {photos.length > 1 && (
                      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        {photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`ml-2 mt-2 flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg overflow-hidden transition-all duration-200 ease-in-out ${
                              index === currentPhotoIndex
                                ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-lg"
                                : "opacity-70 hover:opacity-100 hover:scale-105 shadow-md"
                            }`}
                          >
                            <img
                              src={getPhotoUrl(photo)}
                              alt={`${selectedHouse.title} thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Property Info - Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1">
                  {/* Title Section */}
                  <div className="border-b pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedHouse.title}
                      </h1>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedHouse.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedHouse.is_available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {[
                          selectedHouse.apartment_number,
                          selectedHouse.street,
                          selectedHouse.township,
                          selectedHouse.city,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Location not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                        {selectedHouse.type || "Property"}
                      </span>
                      {selectedHouse.floor && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Floor {selectedHouse.floor}
                        </span>
                      )}
                      {selectedHouse.area && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {selectedHouse.area} sq ft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Property Stats */}
                  <div className="border-b py-6">
                    <div className="flex flex-wrap gap-8">
                      {selectedHouse.bedrooms != null && (
                        <div className="flex items-center gap-2">
                          <Bed className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-semibold">
                              {selectedHouse.bedrooms} Bedrooms
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedHouse.bathrooms != null && (
                        <div className="flex items-center gap-2">
                          <Bath className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-semibold">
                              {selectedHouse.bathrooms} Bathrooms
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedHouse.area != null && (
                        <div className="flex items-center gap-2">
                          <Ruler className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-semibold">
                              {selectedHouse.area} sq ft
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedHouse.floor != null && (
                        <div className="flex items-center gap-2">
                          <Layers className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-semibold">
                              Floor {selectedHouse.floor}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="border-b py-6">
                    <h2 className="text-xl font-semibold mb-4">
                      About this place
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedHouse.description ||
                        "No description available."}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="border-b py-6">
                    <h2 className="text-xl font-semibold mb-4">
                      What this place offers
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {(selectedHouse.amenties || selectedHouse.amenities || [])
                        .length > 0 ? (
                        (
                          selectedHouse.amenties ||
                          selectedHouse.amenities ||
                          []
                        ).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>{amenity.name || amenity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm col-span-2">
                          No amenities added yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Furniture */}
                  <div className="py-6">
                    <h2 className="text-xl font-semibold mb-4">Furniture</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {(selectedHouse.furnitures || []).length > 0 ? (
                        selectedHouse.furnitures.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-gray-700"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>{item.name || item}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm col-span-2">
                          No furniture added yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar - Property Summary */}
                <div className="lg:w-96">
                  <div className="border rounded-xl p-6 shadow-sm sticky top-4">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold">
                          ${selectedHouse.price}
                        </span>
                        <span className="text-gray-600"> / month</span>
                      </div>
                    </div>

                    {/* Property Quick Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span
                          className={`font-medium ${
                            selectedHouse.is_available
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {selectedHouse.is_available
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>
                      {selectedHouse.available_from && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Available From
                          </span>
                          <span className="font-medium text-gray-900">
                            {new Date(
                              selectedHouse.available_from,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Property ID</span>
                        <span className="font-medium text-gray-900">
                          #{selectedHouse.id}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <button
                        onClick={() => setEditingHouse(selectedHouse)}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Property
                      </button>
                      <button
                        onClick={() => setDeletingHouse(selectedHouse)}
                        className="w-full mt-3 border border-red-300 text-red-600 py-3 rounded-lg font-semibold text-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete Property
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "properties" ? (
            /* ========== PROPERTY CARD GRID ========== */
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  My Properties
                </h3>
                <button
                  onClick={() => setShowAddHouse(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>

              {housesLoading ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-gray-500">Loading properties...</p>
                  </div>
                </div>
              ) : houses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No properties yet</p>
                  <p className="text-sm">
                    Click "Add Property" to create your first listing
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {houses.map((house) => (
                    <div
                      key={house.id}
                      onClick={() => {
                        setSelectedHouse(house);
                        setCurrentPhotoIndex(0);
                      }}
                      className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {/* Property Image */}
                      <div className="relative h-48 bg-gray-200">
                        {house.house_photos &&
                        house.house_photos.length > 0 ? (
                          <img
                            src={env.getImageUrl(
                              house.house_photos[0].photo_path,
                            )}
                            alt={house.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-primary" />
                          </div>
                        )}
                        {/* Status Badge */}
                        <span
                          className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                            house.is_available
                              ? "bg-green-100/90 text-green-800"
                              : "bg-gray-100/90 text-gray-800"
                          }`}
                        >
                          {house.is_available ? "Available" : "Unavailable"}
                        </span>
                        {/* Photo Count */}
                        {house.house_photos &&
                          house.house_photos.length > 1 && (
                            <span className="absolute bottom-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                              {house.house_photos.length} photos
                            </span>
                          )}
                      </div>

                      {/* Property Info */}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 truncate">
                          {house.title}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                          {house.city}, {house.township}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {house.type && (
                            <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                              {house.type}
                            </span>
                          )}
                          {house.bedrooms && (
                            <span>{house.bedrooms} bed</span>
                          )}
                          {house.bathrooms && (
                            <span>{house.bathrooms} bath</span>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <p className="font-bold text-gray-900">
                            ${house.price || house.price_per_month}
                            <span className="text-sm font-normal text-gray-500">
                              {" "}/ month
                            </span>
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingHouse(house);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingHouse(house);
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === "reservations" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Rental Applications
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage tenant rental applications for your properties
                </p>
              </div>

              {rentalAppsLoading ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-gray-500">Loading applications...</p>
                  </div>
                </div>
              ) : rentalApplications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No rental applications yet</p>
                  <p className="text-sm">
                    Applications from tenants will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentalApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl shadow-sm border-2 border-primary overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Property Image */}
                      <div className="relative h-40 bg-gray-200">
                        {app.house?.house_photos && app.house.house_photos.length > 0 ? (
                          <img
                            src={env.getImageUrl(app.house.house_photos[0].photo_path)}
                            alt={app.house?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-primary" />
                          </div>
                        )}
                        {/* Status Badge */}
                        <span
                          className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                            app.status === "approved"
                              ? "bg-green-100/90 text-green-800"
                              : app.status === "rejected"
                                ? "bg-red-100/90 text-red-800"
                                : "bg-yellow-100/90 text-yellow-800"
                          }`}
                        >
                          {app.status || "pending"}
                        </span>
                      </div>

                      {/* Application Details */}
                      <div className="p-4">
                        {/* Tenant Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {app.tenant_profile?.user?.profile_path && app.tenant_profile.user.profile_path.length > 0 ? (
                              <img
                                src={env.getProfileUrl(app.tenant_profile.user.profile_path)}
                                alt={app.tenant_profile?.user?.name?.charAt(0) || "T"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {app.tenant_profile?.user?.name?.charAt(0) || "T"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {app.tenant_profile?.user?.name || "Tenant"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {app.tenant_profile?.user?.email || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Property Info */}
                        <div className="mb-3">
                          <p className="font-semibold text-gray-900 truncate">
                            {app.house?.title || "Property"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {app.house?.city}, {app.house?.township}
                          </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium text-gray-900">
                              {app.rental_duration ? `${app.rental_duration} months` : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Applied</p>
                            <p className="font-medium text-gray-900">
                              {app.created_at ? new Date(app.created_at).toLocaleDateString() : "-"}
                            </p>
                          </div>
                        </div>

                        {/* Message */}
                        {app.message && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Message</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{app.message}</p>
                          </div>
                        )}

                        {/* Actions */}
                        {app.status === "pending" && (
                          <div className="flex gap-2 pt-3 border-t">
                            <button
                              onClick={() => openEditDurationModal(app)}
                              className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => openConfirmModal(app, "approve")}
                              className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openConfirmModal(app, "reject")}
                              className="flex-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                        {app.status !== "pending" && (
                          <div className="pt-3 border-t text-center">
                            <span className="text-sm text-gray-400">
                              {app.status === "approved" ? "Application Approved" : "Application Denied"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Reviews
              </h3>
              <p className="text-gray-500">Check your property reviews here.</p>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Wallet
              </h3>
              <p className="text-gray-500">
                Manage your earnings and payouts here.
              </p>
            </div>
          )}

          {activeTab === "rentals" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6 ">
                <h3 className="text-lg font-semibold text-gray-800">
                  Rentals
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  View all your active and past rentals
                </p>
              </div>

              {rentalsLoading ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p className="text-gray-500">Loading rentals...</p>
                  </div>
                </div>
              ) : rentals.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No rentals yet</p>
                  <p className="text-sm">Active rentals will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="bg-white rounded-xl border-2 border-primary overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32 bg-gray-200">
                        {rental.house?.house_photos && rental.house.house_photos.length > 0 ? (
                          <img src={`${env.STORAGE_URL}/${rental.house.house_photos[0].photo_path}`} alt={rental.house?.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <span className={`absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${rental.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {rental.status || "inactive"}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-gray-900 truncate">{rental.house?.title || "Property"}</p>
                        <p className="text-sm text-gray-500 truncate">{rental.house?.city}, {rental.house?.township}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            {rental.tenant_profile?.user?.profile_path ? (
                              <img src={env.getProfileUrl(rental.tenant_profile.user.profile_path)} alt={rental.tenant_profile?.user?.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{rental.tenant_profile?.user?.name || "-"}</p>
                            <p className="text-xs text-gray-500 truncate">{rental.tenant_profile?.user?.email || "-"}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium text-gray-900">{rental.rental_duration ? `${rental.rental_duration} mo` : "-"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rent</p>
                            <p className="font-medium text-gray-900">${rental.monthly_rent?.toLocaleString() || "0"}/mo</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Start</p>
                            <p className="font-medium text-gray-900">{rental.rental_start_date ? new Date(rental.rental_start_date).toLocaleDateString() : "-"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">End</p>
                            <p className="font-medium text-gray-900">{rental.rental_end_date ? new Date(rental.rental_end_date).toLocaleDateString() : "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <SettingsContent user={user} token={token} />
          )}

          {activeTab === "help" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Help & Support
              </h3>
              <p className="text-gray-500">Get help with your account here.</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Add House Modal */}
      <AddHouseModal
        isOpen={showAddHouse}
        onClose={() => setShowAddHouse(false)}
        token={token}
        onSuccess={handleHouseCreated}
      />

      {/* Edit House Modal */}
      <EditHouseModal
        isOpen={!!editingHouse}
        onClose={() => setEditingHouse(null)}
        token={token}
        house={editingHouse}
        onSuccess={handleHouseCreated}
      />

      {/* Delete Property Confirmation Modal */}
      {deletingHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setDeletingHouse(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Property
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingHouse(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await houseService.deleteHouse(token, deletingHouse.id);
                    setDeletingHouse(null);
                    handleHouseDeleted();
                  } catch (err) {
                    console.error('Failed to delete property', err);
                    alert(err.message || 'Failed to delete property');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm {modalAction === "approve" ? "Approval" : "Rejection"}
              </h3>
              <button
                onClick={closeConfirmModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              {modalAction === "approve" ? "approve" : "reject"} this rental
              application?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  modalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {modalAction === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Duration Modal */}
      {showEditDurationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Rental Duration
              </h3>
              <button
                onClick={closeEditDurationModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Update the rental duration for this application.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (months)
              </label>
              <select
                value={editDuration}
                onChange={(e) => setEditDuration(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={1}>1 month</option>
                <option value={2}>2 months</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
                <option value={18}>18 months</option>
                <option value={24}>24 months</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeEditDurationModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={editDurationLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDuration}
                disabled={editDurationLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {editDurationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
