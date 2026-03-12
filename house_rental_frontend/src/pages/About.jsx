import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Building2, Star, Shield, Phone as PhoneIcon, Mail, MapPin, Clock, ChevronRight, HelpCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About NextHome</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your Trusted Rental Platform - Connecting tenants with their perfect rental properties since 2024
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            NextHome is a leading online platform connecting tenants with their perfect rental properties. 
            We strive to make the rental process seamless, transparent, and hassle-free for both 
            landlords and tenants. Our mission is to revolutionize how people find and manage rental properties.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Our Mission
              </h3>
              <p className="text-gray-600">
                To revolutionize the rental experience by providing a trusted marketplace 
                where everyone can find their ideal home.
              </p>
            </div>
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Our Vision
              </h3>
              <p className="text-gray-600">
                To be the most reliable and user-friendly rental platform in the region, 
                empowering people to make informed decisions about their living spaces.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <PhoneIcon className="w-7 h-7 text-primary" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">support@nexthome.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="text-gray-600">+95 123 456 789</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Address</p>
                <p className="text-gray-600">123 Main Street, Yangon</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Business Hours</p>
                <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Star className="w-7 h-7 text-primary" />
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Property Search</h3>
              <p className="text-gray-600">Browse thousands of rental listings with advanced filters</p>
            </div>
            <div className="border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Online Applications</h3>
              <p className="text-gray-600">Apply for properties securely through our platform</p>
            </div>
            <div className="border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Digital Leases</h3>
              <p className="text-gray-600">Sign and manage leases electronically</p>
            </div>
            <div className="border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Processing</h3>
              <p className="text-gray-600">Secure rent payments with multiple payment options</p>
            </div>
            <div className="border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Maintenance Requests</h3>
              <p className="text-gray-600">Submit and track maintenance issues online</p>
            </div>
            <div className="border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">Tenant Verification</h3>
              <p className="text-gray-600">Verified profiles for trusted interactions</p>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            Policies & Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Privacy Policy</h3>
                <p className="text-gray-600 text-sm mt-1">We are committed to protecting your personal information and privacy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Terms of Service</h3>
                <p className="text-gray-600 text-sm mt-1">Our terms outline the rules and guidelines for using our platform.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
                <p className="text-gray-600 text-sm mt-1">Learn about our rental application and booking cancellation processes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Tenant Rights</h3>
                <p className="text-gray-600 text-sm mt-1">Understanding your rights as a tenant in our rental ecosystem.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="bg-primary rounded-2xl shadow-sm p-8 text-white">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
              <p className="text-white/80 mb-4 text-lg">
                Our support team is available to assist you with any questions or concerns 
                about your rental journey.
              </p>
              <button className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 NextHome. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
