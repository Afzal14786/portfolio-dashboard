import React, { useState, useEffect, type FormEvent } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from "../api/api";


const OTP_RESEND_DURATION = 120; // 2 minutes in seconds

const PRIMARY_COLOR = 'text-blue-600'; 

interface VerificationResponse {
    success: boolean;
    message?: string;
    user?: { id: string; email: string };
}

const OtpVerification: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const email = searchParams.get('email') || ''; 

    const [otp, setOtp] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(OTP_RESEND_DURATION);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        if (!email || !email.includes('@')) {
            toast.warn("Verification session invalid. Please register again.");
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        setIsResendDisabled(timeLeft > 0);
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    const handleResend = async () => {
        if (isResendDisabled || !email) return;

        try {
            setIsResendDisabled(true); 
            setTimeLeft(OTP_RESEND_DURATION);
            toast.info("Requesting new OTP...");

            const response = await api.get<VerificationResponse>(`/auth/user/resend-otp?email=${encodeURIComponent(email)}`);
            
            if (response.data.success) {
                toast.success(response.data.message || "New OTP sent successfully!");
            } else {
                toast.error(response.data.message || "Failed to resend OTP.");
            }

        } catch (err) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
                ? err.response.data.message
                : "Failed to resend OTP due to server error.";
            toast.error(errorMessage);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (otp.length !== 7) {
            toast.error("Please enter the 7-digit code.");
            return;
        }
        if (!email) {
             toast.error("Email address missing. Please restart registration.");
             return;
        }

        setIsSubmitting(true);

        try {
            // api call: /api/v1/auth/user/verify-otp
            const response = await api.post<VerificationResponse>('/auth/user/verify-otp', { email, otp });

            if (response.data.success) {
                toast.success(response.data.message || "Account verified! You can now log in.");
                
                // Navigate to the login page after successful verification
                navigate('/login'); 
            } else {
                toast.error(response.data.message || "Invalid OTP or session expired.");
            }
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
                ? err.response.data.message
                : "Verification failed due to a network error.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <main 
                className={`bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center 
                            hover:shadow-2xl transition-all duration-300
                            lg:p-10`}
                role="dialog" 
                aria-labelledby="otp-title"
            >
                <div 
                    className={`w-20 h-20 rounded-full flex items-center justify-center 
                                mx-auto mb-4 transition-transform duration-300`}
                >
                    <img src="/images/code.png" alt="logo" />
                </div>
                
                <h1 id="otp-title" className={`text-2xl font-semibold ${PRIMARY_COLOR} mb-1 tracking-tight`}>
                    TerminalX
                </h1>

                <p className="text-gray-800 text-sm mb-6 leading-relaxed">
                    Enter the 7-digit verification code sent to: <br/> 
                    <span className="font-medium text-blue-600 block truncate">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 7))} 
                        placeholder="XXXXXXX"
                        maxLength={7}
                        required
                        inputMode="text" 
                        autoComplete="one-time-code"
                        className={`w-full py-3 px-4 border-2 border-gray-200 rounded-lg 
                                    text-lg text-center tracking-widest font-mono 
                                    focus:outline-none focus:border-blue-600 focus:shadow-md 
                                    transition duration-250`}
                        disabled={isSubmitting}
                    />
                    
                    <div className="text-sm text-gray-700 pt-1">
                        Resend OTP in <span className="font-semibold">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleResend}
                        className={`text-sm font-semibold transition duration-200 ${
                            isResendDisabled 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-blue-600 hover:text-blue-800"
                        }`}
                        disabled={isResendDisabled}
                    >
                        Resend OTP
                    </button>

                    {/* Button Styling */}
                    <button
                        type="submit"
                        disabled={isSubmitting || otp.length !== 7}
                        className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
                            (isSubmitting || otp.length !== 7)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-800 transform hover:translate-y-[-2px]"
                        }`}
                    >
                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
                
                {/* Footer Styling */}
                <p className="text-sm text-gray-500 mt-6">
                    Need help? <a href="/support" className="text-blue-600 font-medium hover:underline">Contact Support</a>
                </p>
            </main>
        </div>
    );
};

export default OtpVerification;