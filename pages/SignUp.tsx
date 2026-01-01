import React, { useState } from 'react';
import { Hexagon, Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2, Phone, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('account');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    const fullName = `${firstName} ${lastName}`;
    const { data, error } = await authService.signUp(email, password, fullName, phone);
    
    setIsLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setStep('payment');
  };

  const handlePaymentRedirect = () => {
    navigate('/payment-verification');
  };

  if (step === 'payment') {
    return (
      
        
          
            
              
            
            
            Account Created! ✓
            
              Your account has been created successfully. To complete your registration, please submit payment verification.
            

            
              Payment Details
              
                Bank: First Bank of Nigeria
                Account Name: Greater Kano Business Council
                Account Number: 1234567890
                Registration Fee: ₦50,000.00
              
            

            
              
                Submit Payment Proof
                
              
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl text-sm"
              >
                I'll Do This Later
              
            

            
              You'll need admin approval before you can log in.
            
          
        
      
    );
  }

  return (
    
      {/* Background Decoration */}
      
      

      
        {/* Brand Section */}
        
          
            
          
          GKBC Mobile
          Step 1: Create Account
        

        {/* SignUp Card */}
        
          
            Create Account
            Join the business community today.
          

          
            {/* Name Inputs */}
            
              
                First Name
                
                  
                    
                  
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                
              
              
                Last Name
                
                  
                    
                  
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                
              
            

            {/* Email Input */}
            
              Email
              
                
                  
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="name@company.com"
                  required
                />
              
            

            {/* Phone Input */}
            
              Phone
              
                
                  
                
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+234 800 123 4567"
                  required
                />
              
            

            {/* Password Input */}
            
              Password
              
                
                  
                
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ?  : }
                
              
            

            {/* Confirm Password Input */}
            
              Confirm Password
              
                
                  
                
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              
            

            {/* Submit Button */}
            
              {isLoading ? (
                <>
                  
                  Creating Account...
                </>
              ) : (
                <>
                  Continue to Payment
                  
                </>
              )}
            
          
        

        {/* Footer Login */}
        
          
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Sign In
            
          
        
      
    
  );
};

export default SignUp;