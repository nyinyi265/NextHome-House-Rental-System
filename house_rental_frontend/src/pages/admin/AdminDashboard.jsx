import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import env from '../../environment/environment';
import { Check, X, Loader2, Building2, FileText, Clock, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [landlordRequests, setLandlordRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchLandlordRequests();
  }, []);

  const fetchLandlordRequests = async () => {
    try {
      const response = await fetch(`${env.API_BASE_URL}/admin/landlord-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const result = await response.json();
      setLandlordRequests(result.data || []);
    } catch (error) {
      console.error('Failed to fetch landlord requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      const response = await fetch(`${env.API_BASE_URL}/admin/landlord-requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        setLandlordRequests(prev => 
          prev.map(req => req.id === id ? { ...req, status: 'approved', verified_at: new Date().toISOString() } : req)
        );
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      const response = await fetch(`${env.API_BASE_URL}/admin/landlord-requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        setLandlordRequests(prev => 
          prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
        );
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setProcessing(null);
    }
  };

  const pendingRequests = landlordRequests.filter(req => req.status === 'pending');
  const approvedRequests = landlordRequests.filter(req => req.status === 'approved');
  const rejectedRequests = landlordRequests.filter(req => req.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage landlord requests and approvals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                <p className="text-gray-600">Pending Requests</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
                <p className="text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rejectedRequests.length}</p>
                <p className="text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Landlord Requests */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Landlord Requests</h2>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : landlordRequests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No landlord requests found</p>
            </div>
          ) : (
            <div className="divide-y">
              {landlordRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {request.user?.profile_path ? (
                          <img src={env.getProfileUrl(request.user.profile_path)} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.user?.name}</h3>
                        <p className="text-sm text-gray-600">{request.user?.email}</p>
                        <p className="text-sm text-gray-500">{request.user?.phone_number}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                          {request.verified_at && (
                            <span className="text-xs text-gray-500">
                              Verified: {new Date(request.verified_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Applied: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processing === request.id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {processing === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processing === request.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {processing === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  {request.documents && request.documents.length > 0 && (
                    <div className="mt-4 ml-16">
                      <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                      <div className="flex gap-2">
                        {request.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={env.getDocumentUrl(doc.document_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            {doc.document_type}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}