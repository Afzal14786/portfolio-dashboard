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
  getBlogBySlug: (slug: string) => api.get(`/admin/blogs/read/${slug}`),
  getPublishedBlogs: (params?: { page?: number; limit?: number; topic?: string; search?: string; }) => {
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
  deleteBlog: (id: string, hardDelete: boolean = false) => 
    api.delete(`/admin/blogs/${id}`, { data: { hardDelete } }),

  // Content Operations
  // FIX: Provide a fallback URL if no blog ID is present (for cover images before saving)
  uploadImage: (formData: FormData, blogId?: string) => {
    const url = blogId ? `/admin/blogs/${blogId}/images` : '/admin/blogs/upload-image';
    return api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};