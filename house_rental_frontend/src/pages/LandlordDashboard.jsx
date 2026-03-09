import React, { useState, useContext } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Star, 
  Wallet, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  DollarSign
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mock data for dashboard
  const stats = [
    { title: 'Total Properties', value: '12', icon: Building2, color: 'bg-blue-500' },
    { title: 'Total Bookings', value: '156', icon: CalendarDays, color: 'bg-green-500' },
    { title: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'bg-yellow-500' },
    { title: 'Total Reviews', value: '89', icon: Star, color: 'bg-purple-500' },
  ];

  // Mock recent bookings
  const recentBookings = [
    { id: 1, property: 'Sunset Villa', guest: 'John Smith', date: '2026-03-15', status: 'Confirmed', amount: '$450' },
    { id: 2, property: 'Ocean View Apartment', guest: 'Sarah Johnson', date: '2026-03-14', status: 'Pending', amount: '$320' },
    { id: 3, property: 'Mountain Cabin', guest: 'Mike Wilson', date: '2026-03-13', status: 'Confirmed', amount: '$280' },
    { id: 4, property: 'City Center Loft', guest: 'Emily Brown', date: '2026-03-12', status: 'Completed', amount: '$195' },
    { id: 5, property: 'Lakeside Resort', guest: 'David Lee', date: '2026-03-11', status: 'Confirmed', amount: '$520' },
  ];

  // Mock bookings per month for chart
  const bookingsPerMonth = [
    { month: 'Jan', bookings: 45 },
    { month: 'Feb', bookings: 52 },
    { month: 'Mar', bookings: 48 },
    { month: 'Apr', bookings: 65 },
    { month: 'May', bookings: 72 },
    { month: 'Jun', bookings: 85 },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const maxBookings = Math.max(...bookingsPerMonth.map(b => b.bookings));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:transform-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-emerald-600">Host Dashboard</h1>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
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
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings Overview</h3>
                <div className="flex items-end justify-between h-64 gap-4">
                  {bookingsPerMonth.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-emerald-500 rounded-t-lg transition-all duration-300"
                        style={{ height: `${(item.bookings / maxBookings) * 100}%` }}
                      ></div>
                      <p className="text-sm text-gray-500 mt-2">{item.month}</p>
                      <p className="text-xs font-medium text-gray-700">{item.bookings}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.property}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.guest}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">My Properties</h3>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Add Property
                </button>
              </div>
              <p className="text-gray-500">Manage your properties here.</p>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">All Bookings</h3>
              <p className="text-gray-500">View and manage all your bookings here.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Reviews</h3>
              <p className="text-gray-500">Check your property reviews here.</p>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Wallet</h3>
              <p className="text-gray-500">Manage your earnings and payouts here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Settings</h3>
              <p className="text-gray-500">Configure your account settings here.</p>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Help & Support</h3>
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
    </div>
  );
}
