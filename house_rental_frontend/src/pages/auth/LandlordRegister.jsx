import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import api from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import env from "../../environment/environment";
import {
  User,
  Mail,
  LockKeyhole,
  Phone as PhoneIcon,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building2,
  Shield,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Earn Extra Income",
    description: "List your property and start earning passive income",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description: "You control availability and rental terms",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Verified Tenants",
    description: "Get matched with reliable tenants",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Protected payments and legal support",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function LandlordRegister() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  
  const isLoggedIn = !!user && !!token;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
  });

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        password: "existing_user",
        password_confirmation: "existing_user",
      }));
    }
  }, [user]);

  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    if (isLoggedIn) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();

      // Only include user fields if NOT logged in
      if (!isLoggedIn) {
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("password_confirmation", formData.password_confirmation);
        data.append("phone_number", formData.phone_number);
      } else if (user?.id) {
        // Pass user_id explicitly when logged in
        data.append("user_id", user.id);
      }

      if (profileImage) {
        data.append("profile_path", profileImage);
      }
      if (documentFile) {
        data.append("document_path", documentFile);
      }

      const headers = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log("Sending data:", Object.fromEntries(data.entries()));
      const response = await fetch(api.auth.registerLandlord(), {
        method: 'POST',
        headers,
        body: data,
        credentials: 'same-origin',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess(isLoggedIn 
        ? "Registration successful! Please wait for admin approval. You will be redirected shortly." 
        : "Registration successful! Please wait for admin approval.");

      setTimeout(() => {
        navigate(isLoggedIn ? "/" : "/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Become a Landlord
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Start earning by listing your property on NextHome. Join thousands
            of property owners who trust us with their rentals.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.bgColor} mb-4`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Your Landlord Account
            </h2>
            <p className="text-gray-600 mt-2">
              Fill in your details to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    disabled={isLoggedIn}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    disabled={isLoggedIn}
                    required
                  />
                </div>
              </div>

              {!isLoggedIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative max-w-md">
                      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+95 123 456 789"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    disabled={isLoggedIn}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                {isLoggedIn && user?.profile_path ? (
                  <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-xl bg-gray-50">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      <img src={env.getProfileUrl(user.profile_path)} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-gray-500">Current profile photo</span>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-full">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileChange}
                      className="hidden"
                      disabled={isLoggedIn}
                    />
                  </label>
                )}
                {profileImage && (
                  <span className="text-sm text-gray-500 mt-2 block">
                    {profileImage.name}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Ownership Document
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-full">
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Choose File</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                </label>
                {documentFile && (
                  <span className="text-sm text-gray-500 mt-2 block">
                    {documentFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-12 py-4 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-opacity-90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 min-w-[250px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  "Register as Landlord"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 NextHome. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
