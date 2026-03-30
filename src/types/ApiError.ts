export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Add this generic wrapper for all successful API calls
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: any;
}