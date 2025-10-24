import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import api from "../api/api";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
}

const initialFormData: FormData = { email: "", password: "" };

const AuthBanner: React.FC = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-[#0d1117] text-white font-mono text-sm p-8 items-center justify-center">
    <div className="max-w-md w-full">
      <p className="text-green-400 mb-1">$ start NEW_DAY</p>
      <p className="text-white mb-1">$ wake_up</p>
      <p className="text-green-400 mb-1">$ start GET_OUT_OF_BED</p>
      <p className="text-green-400 mb-1">$ start BREAKFAST</p>
      <p className="text-red-400 mb-1">$ ERROR: cereals not found</p>
      <p className="text-red-400 mb-1">$ ERROR: milk not found</p>
      <p className="text-white mb-1">$ skip_breakfast</p>
      <p className="text-green-400 mb-1">$ start DRIVE_TO_WORK</p>
      <p className="text-green-400 mb-1">$ start DRINK_COFFEE</p>
      <p className="text-green-400 mb-1">$ start WORK</p>
      <p className="text-yellow-400 mb-1">$ ALERT: deadline is today</p>
      <p className="text-green-400 mb-1">$ start PANIC</p>
      <p className="text-green-400 mb-1">$ init_anxiety</p>
      <p className="text-white mb-1">$ skip_dinner</p>
      <p className="text-green-400 font-semibold mt-4">
        $ DELIVERED PROJECT SUCCESSFULLY
      </p>
      <div className="mt-6 text-center">
        <h2 className="text-blue-400 text-lg font-bold">
          &lt;&gt; Happy Programmer&apos;s Day &lt;/&gt;
        </h2>
      </div>
    </div>
  </div>
);

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email!");

        // Navigate to OTP verification with login type
        navigate(
          `/verify-otp?email=${encodeURIComponent(formData.email)}&type=login`
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message =
          error.response.data.message || "An unexpected error occurred.";

        switch (status) {
          case 403:
            toast.error(message);
            navigate(
              `/verify-otp?email=${encodeURIComponent(
                formData.email
              )}&type=login`
            );
            break;
          case 401:
            toast.error("Invalid email or password");
            setFormData((prev) => ({ ...prev, password: "" }));
            break;
          case 422:
            toast.error("Please check your input fields");
            break;
          case 429:
            toast.error("Too many attempts. Please try again later.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(message);
        }
      } else {
        toast.error("Network error. Could not connect to server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Redirecting to ${provider} login...`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
              <img
                src="/images/code.png"
                alt="code icon"
                className="w-11 h-11"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">TerminalX</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mb-8">
            Please enter your login details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 cursor-text"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition duration-200 cursor-pointer"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.64 1.22 9.12 3.6l6.8-6.8C35.88 2.6 30.3 0 24 0 14.64 0 6.64 5.42 2.56 13.34l7.94 6.18C12.3 13.3 17.64 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.98 24.5c0-1.64-.15-3.22-.42-4.75H24v9h13.02c-.6 3.1-2.36 5.74-4.97 7.54l7.78 6.04C44.6 38.5 46.98 31.9 46.98 24.5z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M24 48c6.48 0 11.92-2.15 15.9-5.85l-7.78-6.04c-2.16 1.45-4.93 2.29-8.12 2.29-6.26 0-11.56-4.22-13.48-9.9l-7.94 6.18C6.64 42.58 14.64 48 24 48z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.52 28.5c-.46-1.38-.72-2.86-.72-4.5s.26-3.12.72-4.5l-7.94-6.18C.9 16.64 0 20.2 0 24s.9 7.36 2.58 10.68l7.94-6.18z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  Sign in with Google
                </span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialLogin("GitHub")}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.84 10.93c.57.1.77-.25.77-.55v-2c-3.18.7-3.85-1.54-3.85-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.03-.7.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.01 1.74 2.66 1.24 3.31.95.1-.73.4-1.24.72-1.52-2.54-.3-5.22-1.27-5.22-5.64 0-1.25.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.8 10.8 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.09 0 4.39-2.68 5.33-5.23 5.62.41.35.78 1.05.78 2.12v3.14c0 .31.21.66.78.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                  />
                </svg>
                <span className="font-medium">Sign in with GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 font-medium hover:underline cursor-pointer transition duration-200"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>

        {/* RIGHT: Banner */}
        <AuthBanner />
      </div>
    </div>
  );
};

export default Login;
