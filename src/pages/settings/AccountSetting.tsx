import { useState } from 'react';
import { Lock, Mail, Shield, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { accountService } from '../../services/accountService';

interface ApiErrorResponse {
  response?: { data?: { message?: string } };
  message?: string;
}

export default function AccountSetting() {
  // Passwords State
  const [passLoading, setPassLoading] = useState<boolean>(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Email Update State
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [showOtpField, setShowOtpField] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPassError("Password must be at least 8 characters long.");
      return;
    }

    setPassLoading(true);
    try {
      const res = await accountService.updatePassword(passwords);
      setPassSuccess(res.message || "Password updated successfully.");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setPassError(apiError.response?.data?.message || 'Failed to update password.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);

    try {
      const res = await accountService.requestEmailUpdate(newEmail);
      setEmailSuccess(res.message || "OTP sent to new email.");
      setShowOtpField(true);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setEmailError(apiError.response?.data?.message || 'Failed to request email update.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);

    try {
      const res = await accountService.verifyEmailUpdate(newEmail, otp);
      setEmailSuccess(res.message || "Email updated successfully!");
      setShowOtpField(false);
      setNewEmail('');
      setOtp('');
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setEmailError(apiError.response?.data?.message || 'Invalid OTP.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your security preferences and authentication methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Security Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security Level</h3>
              <p className="text-xs text-gray-500">High (Protected via JWT & OTP)</p>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Change Password Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <Lock className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            </div>
            
            <div className="p-6">
              {passError && (
                <div className="mb-6 p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /><span>{passError}</span>
                </div>
              )}
              {passSuccess && (
                <div className="mb-6 p-3.5 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" /><span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                  <input 
                    type="password" name="currentPassword" required
                    value={passwords.currentPassword} onChange={handlePasswordChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                    <input 
                      type="password" name="newPassword" required minLength={8}
                      value={passwords.newPassword} onChange={handlePasswordChange}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                    <input 
                      type="password" name="confirmPassword" required minLength={8}
                      value={passwords.confirmPassword} onChange={handlePasswordChange}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={passLoading} className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 disabled:opacity-70 flex items-center">
                    {passLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Updating...</> : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 2. Change Email Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <Mail className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">Update Email Address</h2>
            </div>
            
            <div className="p-6">
              {emailError && (
                <div className="mb-6 p-3.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /><span>{emailError}</span>
                </div>
              )}
              {emailSuccess && (
                <div className="mb-6 p-3.5 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" /><span>{emailSuccess}</span>
                </div>
              )}

              {!showOtpField ? (
                <form onSubmit={handleEmailRequest} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Email Address</label>
                    <input 
                      type="email" required
                      value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. new.email@example.com"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={emailLoading} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-70 flex items-center">
                      {emailLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Sending OTP...</> : 'Send Verification OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpVerify} className="space-y-5">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 mb-4">
                    An OTP has been sent to <strong>{newEmail}</strong>. Please enter it below to confirm the change.
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Enter OTP</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" required maxLength={6}
                        value={otp} onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-widest font-mono font-bold" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowOtpField(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={emailLoading} className="px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl shadow-sm hover:bg-green-700 disabled:opacity-70 flex items-center">
                      {emailLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Verifying...</> : 'Verify & Update Email'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}