export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}