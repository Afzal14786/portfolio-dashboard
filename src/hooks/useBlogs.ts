import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import { type Blog } from '../types/blog';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getAllBlogs();
      
      // Handle different response structures
      let blogsData: Blog[] = [];
      
      if (response.data && response.data.data) {
        blogsData = response.data.data; // { success: true, data: [...] }
      } else if (Array.isArray(response.data)) {
        blogsData = response.data; // Direct array response
      } else if (response.data && Array.isArray(response.data.blogs)) {
        blogsData = response.data.blogs; // { blogs: [...] }
      }
      
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch blogs');
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