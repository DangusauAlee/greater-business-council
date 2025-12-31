import React, { useState } from 'react';
import { Hexagon, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/home');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-primary-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Brand Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 mb-4 rotate-3 transform hover:rotate-6 transition-transform">
                        <Hexagon size={36} strokeWidth={2.5} className="text-white" fill="none" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">GKBC Mobile</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Greater Kano Business Council</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-xs text-gray-400 mt-1">Please sign in to continue to your dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
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
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Password</label>
                                <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm"
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

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Sign Up */}
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => navigate('/signup')}
                            className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Sign Up
                        </button>
                    </p>
                    
                    <div className="mt-8 flex justify-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            <CheckCircle size={12} className="text-green-500" />
                            Secure
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            <CheckCircle size={12} className="text-green-500" />
                            Verified
                        </div>
                         <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            <CheckCircle size={12} className="text-green-500" />
                            Private
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;