import React, { useState } from 'react';
import { Hexagon, Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) return;
        
        // Basic validation
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/home');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 relative overflow-hidden py-10">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-primary-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                 {/* Brand Section */}
                 <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 mb-3 rotate-3">
                        <Hexagon size={28} strokeWidth={2.5} className="text-white" fill="none" />
                    </div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">GKBC Mobile</h1>
                </div>

                {/* SignUp Card */}
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-xs text-gray-400 mt-1">Join the business community today.</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        {/* Name Inputs */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">First Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">Last Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                    placeholder="+234 800 123 4567"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign Up</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Login */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/')} className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;