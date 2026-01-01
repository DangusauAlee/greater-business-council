import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';
import { useAuthStore } from '../store/authStore';

const PaymentVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [proofImage, setProofImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (user) {
      loadPaymentStatus();
    }
  }, [user]);

  const loadPaymentStatus = async () => {
    if (!user) return;
    const { data } = await authService.checkPaymentStatus(user.id);
    setPaymentStatus(data);
  };

  const handleImagePick = async () => {
    try {
      const blob = await storageService.pickImage();
      setProofImage(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !paymentReference || !paymentAmount) return;

    setIsSubmitting(true);
    try {
      let proofUrl = '';
      
      if (proofImage) {
        proofUrl = await storageService.uploadImage(
          'payment-proofs',
          `${user.id}-${Date.now()}.jpg`,
          proofImage
        );
      }

      await authService.submitPaymentVerification(
        paymentReference,
        parseFloat(paymentAmount),
        paymentMethod,
        proofUrl
      );

      await loadPaymentStatus();
      
      setPaymentReference('');
      setPaymentAmount('');
      setProofImage(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    if (!paymentStatus) return null;

    switch (paymentStatus.status) {
      case 'pending':
        return (
          
            
            
              Payment Under Review
              
                Your payment is being verified by our admin team. You'll receive an email once reviewed.
              
            
          
        );
      case 'verified':
        return (
          
            
            
              Payment Verified!
              
                Your payment has been confirmed. You can now access all features.
              
            
          
        );
      case 'rejected':
        return (
          
            
            
              Payment Verification Failed
              
                {paymentStatus.notes || 'Unable to verify payment. Please submit again with correct details.'}
              
            
          
        );
    }
  };

  return (
    
      
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-white rounded-full hover:bg-white/10"
        >
          
        
        Payment Verification
      

      
        {paymentStatus && getStatusBadge()}

        {(!paymentStatus || paymentStatus.status === 'rejected') && (
          
            
              
                
              
              Submit Payment Details
              
                Upload your payment proof for verification
              
            

            
              
                
                  Payment Reference/Transaction ID
                
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
                  placeholder="TXN123456789"
                  required
                />
              

              
                
                  Amount Paid (₦)
                
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
                  placeholder="50000.00"
                  required
                />
              

              
                
                  Payment Method
                
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm"
                >
                  Bank Transfer
                  Card Payment
                  Cash Deposit
                  Mobile Money
                
              

              
                
                  Payment Proof (Optional)
                
                
                  {previewUrl ? (
                    
                  ) : (
                    <>
                      
                      Tap to upload receipt/screenshot
                    </>
                  )}
                
              

              
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              
            

            
              Payment Details
              
                Bank: First Bank of Nigeria
                Account Name: Greater Kano Business Council
                Account Number: 1234567890
                Amount: ₦50,000.00
              
            
          
        )}
      
    
  );
};

export default PaymentVerification;