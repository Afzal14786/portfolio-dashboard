import React, { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or expired reset link. Please request a new one.");
      return;
    }

    if (!isPasswordValid()) {
      toast.error("Please ensure your password meets all requirements.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match. Please check and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/user/password/reset/verify-otp", {
        token,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword, // ← ADD THIS LINE
      });

      if (response.data.success) {
        toast.success(
          "Password reset successfully! You can now login with your new password."
        );

        // Redirect to login after success
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(
          response.data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (err: unknown) {
      console.error("Password reset error:", err);

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        switch (status) {
          case 400:
            toast.error(message || "Invalid reset token.");
            break;
          case 401:
            toast.error("Reset link has expired. Please request a new one.");
            break;
          case 404:
            toast.error("User not found.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(
              message || "Failed to reset password. Please try again."
            );
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-2xl">❌</div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Reset Link
          </h1>

          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a
            new reset link.
          </p>

          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Request New Reset Link
          </button>

          <button
            onClick={handleBackToLogin}
            className="w-full py-3 mt-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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

          <h1
            id="reset-password-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Set New Password
          </h1>

          <p className="text-gray-600">
            Create a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl text-base transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 cursor-text"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition duration-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl text-base transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text ${
                  formData.confirmPassword && !passwordsMatch
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition duration-200 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </h3>
            <div className="space-y-1 text-sm">
              <div
                className={`flex items-center ${
                  passwordStrength.hasMinLength
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                At least 8 characters
              </div>
              <div
                className={`flex items-center ${
                  passwordStrength.hasUpperCase
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                One uppercase letter
              </div>
              <div
                className={`flex items-center ${
                  passwordStrength.hasLowerCase
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                One lowercase letter {/* ← THIS IS THE FIX */}
              </div>
              <div
                className={`flex items-center ${
                  passwordStrength.hasNumber
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                One number
              </div>
              <div
                className={`flex items-center ${
                  passwordStrength.hasSpecialChar
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                One special character
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !isPasswordValid() ||
              !passwordsMatch ||
              !formData.password
            }
            className={`w-full py-3 text-white font-semibold rounded-xl shadow-lg transition duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
              isSubmitting ||
              !isPasswordValid() ||
              !passwordsMatch ||
              !formData.password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Resetting Password...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Reset Password</span>
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
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium">Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
