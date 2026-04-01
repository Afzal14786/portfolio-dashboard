import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import { type Blog } from '../types/blog';

const getErrorMessage = (err: unknown, fallbackMsg: string): string => {
  if (err instanceof Error) {
    const apiError = err as Error & {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    };
    return apiError.response?.data?.error || apiError.response?.data?.message || err.message;
  }
  if (typeof err === 'string') return err;
  return fallbackMsg;
};

const parseBlogsData = (responseData: unknown): Blog[] => {
  if (!responseData) return [];
  
  // 1. Direct array response
  if (Array.isArray(responseData)) {
    return responseData as Blog[];
  }
  
  if (typeof responseData === 'object') {
    const obj = responseData as Record<string, unknown>;
    
    if (Array.isArray(obj.data)) {
      return obj.data as Blog[];
    }
    if (Array.isArray(obj.blogs)) {
      return obj.blogs as Blog[];
    }
  }
  
  return [];
};

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getAllBlogs();
      
      const blogsData = parseBlogsData(response.data);
      setBlogs(blogsData);
      
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch blogs');
      setError(msg);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return { blogs, loading, error, refetch: fetchBlogs };
};