import { useState } from 'react';
import { blogService } from '../services/blogService';
import { type BlogCreateData, type BlogUpdateData } from '../types/blog';

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
  
  if (typeof err === 'string') {
    return err;
  }
  
  return fallbackMsg;
};

export const useBlogMutations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBlog = async (data: BlogCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.createBlog(data);
      return response.data;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to create blog');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: string, data: Partial<BlogUpdateData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.updateBlog(id, data);
      return response.data;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update blog');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.deleteBlog(id);
      return response.data;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to delete blog');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.updateBlogStatus(id, status);
      return response.data;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update blog status');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    updateBlogStatus,
  };
};