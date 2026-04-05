import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import houseService from "../../services/houseService";
import env from "../../environment/environment";
import { 
  Home, 
  Calendar, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

export default function LandlordRentals() {
  const { user, token } = useContext(AuthContext);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive

  useEffect(() => {
    const fetchRentals = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await houseService.getLandlordRentals(token);
        const rentalsData = response.data?.rentals || response.rentals || [];
        setRentals(rentalsData);
      } catch (err) {
        console.error("Failed to fetch rentals", err);
        setError(err.message || "Failed to load rentals");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [token]);

  const filteredRentals = rentals.filter(rental => {
    if (filter === "all") return true;
    if (filter === "active") return rental.status === "active";
    if (filter === "inactive") return rental.status === "inactive" || rental.status === "expired" || rental.status === "terminated";
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3" />
        {status || "Inactive"}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-gray-500 mt-1">Manage and view all your rental properties</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border"
            }`}
          >
            All Rentals ({rentals.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "active"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border"
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Active ({rentals.filter(r => r.status === "active").length})
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "inactive"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Inactive ({rentals.filter(r => r.status !== "active").length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Rentals List */}
        {filteredRentals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals found</h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "You haven't created any rentals yet." 
                : `No ${filter} rentals found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRentals.map((rental) => (
              <div 
                key={rental.id} 
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* House Image */}
                  <div className="md:w-64 h-48 md:h-auto relative">
                    {rental.house?.house_photos && rental.house.house_photos.length > 0 ? (
                      <img
                        src={env.getImageUrl(rental.house.house_photos[0].photo_path)}
                        alt={rental.house?.title || "House"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(rental.status)}
                    </div>
                  </div>

                  {/* Rental Details */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* House Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rental.house?.title || "Property"}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {rental.house?.address || "Address not available"}
                        </p>
                        
                        {/* Rental Period */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(rental.rental_start_date)} - {formatDate(rental.rental_end_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{rental.rental_duration || "N/A"} months</span>
                          </div>
                        </div>
                      </div>

                      {/* Tenant Info & Rent */}
                      <div className="flex flex-col gap-3">
                        {/* Monthly Rent */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-lg font-semibold text-green-700">
                            {formatCurrency(rental.monthly_rent)}/month
                          </span>
                        </div>

                        {/* Tenant Info */}
                        {rental.tenantProfile && (
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{rental.tenantProfile.name || "Tenant"}</span>
                            </div>
                            {rental.tenantProfile.phone_number && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{rental.tenantProfile.phone_number}</span>
                              </div>
                            )}
                            {rental.tenantProfile.email && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{rental.tenantProfile.email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
