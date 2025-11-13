export interface ApiError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>; // Optional validation errors
}


