import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Bed,
  Bath,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  Loader2,
  Calendar,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Loading from "../../components/Loading";
import houseService from "../../services/houseService";
import { AuthContext } from "../../context/AuthContext";
import env from "../../environment/environment";
import PanoramaViewer from "../../components/PanoramaViewer";

export default function HouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const role = (() => {
    if (!user) return null;
    if (user.role) return user.role;
    if (user.roles && user.roles.length) return user.roles[0].name;
    return null;
  })();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationMessage, setReservationMessage] = useState("");
  const [rentalDuration, setRentalDuration] = useState(3);

  useEffect(() => {
    setLoading(true);
    houseService
      .get(id, token, role)
      .then((response) => {
        const houseData = response.data?.house || response.house || response;
        setProperty(houseData);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch house", err);
        setError(err.message || "Unable to load property");
      })
      .finally(() => setLoading(false));
  }, [id, token, role]);

  const nextPhoto = () => {
    const photos = property?.house_photos || property?.photos || [];
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    const photos = property?.house_photos || property?.photos || [];
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleReserveClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setShowReservationModal(true);
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await houseService.applyRental(
        token,
        parseInt(id),
        reservationMessage,
        rentalDuration,
      );
      setReservationSuccess(true);

      // Close modal after showing success
      setTimeout(() => {
        setShowReservationModal(false);
        setReservationSuccess(false);
        setReservationMessage("");
        setRentalDuration(3);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit reservation", err);
      alert(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-sm text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="p-6 text-red-500">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="p-6">Property not found</p>
      </div>
    );
  }

  // Extract property details with fallbacks
  const title = property.title || "Property Title";
  const location =
    property.location || property.address || "Location not specified";
  const price = property.price_per_month || property.price || 0;
  const description = property.description || "No description available.";
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const maxGuests = property.max_guests || property.guests || 0;
  const beds = property.beds || 0;
  const propertyType = property.property_type || property.type || "Apartment";

  // Get amenities from the API response
  const amenities = property.amenties || property.amenities || [];

  // Get house photos
  const photos = property.house_photos || property.photos || [];

  // Build image URL from photo_path
  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.photo_url) return photo.photo_url;
    if (photo.photo_path) return env.getImageUrl(photo.photo_path);
    return null;
  };

  const mainPhoto =
    photos.length > 0 ? getPhotoUrl(photos[currentPhotoIndex]) : null;

  const currentPhoto = photos[currentPhotoIndex];
  const isPanorama = currentPhoto?.is_panorama === 1 || currentPhoto?.is_panorama === true || currentPhoto?.is_panorama === "1";

  console.log("Main Photo", mainPhoto)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Image Gallery - Modern Responsive Design */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Sample Images (for demo - remove when API provides real images) */}
        {photos.length === 0 && (
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-2">Sample Images</h3>
          </div>
        )}

        {/* Main Image - Full Width */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden bg-gray-200 mb-4">
          {mainPhoto && mainPhoto.startsWith('http') ? (
            isPanorama ? (
              <PanoramaViewer image={mainPhoto} />
            ) : (
              <img
                src={mainPhoto}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-6xl">🏠</span>
            </div>
          )}

          {/* Navigation Arrows */}
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

          {/* Photo Counter Badge */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          )}
        </div>

        {/* Thumbnail Row - Horizontal with spacing */}
        {photos.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`
                  flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg overflow-hidden
                  transition-all duration-200 ease-in-out mt-4 ml-2
                  ${
                    index === currentPhotoIndex
                      ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-lg"
                      : "opacity-70 hover:opacity-100 hover:scale-105 shadow-md"
                  }
                `}
              >
                <img
                  src={getPhotoUrl(photo)}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {/* Sample thumbnails when no real photos */}
            {photos.length === 0 && (
              <>
                <button
                  onClick={() => setCurrentPhotoIndex(0)}
                  className={`
                    flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg overflow-hidden
                    transition-all duration-200 ease-in-out
                    ${
                      0 === currentPhotoIndex
                        ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-lg"
                        : "opacity-70 hover:opacity-100 hover:scale-105 shadow-md"
                    }
                  `}
                >
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
                    alt="Property thumbnail 1"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex(1)}
                  className={`
                    flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg overflow-hidden
                    transition-all duration-200 ease-in-out
                    ${
                      1 === currentPhotoIndex
                        ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-lg"
                        : "opacity-70 hover:opacity-100 hover:scale-105 shadow-md"
                    }
                  `}
                >
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
                    alt="Property thumbnail 2"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex(2)}
                  className={`
                    flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg overflow-hidden
                    transition-all duration-200 ease-in-out
                    ${
                      2 === currentPhotoIndex
                        ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-lg"
                        : "opacity-70 hover:opacity-100 hover:scale-105 shadow-md"
                    }
                  `}
                >
                  <img
                    src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
                    alt="Property thumbnail 3"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex(3)}
                  className={`
                    flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 rounded-lg overflow-hidden
                    transition-all duration-200 ease-in-out
                    ${
                      3 === currentPhotoIndex
                        ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-lg"
                        : "opacity-70 hover:opacity-100 hover:scale-105 shadow-md"
                    }
                  `}
                >
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
                    alt="Property thumbnail 4"
                    className="w-full h-full object-cover"
                  />
                </button>
              </>
            )}
          </div>
        )}

        {/* Photo Indicators (Dots) */}
        {/* {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-200
                  ${index === currentPhotoIndex 
                    ? 'bg-emerald-600 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>
        )} */}
      </div>

      {/* Property Info */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Title Section */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center gap-1">
                  {/* <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> */}
                  {/* <span className="font-semibold">{rating}</span> */}
                </div>
              </div>
              {/* <p className="text-gray-600 text-lg">{location}</p> */}
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {propertyType}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="border-b py-6">
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Bed className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">{bedrooms} Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">{bathrooms} Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">Up to {maxGuests} Guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-semibold">{beds} Beds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b py-6">
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Amenities */}
            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {amenities.length > 0 ? (
                  amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{amenity.name || amenity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Wifi</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Kitchen</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Air Conditioning</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Heating</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Parking</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>TV</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Reserve Card */}
          <div className="lg:w-96">
            <div className="border rounded-xl p-6 shadow-lg sticky top-4">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-gray-600"> / month</span>
                </div>
              </div>

              {/* <div className="border rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b">
                  <div className="p-3 border-r">
                    <p className="text-xs text-gray-500 font-medium">CHECK-IN</p>
                    <p className="font-medium">Add date</p>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 font-medium">CHECKOUT</p>
                    <p className="font-medium">Add date</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-medium">GUESTS</p>
                  <p className="font-medium">{maxGuests} guests</p>
                </div>
              </div> */}

              <button
                onClick={handleReserveClick}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors"
              >
                Reserve
              </button>

              {/* <p className="text-center text-gray-500 text-sm mt-4">
                You won't be charged yet
              </p> */}

              {/* Price Breakdown */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="underline">${price} x 30 nights</span>
                  <span>${price * 30}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>$100</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total before taxes</span>
                  <span>${price * 30 + 150}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowReservationModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Request to Book</h2>
              <button
                onClick={() => setShowReservationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {reservationSuccess ? (
              // Success State
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Request Submitted!
                </h3>
                <p className="text-gray-600">
                  Your reservation request has been sent to the host. You'll be
                  notified once they respond.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReservation} className="p-6">
                {/* Property Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{location}</p>
                  <p className="font-bold text-emerald-600 mt-2">
                    ${price}/month
                  </p>
                </div>

                {/* Rental Duration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Duration (months)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={rentalDuration}
                      onChange={(e) =>
                        setRentalDuration(parseInt(e.target.value))
                      }
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
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
                  <p className="text-xs text-gray-500 mt-1">
                    Select how long you want to rent this property
                  </p>
                </div>

                {/* Message to Host */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to host (optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={reservationMessage}
                      onChange={(e) => setReservationMessage(e.target.value)}
                      rows={4}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="Tell the landlord a bit about yourself and why you're staying..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Confirm and Request"
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  You won't be charged yet. The host has 24 hours to accept your
                  request.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
