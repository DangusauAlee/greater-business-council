# GKBC - Final Pages

## File 7: `pages/AdminDashboard.tsx`
**Location:** `pages/AdminDashboard.tsx` (CREATE NEW)

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Search, Eye } from 'lucide-react';
import { adminService } from '../services/admin.service';
import { useAuthStore } from '../store/authStore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAdminAccess();
    loadPendingUsers();
  }, []);

  const checkAdminAccess = async () => {
    if (!user) return;
    const { isAdmin } = await adminService.isAdmin(user.id);
    if (!isAdmin) {
      navigate('/home');
    }
  };

  const loadPendingUsers = async () => {
    setLoading(true);
    const { data } = await adminService.getPendingUsers();
    setPendingUsers(data || []);
    setLoading(false);
  };

  const handleApprove = async (userId: string) => {
    if (!user || !confirm('Approve this user?')) return;
    
    await adminService.approveUser(userId, user.id);
    await loadPendingUsers();
  };

  const handleReject = async () => {
    if (!user || !selectedUser || !rejectionReason.trim()) return;
    
    await adminService.rejectUser(selectedUser.id, rejectionReason, user.id);
    setShowRejectModal(false);
    setSelectedUser(null);
    setRejectionReason('');
    await loadPendingUsers();
  };

  const openRejectModal = (userItem: any) => {
    setSelectedUser(userItem);
    setShowRejectModal(true);
  };

  const filteredUsers = pendingUsers.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
      {/* Header */}
      
        <button
          onClick={() => navigate('/home')}
          className="p-2 text-white rounded-full hover:bg-white/10"
        >
          
        
        Admin Dashboard
      

      {/* Stats Cards */}
      
        
          
          {pendingUsers.length}
          Pending
        
        
          
          0
          Approved
        
        
          
          0
          Rejected
        
      

      {/* Search */}
      
        
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"
          />
        
      

      {/* User List */}
      
        Pending Approvals
        
        {loading ? (
          Loading...
        ) : filteredUsers.length === 0 ? (
          No pending users
        ) : (
          
            {filteredUsers.map(userItem => (
              
                
                  
                    
                      {userItem.full_name?.charAt(0) || 'U'}
                    
                    
                      {userItem.full_name}
                      {userItem.email}
                      {userItem.phone}
                    
                  
                  
                    Pending
                  
                

                {/* Payment Info */}
                {userItem.payment_verification && userItem.payment_verification.length > 0 && (
                  
                    Payment Details:
                    
                      Ref: {userItem.payment_verification[0].payment_reference}
                      Amount: ₦{userItem.payment_verification[0].payment_amount}
                      Method: {userItem.payment_verification[0].payment_method}
                      {userItem.payment_verification[0].payment_proof_url && (
                        
                           View Proof
                        
                      )}
                    
                  
                )}

                {/* Actions */}
                
                  <button
                    onClick={() => handleApprove(userItem.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                     Approve
                  
                  <button
                    onClick={() => openRejectModal(userItem)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                     Reject
                  
                
              
            ))}
          
        )}
      

      {/* Reject Modal */}
      {showRejectModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowRejectModal(false)}
          />
          
            Reject User
            
              Please provide a reason for rejection. This will be sent to the user via email.
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Payment not verified, Invalid payment reference..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 h-24 resize-none"
            />
            
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold"
              >
                Cancel
              
              
                Send Rejection
              
            
          
        </>
      )}
    
  );
};

export default AdminDashboard;
