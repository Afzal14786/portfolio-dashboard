import React, { useState, useEffect, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api/api";
import { Shield, ArrowLeft, Clock } from 'lucide-react';

const OTP_RESEND_DURATION = 300;

interface VerificationResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: {
      _id: string;
      name: string;
      email: string;
      isVerified: boolean;
    };
    accessToken?: string;
    resetToken?: string;
  };
}

type OTPType =
  | "register"
  | "login"
  | "reset-password"
  | "update-password"
  | "email-update";

const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
  const type = (searchParams.get("type") || "register") as OTPType;
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_RESEND_DURATION);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const getConfig = () => {
    const configs = {
      register: {
        title: "Verify Your Email",
        description: "Enter the 6-digit code to complete your registration",
        successMessage: "Account verified successfully!",
        endpoint: "/admin/auth/signup/verify-otp",
        resendEndpoint: "/admin/auth/auth-otp/resend",
        redirectTo: "/login",
      },
      login: {
        title: "Login Verification",
        description: "Enter the 6-digit code to complete your login",
        successMessage: "Login successful!",
        endpoint: "/admin/auth/signin/verify-otp",
        resendEndpoint: "/admin/auth/auth-otp/resend",
        redirectTo: redirectTo,
      },
      "reset-password": {
        title: "Reset Password",
        description: "Enter the 6-digit code to reset your password",
        successMessage: "Password reset verified!",
        endpoint: "/admin/password/reset/verify",
        resendEndpoint: "/auth/otp/resend",
        redirectTo: "/reset-password",
      },
      "update-password": {
        title: "Update Password",
        description: "Enter the 6-digit code to update your password",
        successMessage: "Password update verified!",
        endpoint: "/user/password/update/verify-otp",
        resendEndpoint: "/auth/otp/resend",
        redirectTo: "/settings",
      },
      "email-update": {
        title: "Update Email",
        description: "Enter the 6-digit code to update your email",
        successMessage: "Email update verified!",
        endpoint: "/user/email/verify-otp",
        resendEndpoint: "/auth/otp/resend",
        redirectTo: "/settings",
      },
    };
    return configs[type] || configs.register;
  };

  useEffect(() => {
    if (!email || !email.includes("@")) {
      toast.warn("Verification session invalid. Please try again.");
      navigate(type === "register" ? "/register" : "/login");
    }
  }, [email, navigate, type]);

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
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string) => {
    const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setOtp(formattedValue.slice(0, 6));
  };

  const handleResend = async () => {
    if (isResendDisabled || !email) return;

    try {
      setIsResendDisabled(true);
      setTimeLeft(OTP_RESEND_DURATION);
      toast.info("Requesting new OTP...");

      const config = getConfig();
      const response = await api.post(config.resendEndpoint, {
        email,
        type,
      });

      if (response.data.success) {
        toast.success(response.data.message || "New OTP sent successfully!");
      } else {
        toast.error(response.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to resend OTP due to server error.";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-character code.");
      return;
    }
    if (!email) {
      toast.error("Email address missing. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const config = getConfig();
      const response = await api.post<VerificationResponse>(config.endpoint, {
        email,
        otp,
        type,
      });

      if (response.data.success) {
        toast.success(config.successMessage);

        if (type === "login" && response.data.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.data.accessToken);
          localStorage.setItem("refreshToken", response.data.data.refreshToken);

          if (response.data.data.user) {
            localStorage.setItem(
              "userData",
              JSON.stringify(response.data.data.user)
            );
          }

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.data.accessToken}`;

          setTimeout(() => {
            navigate(config.redirectTo);
          }, 100);
        } else if (
          type === "reset-password" &&
          response.data.data?.resetToken
        ) {
          navigate(`/reset-password?token=${response.data.data.resetToken}`);
        } else {
          navigate(config.redirectTo);
        }
      } else {
        toast.error(response.data.message || "Invalid OTP or session expired.");
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Verification failed due to a network error.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const config = getConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl p-6 lg:p-8 w-full max-w-md transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/50">
            <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-600" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-gray-600 mb-2 text-sm lg:text-base">{config.description}</p>
          <p className="text-xs lg:text-sm text-gray-500">
            Sent to <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
              Enter 6-character code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              placeholder="A1B2C3"
              maxLength={6}
              required
              inputMode="text"
              autoComplete="one-time-code"
              className="w-full py-3 lg:py-4 px-4 border-2 border-gray-200/60 rounded-2xl text-lg lg:text-xl text-center tracking-widest font-mono uppercase focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 bg-white/60 backdrop-blur-sm disabled:opacity-50"
              disabled={isSubmitting}
              autoFocus
              style={{ textTransform: "uppercase" }}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Code may contain letters and numbers
            </p>
          </div>

          {/* Timer and Resend */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3 lg:mb-4">
              <Clock className="w-4 h-4" />
              <span>
                {timeLeft > 0 ? (
                  <>
                    Code expires in{" "}
                    <span className="font-semibold text-red-500">
                      {formatTime(timeLeft)}
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-semibold">
                    You can now resend OTP
                  </span>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={isResendDisabled}
              className={`text-sm font-medium transition-all duration-200 cursor-pointer ${
                isResendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:text-indigo-800 hover:underline transform hover:scale-105"
              }`}
            >
              Resend OTP
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className={`w-full py-3 lg:py-4 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 cursor-pointer ${
              isSubmitting || otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:scale-[1.02]"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>

        {/* Back Button */}
        <div className="text-center mt-4 lg:mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer group text-sm lg:text-base"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;