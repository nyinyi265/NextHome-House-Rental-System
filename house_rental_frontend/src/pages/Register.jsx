import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/api";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    emergency_contact: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation (optional but if provided must be valid)
    if (
      formData.phone_number &&
      !/^\+?[\d\s\-]{6,20}$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Password confirmation validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    // Emergency contact validation (optional but if provided must be valid)
    if (
      formData.emergency_contact &&
      !/^\+?[\d\s\-]{6,20}$/.test(formData.emergency_contact)
    ) {
      newErrors.emergency_contact = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 5000);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(api.auth.register(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors from backend
        if (data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach((key) => {
            backendErrors[key] = data.errors[key][0];
          });
          setErrors(backendErrors);
          throw new Error(data.message || "Registration failed");
        }
        throw new Error(data.message || "Registration failed");
      }

      // Check if registration returns token (auto-login)
      if (data.data && data.data.token) {
        // Save token and user to localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Get user role and redirect accordingly
        const userRole = data.data.user.roles?.[0]?.name || data.data.user.role;

        navigate("/");
      } else {
        // Fallback: if no token, redirect to login
        showToast(
          "success",
          "Registration successful! Please login to continue.",
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      showToast(
        "error",
        err.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{toast.message}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-1">
              Join NextHome to find your perfect rental
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                    errors.phone_number ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Emergency Contact Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Emergency contact number"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                    errors.emergency_contact
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.emergency_contact && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emergency_contact}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional: Someone we can contact in case of emergency
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-opacity-90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
