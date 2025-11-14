import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from 'react-toastify'; 
import { Send, ArrowLeft, Mail, Key } from 'lucide-react'; 
import axios from 'axios';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/admin/password/reset/request', { email });

            if (response.data.success) {
                toast.success("Password reset link sent! Check your email.");
                setEmail('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(response.data.message || "Failed to send reset link. Please try again.");
            }
        } catch (err: unknown) {
            console.error("Password reset error:", err);
            
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const message = err.response?.data?.message;

                switch (status) {
                    case 404:
                        toast.error("No account found with this email address.");
                        break;
                    case 429:
                        toast.error("Too many attempts. Please try again later.");
                        break;
                    case 500:
                        toast.error("Server error. Please try again later.");
                        break;
                    default:
                        toast.error(message || "Failed to send reset link. Please try again.");
                }
            } else if (err instanceof Error) {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div 
                className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 w-full max-w-md transition-all duration-300 hover:shadow-3xl"
                role="dialog" 
                aria-labelledby="reset-password-title"
                aria-modal="true"
            >
                {/* Header */}
                <div className="text-center mb-6 lg:mb-8">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/50">
                        <Key className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-600" />
                    </div>
                    
                    <h1 id="reset-password-title" className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Reset Password
                    </h1>
                    
                    <p className="text-gray-600 text-sm lg:text-base">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200/60 rounded-2xl text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 bg-white/60 backdrop-blur-sm disabled:opacity-50"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !email || !email.includes('@')}
                        className={`w-full py-3 lg:py-4 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                            (isSubmitting || !email || !email.includes('@'))
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm lg:text-base">Sending Reset Link...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span className="text-sm lg:text-base">Send Reset Link</span>
                            </>
                        )}
                    </button>
                </form>
                
                {/* Back to Login */}
                <div className="text-center mt-4 lg:mt-6">
                    <button
                        onClick={handleBackToLogin}
                        className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium text-sm lg:text-base">Back to Login</span>
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/60">
                    <p className="text-xs lg:text-sm text-blue-700 text-center">
                        📧 Check your spam folder if you don't see the email within a few minutes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;