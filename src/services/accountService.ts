import api from '../api/api';

export interface StandardResponse {
  success: boolean;
  message: string;
}

export interface EmailUpdateResponse extends StandardResponse {
  ttl?: number;
  email?: string;
}

export const accountService = {
  updatePassword: async (data: Record<string, string>): Promise<StandardResponse> => {
    const response = await api.put<StandardResponse>('/admin/password/update', {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword
    });
    return response.data;
  },

  requestEmailUpdate: async (newEmail: string): Promise<EmailUpdateResponse> => {
    const response = await api.post<EmailUpdateResponse>('/admin/email/update-request', {
      newEmail
    });
    return response.data;
  },

  verifyEmailUpdate: async (newEmail: string, otp: string): Promise<StandardResponse> => {
    const response = await api.post<StandardResponse>('/admin/email/verify-update', {
      newEmail,
      otp
    });
    return response.data;
  }
};