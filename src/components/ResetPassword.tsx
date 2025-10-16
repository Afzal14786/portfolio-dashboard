import React, { useState, type FormEvent } from "react";
import api from "../api/api";
import { toast } from 'react-toastify'; 
import { Send } from 'lucide-react'; 
const PRIMARY_COLOR = 'text-blue-600';

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email.includes('@')) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/user/forgot-password');

            if (response.data.success) {
                toast.success(response.data.message || "Email sent! Check your inbox for the reset link.");
                setEmail('');
            } else {
                toast.error(response.data.message || "Failed to send reset link. Email not found.");
            }
        } catch (err) {
            toast.error("An unexpected error occurred. Please try again later.");
            console.error(`Something error while resetting the password : ${err}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <main 
                className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center 
                            hover:shadow-3xl transition-all duration-300 transform scale-100 
                            lg:p-10`}
                role="dialog" 
                aria-labelledby="reset-password-title"
                aria-modal="true"
            >
                <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center 
                                mx-auto mb-4 transition-transform duration-300`}
                >
                    <img src="/images/code.png" alt="" />
                </div>
                
                <h1 id="reset-password-title" className={`text-2xl font-semibold ${PRIMARY_COLOR} mb-1 tracking-tight`}>
                    TerminalX
                </h1>

                <p className="text-gray-700 text-base mb-6 leading-relaxed mt-4">
                    Enter your registered email ID below. A **password reset link** will be sent to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@example.com"
                            required
                            inputMode="email" 
                            autoComplete="email"
                            className={`w-full py-3 px-4 pl-12 border-2 border-gray-200 rounded-xl 
                                        text-base text-left transition duration-250 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600`}
                            disabled={isSubmitting}
                        />
                        <Send className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || email.length < 5 || !email.includes('@')}
                        className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition duration-300 flex items-center justify-center space-x-2 ${
                            (isSubmitting || email.length < 5 || !email.includes('@'))
                                ? "bg-gray-400 cursor-not-allowed shadow-none"
                                : "bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.01] hover:shadow-xl"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Sending Link...</span>
                            </>
                        ) : (
                            <span>Send Reset Link</span>
                        )}
                    </button>
                </form>
                
                {/* Footer/Navigation */}
                <p className="text-sm text-gray-500 mt-6">
                    Remember your password? 
                    <a href="/login" className="text-blue-600 font-medium hover:underline ml-1">
                        Back to Login
                    </a>
                </p>
            </main>
        </div>
    );
};

export default ResetPassword;
