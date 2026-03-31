import React, { useState } from 'react';
import { 
  Lock, Mail, Shield, AlertCircle, CheckCircle2, 
  Loader2, KeyRound, Eye, EyeOff, ArrowRight 
} from 'lucide-react';
import { accountService } from '../../services/accountService';

interface ApiErrorResponse {
  response?: { data?: { message?: string } };
  message?: string;
}

export default function AccountSetting() {
  // ===================== PASSWORD STATE =====================
  const [passLoading, setPassLoading] = useState<boolean>(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [showPassOtpField, setShowPassOtpField] = useState<boolean>(false);
  const [passOtp, setPassOtp] = useState<string>('');
  
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // ===================== EMAIL STATE =====================
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>('');
  const [emailOtp, setEmailOtp] = useState<string>('');
  const [showEmailOtpField, setShowEmailOtpField] = useState<boolean>(false);

  // ===================== HANDLERS =====================
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePassVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Step 1: Request Password Update (Sends OTP)
  const handlePasswordRequest = async (e: React.FormEvent) => {
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
      const res = await accountService.requestPasswordUpdate({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setPassSuccess(res.message || "OTP sent to your email.");
      setShowPassOtpField(true);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setPassError(apiError.response?.data?.message || 'Failed to request password update.');
    } finally {
      setPassLoading(false);
    }
  };

  // Step 2: Verify Password OTP
  const handlePasswordVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);
    setPassLoading(true);

    try {
      const res = await accountService.verifyPasswordUpdate(passOtp);
      setPassSuccess(res.message || "Password updated successfully!");
      setShowPassOtpField(false);
      setPassOtp('');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPass({ old: false, new: false, confirm: false });
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setPassError(apiError.response?.data?.message || 'Invalid OTP.');
    } finally {
      setPassLoading(false);
    }
  };

  // Step 1: Request Email Update (Sends OTP)
  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);

    try {
      const res = await accountService.requestEmailUpdate(newEmail);
      setEmailSuccess(res.message || "OTP sent to new email.");
      setShowEmailOtpField(true);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      setEmailError(apiError.response?.data?.message || 'Failed to request email update.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Step 2: Verify Email OTP
  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);

    try {
      const res = await accountService.verifyEmailUpdate(newEmail, emailOtp);
      setEmailSuccess(res.message || "Email updated successfully!");
      setShowEmailOtpField(false);
      setNewEmail('');
      setEmailOtp('');
      
      // Update local storage so the header updates immediately
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.email = newEmail;
        localStorage.setItem("userData", JSON.stringify(user));
      }
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
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Security Status</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your account is highly secure. Protected via JWT authentication and OTP verifications for sensitive updates.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ===================== PASSWORD FORM ===================== */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <Lock className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            </div>
            
            <div className="p-6">
              {passError && (
                <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start shadow-sm animate-in fade-in">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" /><span>{passError}</span>
                </div>
              )}
              {passSuccess && (
                <div className="mb-6 p-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl flex items-center shadow-sm animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" /><span>{passSuccess}</span>
                </div>
              )}

              {!showPassOtpField ? (
                <form onSubmit={handlePasswordRequest} className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                    <div className="relative group">
                      <input 
                        type={showPass.old ? "text" : "password"} 
                        name="oldPassword" required
                        value={passwords.oldPassword} onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      />
                      <button 
                        type="button" 
                        onClick={() => togglePassVisibility('old')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        {showPass.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                      <div className="relative group">
                        <input 
                          type={showPass.new ? "text" : "password"} 
                          name="newPassword" required minLength={8}
                          value={passwords.newPassword} onChange={handlePasswordChange}
                          placeholder="At least 8 characters"
                          className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                        <button 
                          type="button" 
                          onClick={() => togglePassVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                      <div className="relative group">
                        <input 
                          type={showPass.confirm ? "text" : "password"} 
                          name="confirmPassword" required minLength={8}
                          value={passwords.confirmPassword} onChange={handlePasswordChange}
                          placeholder="Type it again"
                          className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                        <button 
                          type="button" 
                          onClick={() => togglePassVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button type="submit" disabled={passLoading} className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 disabled:opacity-70 flex items-center">
                      {passLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Sending OTP...</> : <>Send Verification OTP <ArrowRight className="w-4 h-4 ml-2" /></>}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordVerify} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 mb-4 leading-relaxed">
                    A verification code has been sent to your registered email address. Please enter it below to confirm your password change.
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">6-Character OTP</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <KeyRound className="h-4 w-4 text-gray-500" />
                      </div>
                      <input 
                        type="text" required maxLength={6}
                        // ALLOW ALPHANUMERIC ONLY (no symbols/spaces) AND UPPERCASE
                        value={passOtp} onChange={(e) => setPassOtp(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                        placeholder="ABC123"
                        className="w-full pl-12 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-[0.5em] font-mono font-bold text-lg" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={() => setShowPassOtpField(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={passLoading} className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 disabled:opacity-70 flex items-center">
                      {passLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Verifying...</> : 'Verify & Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ===================== EMAIL FORM ===================== */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <Mail className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Update Email Address</h2>
            </div>
            
            <div className="p-6">
              {emailError && (
                <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-start shadow-sm animate-in fade-in">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" /><span>{emailError}</span>
                </div>
              )}
              {emailSuccess && (
                <div className="mb-6 p-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl flex items-center shadow-sm animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" /><span>{emailSuccess}</span>
                </div>
              )}

              {!showEmailOtpField ? (
                <form onSubmit={handleEmailRequest} className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Email Address</label>
                    <input 
                      type="email" required
                      value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. new.email@example.com"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="flex justify-end pt-3">
                    <button type="submit" disabled={emailLoading} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-70 flex items-center">
                      {emailLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Sending OTP...</> : <>Send Verification OTP <ArrowRight className="w-4 h-4 ml-2" /></>}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleEmailVerify} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 mb-4 leading-relaxed">
                    A verification code has been sent to <strong>{newEmail}</strong>. <br className="hidden sm:block" />
                    Please enter it below to confirm your new email address.
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">6-Character OTP</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                        <KeyRound className="h-4 w-4 text-gray-500" />
                      </div>
                      <input 
                        type="text" required maxLength={6}
                        // ALLOW ALPHANUMERIC ONLY (no symbols/spaces) AND UPPERCASE
                        value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                        placeholder="ABC123"
                        className="w-full pl-12 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-[0.5em] font-mono font-bold text-lg" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button type="button" onClick={() => setShowEmailOtpField(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
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