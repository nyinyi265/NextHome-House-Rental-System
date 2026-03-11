import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { LockKeyhole, Mail, KeyRound, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  
  // Determine if this is an authenticated password change or forgot password flow
  const isAuthenticatedChange = user && !token;
  
  const [step, setStep] = useState(isAuthenticatedChange ? 'authenticated' : (token && emailParam ? 'reset' : 'request'));
  const [email, setEmail] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    email: emailParam || '',
    token: token || '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Redirect to login if not authenticated and trying to access authenticated change
  useEffect(() => {
    if (!isAuthenticatedChange && !token && !emailParam) {
      // This is the forgot password flow - no redirect needed
    } else if (!isAuthenticatedChange && !user && !token) {
      navigate('/login');
    }
  }, [user, token, emailParam, isAuthenticatedChange, navigate]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.forgotPassword(email);
      setMessage({ type: 'success', text: 'Password reset link has been sent to your email!' });
    } catch (error) {
      console.error('Failed to send reset link', error);
      setMessage({ type: 'error', text: error.message || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticatedChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match!' });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters!' });
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword({
        current_password: formData.current_password,
        new_password: formData.password,
        new_password_confirmation: formData.password_confirmation
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      // Clear form
      setFormData({
        ...formData,
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error) {
      console.error('Failed to change password', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change password. Current password may be incorrect.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.resetPassword(formData);
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Failed to reset password', error);
      setMessage({ type: 'error', text: error.message || 'Failed to reset password. The token may be invalid or expired.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockKeyhole className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 'authenticated' ? 'Change Password' : (step === 'request' ? 'Forgot Password?' : 'Reset Password')}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'authenticated' 
              ? 'Enter your current password and choose a new password' 
              : step === 'request' 
                ? 'Enter your email and we\'ll send you a reset link' 
                : 'Enter your new password below'}
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Authenticated Password Change Form */}
        {step === 'authenticated' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <form onSubmit={handleAuthenticatedChange}>
              {/* Current Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.current_password}
                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors font-medium"
              >
                {loading ? 'Changing...' : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to={user?.role === 'landlord' ? '/landlord/profile' : '/tenant/profile'} className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </Link>
            </div>
          </div>
        )}

        {/* Request Form (Forgot Password) */}
        {step === 'request' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <form onSubmit={handleRequestSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors font-medium"
              >
                {loading ? 'Sending...' : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Reset Form (Token-based) */}
        {step === 'reset' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <form onSubmit={handleResetSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || formData.password !== formData.password_confirmation}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors font-medium"
              >
                {loading ? 'Resetting...' : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setStep('request')}
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Request new reset link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
