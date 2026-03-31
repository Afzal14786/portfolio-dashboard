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

  requestEmailUpdate: async (newEmail: string): Promise<EmailUpdateResponse> => {
    const response = await api.post<EmailUpdateResponse>('/admin/email/request-update', { newEmail });
    return response.data;
  },

  verifyEmailUpdate: async (newEmail: string, otp: string): Promise<StandardResponse> => {
    const response = await api.post<StandardResponse>('/admin/email/verify-otp', { newEmail, otp });
    return response.data;
  },

  verifyPasswordUpdate: async (otp: string): Promise<StandardResponse> => {
    const response = await api.post<StandardResponse>('/admin/password/update/verify-otp', { otp });
    return response.data;
  },

  requestPasswordUpdate: async (data: { oldPassword?: string; newPassword?: string }): Promise<StandardResponse> => {
    const response = await api.post<StandardResponse>('/admin/password/update', data);
    return response.data;
  },
};