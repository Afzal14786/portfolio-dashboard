import { useState } from 'react';
import { blogService } from '../services/blogService';
import { type BlogCreateData, type BlogUpdateData } from '../types/blog';

export const useBlogMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBlog = async (data: BlogCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.createBlog(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create blog');
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
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update blog');
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
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete blog');
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
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update blog status');
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