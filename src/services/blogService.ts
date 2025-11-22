import api from "../api/api";
import { type Blog, type BlogCreateData, type BlogUpdateData } from '../types/blog';

export const blogService = {
  // Create Operations
  createBlog: (data: BlogCreateData) => api.post('/admin/blogs', data),
  createDraft: (data: BlogCreateData) => api.post('/admin/blogs/draft', data),
  autoSaveDraft: (id: string, data: Partial<Blog>) => 
    api.post(`/admin/blogs/${id}/auto-save`, data),

  // Read Operations
  getAllBlogs: () => api.get('/admin/blogs'),
  getBlogsByStatus: (status: string) => api.get(`/admin/blogs/status/${status}`),
  
  // Fixed: Use admin endpoint for blog reading (since you don't want public routes)
  getBlogBySlug: (slug: string) => api.get(`/admin/blogs/read/${slug}`),
  
  // Get published blogs for reading
  getPublishedBlogs: (params?: {
    page?: number;
    limit?: number;
    topic?: string;
    search?: string;
  }) => {
    return api.get('/admin/blogs/read', { params });
  },
  
  getUserBlogs: () => api.get('/admin/blogs'),
  getBlogById: (id: string) => api.get(`/admin/blogs/${id}`),

  // Update Operations
  updateBlog: (id: string, data: Partial<BlogUpdateData>) => 
    api.put(`/admin/blogs/${id}`, data),
  updateBlogStatus: (id: string, status: string) => 
    api.patch(`/admin/blogs/${id}/status`, { status }),

  // Delete Operations
  deleteBlog: (id: string) => api.delete(`/admin/blogs/${id}`),

  // Content Operations
  uploadImage: (formData: FormData) => 
    api.post('/admin/blogs/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};