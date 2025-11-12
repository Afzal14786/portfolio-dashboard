import React, { useState, useEffect, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Removed useLocation
import axios from "axios";
import { toast } from "react-toastify";
import api from "../api/api";

const OTP_RESEND_DURATION = 300; // 5 minutes in seconds

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

  // Get configuration based on OTP type
  const getConfig = () => {
    const configs = {
      register: {
        title: "Verify Your Email",
        description: "Enter the 6-digit code to complete your registration",
        successMessage: "Account verified successfully!",
        endpoint: "/admin-auth/signup/verify-otp",
        resendEndpoint: "/admin-auth/auth-otp/resend",
        redirectTo: "/login",
      },
      login: {
        title: "Login Verification",
        description: "Enter the 6-digit code to complete your login",
        successMessage: "Login successful!",
        endpoint: "/admin-auth/signin/verify",
        resendEndpoint: "/admin-auth/auth-otp/resend",
        redirectTo: redirectTo,
      },
      "reset-password": {
        title: "Reset Password",
        description: "Enter the 6-digit code to reset your password",
        successMessage: "Password reset verified!",
        endpoint: "/user/password/reset/verify-otp",
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
        resendEndpoint: "/auth/otp/resend", // ✅ Use the new OTP resend endpoint
        redirectTo: "/settings",
      },
    };
    return configs[type] || configs.register;
  };

  // Rest of your component code remains the same...
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
          localStorage.setItem(
            "userData",
            JSON.stringify(response.data.data.user)
          );
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.data.accessToken}`;

          navigate(config.redirectTo);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/images/code.png" alt="code icon" className="w-15 h-15" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {config.title}
          </h1>
          <p className="text-gray-600 mb-2">{config.description}</p>
          <p className="text-sm text-gray-500">
            Sent to <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
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
              className="w-full py-4 px-4 border-2 border-gray-200 rounded-xl text-2xl text-center tracking-widest font-mono uppercase focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 cursor-text"
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
            <p className="text-sm text-gray-600 mb-4">
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
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={isResendDisabled}
              className={`text-sm font-medium transition duration-200 cursor-pointer ${
                isResendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800 hover:underline transform hover:scale-105"
              }`}
            >
              Resend OTP
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className={`w-full py-4 text-white font-semibold rounded-xl shadow-lg transition duration-300 cursor-pointer ${
              isSubmitting || otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
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
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer transition duration-200 transform hover:scale-105"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
