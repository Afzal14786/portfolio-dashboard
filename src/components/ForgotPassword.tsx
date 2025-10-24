import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from 'react-toastify'; 
import { Send, ArrowLeft, Mail } from 'lucide-react'; 
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
            const response = await api.post('/user/password/reset/request', { email });

            if (response.data.success) {
                toast.success("Password reset link sent! Check your email.");
                setEmail('');
                // Redirect to login after successful request
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(response.data.message || "Failed to send reset link. Please try again.");
            }
        } catch (err: unknown) {
            console.error("Password reset error:", err);
            
            // Type-safe error handling
            if (axios.isAxiosError(err)) {
                // This is an Axios error
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
                // This is a generic JavaScript Error
                toast.error("Network error. Please check your connection and try again.");
            } else {
                // Unknown error type
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div 
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-3xl"
                role="dialog" 
                aria-labelledby="reset-password-title"
                aria-modal="true"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="/images/code.png" alt="code icon" className="w-15 h-15"/>
                    </div>
                    
                    <h1 id="reset-password-title" className="text-2xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h1>
                    
                    <p className="text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-base transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 cursor-text"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !email || !email.includes('@')}
                        className={`w-full py-3 text-white font-semibold rounded-xl shadow-lg transition duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                            (isSubmitting || !email || !email.includes('@'))
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending Reset Link...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Send Reset Link</span>
                            </>
                        )}
                    </button>
                </form>
                
                {/* Back to Login */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleBackToLogin}
                        className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition duration-200 cursor-pointer group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Back to Login</span>
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                        💡 Check your spam folder if you don't see the email within a few minutes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;