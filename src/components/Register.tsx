import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Key, User, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../api/api'; 

interface FormData {
  name: string;
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  name: "",
  user_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const AuthBanner: React.FC = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-[#0d1117] text-white font-mono text-sm p-8 items-center justify-center">
    <div className="max-w-md w-full">
      <p className="text-green-400 mb-1">$ git init new-project</p>
      <p className="text-white mb-1">$ cd new-project</p>
      <p className="text-green-400 mb-1">$ npm create react-app .</p>
      <p className="text-yellow-400 mb-1">$ // Building amazing things...</p>
      <p className="text-green-400 mb-1">$ git add .</p>
      <p className="text-green-400 mb-1">$ git commit -m "Initial commit"</p>
      <p className="text-blue-400 mb-1">$ git push origin main</p>
      <p className="text-green-400 font-semibold mt-4">
        $ 🚀 Project deployed successfully!
      </p>
      <div className="mt-6 text-center">
        <h2 className="text-blue-400 text-lg font-bold">
          &lt;&gt; Welcome to TerminalX &lt;/&gt;
        </h2>
      </div>
    </div>
  </div>
);

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[a-z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isPasswordStrong = passwordStrength >= 3;
  
  const isFormValid =
    formData.name &&
    formData.user_name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    passwordsMatch &&
    isPasswordStrong;

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill all fields and ensure passwords meet requirements.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const registeredEmail = response.data.data?.email || formData.email;
        
        toast.success(response.data.message || "Registration successful! Check your email for verification.");            
        
        // Navigate to OTP verification with register type
        navigate(`/verify-otp?email=${encodeURIComponent(registeredEmail)}&type=register`);
      }
      
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Registration failed. Please check your network.";
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left: Code Banner */}
        <AuthBanner />

        {/* Right: Registration Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
              <img src="/images/code.png" alt="logo" className="w-11 h-11" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">TerminalX</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account 👋</h2>
          <p className="text-gray-500 mb-8">Please enter your details to register.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                required
                value={formData.user_name}
                onChange={handleChange}
                placeholder="johndoe123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Password strength:</span>
                    <span className={`
                      ${passwordStrength <= 2 ? 'text-red-500' : ''}
                      ${passwordStrength === 3 ? 'text-yellow-500' : ''}
                      ${passwordStrength >= 4 ? 'text-green-500' : ''}
                    `}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-500 mt-1 space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>
                      • One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>
                      • One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    passwordsMatch || !formData.confirmPassword
                      ? "border-gray-300"
                      : "border-red-500"
                  }`}
                />
              </div>
              {!passwordsMatch && formData.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
                isFormValid && !isSubmitting
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registering...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Signups */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => toast.info("Redirecting to Google...")}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.64 1.22 9.12 3.6l6.8-6.8C35.88 2.6 30.3 0 24 0 14.64 0 6.64 5.42 2.56 13.34l7.94 6.18C12.3 13.3 17.64 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.5c0-1.64-.15-3.22-.42-4.75H24v9h13.02c-.6 3.1-2.36 5.74-4.97 7.54l7.78 6.04C44.6 38.5 46.98 31.9 46.98 24.5z"/>
                  <path fill="#4A90E2" d="M24 48c6.48 0 11.92-2.15 15.9-5.85l-7.78-6.04c-2.16 1.45-4.93 2.29-8.12 2.29-6.26 0-11.56-4.22-13.48-9.9l-7.94 6.18C6.64 42.58 14.64 48 24 48z"/>
                  <path fill="#FBBC05" d="M10.52 28.5c-.46-1.38-.72-2.86-.72-4.5s.26-3.12.72-4.5l-7.94-6.18C.9 16.64 0 20.2 0 24s.9 7.36 2.58 10.68l7.94-6.18z"/>
                </svg>
                <span className="font-medium text-gray-700">Sign up with Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => toast.info("Redirecting to GitHub...")}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.84 10.93c.57.1.77-.25.77-.55v-2c-3.18.7-3.85-1.54-3.85-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.03-.7.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.01 1.74 2.66 1.24 3.31.95.1-.73.4-1.24.72-1.52-2.54-.3-5.22-1.27-5.22-5.64 0-1.25.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.8 10.8 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.09 0 4.39-2.68 5.33-5.23 5.62.41.35.78 1.05.78 2.12v3.14c0 .31.21.66.78.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
                </svg>
                <span className="font-medium">Sign up with GitHub</span>
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-medium hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;