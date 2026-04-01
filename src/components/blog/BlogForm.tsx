import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Tag, Eye, Upload, AlertCircle } from "lucide-react";
import { type Blog, type BlogCreateData } from "../../types/blog";
import RichTextEditor from "./RichTextEditor";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { blogService } from "../../services/blogService";
import { toast } from "react-toastify";

interface BlogFormProps {
  blog?: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

interface UploadResponse {
  data?: {
    url?: string;
    cloudinaryId?: string;
    public_id?: string;
    data?: {
      url?: string;
      cloudinaryId?: string;
      public_id?: string;
    };
  };
}

interface ExtendedPayload extends BlogCreateData {
  images?: Array<{ url: string; cloudinaryId: string; alt: string; caption: string; position: number }>;
}

const BlogForm: React.FC<BlogFormProps> = ({ blog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<BlogCreateData>({
    title: "",
    content: "",
    topic: "Technology",
    tags: [],
    status: "draft",
    metaTitle: "",
    metaDescription: "",
  });
  
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const topics = [
    "Technology", "Programming", "Web Development", "Mobile Development",
    "AI & Machine Learning", "DevOps", "Cloud Computing", "Cybersecurity",
    "Data Science", "Blockchain", "UI/UX Design", "Career",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadFullBlogDetails = async () => {
      if (!blog?._id) return;
      
      try {
        setInitialDataLoading(true);
        const response = await blogService.getBlogById(blog._id);
        
        if (!isMounted) return;

        const fullBlog = response.data?.data?.blog || response.data?.data || response.data?.blog || response.data;
        const safeBlog = fullBlog as unknown as { metaTitle?: string; metaDescription?: string; scheduledFor?: string };
        
        setFormData({
          title: fullBlog.title || "",
          content: fullBlog.content || "", 
          topic: fullBlog.topic || "Technology",
          tags: fullBlog.tags || [],
          status: fullBlog.status?.toLowerCase() || "draft",
          metaTitle: safeBlog.metaTitle || "",
          metaDescription: safeBlog.metaDescription || "",
          scheduledFor: safeBlog.scheduledFor || undefined,
        });
        
        if (safeBlog.scheduledFor) {
          setScheduledDate(new Date(safeBlog.scheduledFor).toISOString().slice(0, 16));
        }
        
        if (fullBlog.coverImage) {
          const imgUrl = typeof fullBlog.coverImage === 'string' 
            ? fullBlog.coverImage 
            : (fullBlog.coverImage as { url?: string }).url;
            
          if (imgUrl) setImagePreview(imgUrl);
        }
      } catch (err) {
        console.error("Failed to load full blog details:", err);
        if (isMounted) setError("Failed to load full blog content.");
      } finally {
        if (isMounted) setInitialDataLoading(false);
      }
    };

    if (blog) {
      const safeInitialBlog = blog as unknown as { metaTitle?: string; metaDescription?: string; scheduledFor?: string };
      setFormData(prev => ({
        ...prev,
        title: blog.title || "",
        topic: blog.topic || "Technology",
        tags: blog.tags || [],
        status: blog.status?.toLowerCase() || "draft",
        metaTitle: safeInitialBlog.metaTitle || "",
        metaDescription: safeInitialBlog.metaDescription || "",
        scheduledFor: safeInitialBlog.scheduledFor || undefined,
      }));
      
      loadFullBlogDetails();
    }
    
    return () => { isMounted = false; };
  }, [blog]);

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const extractImagesFromHTML = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const imgTags = Array.from(tempDiv.querySelectorAll("img"));
    
    return imgTags.map((img, index) => {
      const url = img.src;
      const cloudinaryId = url.split('/').pop()?.split('.')[0] || `inline_img_${Date.now()}_${index}`;
      
      return {
        url,
        cloudinaryId,
        alt: img.alt || formData.title,
        caption: "",
        position: index
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.metaTitle && formData.metaTitle.length > 60) {
        setError('Meta title must be 60 characters or less');
        setLoading(false); return;
      }
      if (formData.metaDescription && formData.metaDescription.length > 160) {
        setError('Meta description must be 160 characters or less');
        setLoading(false); return;
      }
      
      if (!formData.content || formData.content.trim() === '<p><br></p>' || formData.content.trim() === '') {
        setError("Blog content is required.");
        setLoading(false); return;
      }

      let coverImageUrl = imagePreview;
      let coverImageCloudinaryId = "";

      if (coverImageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", coverImageFile);
        
        try {
          const uploadResponse = await blogService.uploadImage(imageFormData, blog?._id) as UploadResponse;
          const resData = uploadResponse.data?.data || uploadResponse.data;
          
          coverImageUrl = resData?.url || "";
          coverImageCloudinaryId = resData?.cloudinaryId || resData?.public_id || coverImageUrl.split('/').pop()?.split('.')[0] || "";
          
        } catch (err: unknown) {
          const uploadError = err as ApiErrorResponse;
          setError(uploadError.response?.data?.error || "Failed to upload cover image");
          setLoading(false); return;
        }
      } else if (imagePreview) {
        coverImageCloudinaryId = imagePreview.split('/').pop()?.split('.')[0] || `cover_${Date.now()}`;
      }

      const payload: ExtendedPayload = {
        title: formData.title,
        content: formData.content,
        topic: formData.topic,
        tags: formData.tags,
        status: formData.status,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        scheduledFor: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        images: extractImagesFromHTML(formData.content) 
      };

      if (coverImageUrl && !coverImageUrl.startsWith('data:')) {
          payload.coverImage = {
              url: coverImageUrl,
              alt: formData.title,
              caption: "",
              cloudinaryId: coverImageCloudinaryId
          };
      }

      // 3. Submit
      if (blog) {
        await blogService.updateBlog(blog._id, payload);
        toast.success("Blog updated successfully!");
      } else {
        if (payload.status === 'draft') {
            await blogService.createDraft(payload);
            toast.success("Draft saved successfully!");
        } else {
            await blogService.createBlog(payload);
            toast.success("Blog created successfully!");
        }
      }

      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as ApiErrorResponse;
      setError(apiErr.response?.data?.error || apiErr.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={blog ? "Edit Blog Post" : "Create New Blog Post"}
      size="xl"
    >
      {initialDataLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50">
           <LoadingSpinner size="lg" />
           <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading blog content...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar bg-gray-50">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-center shadow-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">Core Content</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium placeholder:text-gray-400"
                placeholder="e.g., The Future of Web Development"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
              <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="coverImage"
                />
                {imagePreview ? (
                  <div className="relative h-64 w-full">
                    <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-medium">Click to replace image</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <span className="text-gray-700 font-medium">Drop an image here or click to upload</span>
                    <span className="text-gray-400 text-sm mt-1">JPEG, PNG, WebP (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    height={500}
                  />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
             <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">Publishing Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic *</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {formData.status === "scheduled" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20"
                    min={new Date().toISOString().slice(0, 16)}
                    required={formData.status === "scheduled"}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg border border-blue-100">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500 transition-colors"><X size={14} /></button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Type a tag and press Enter"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>
                <button type="button" onClick={handleAddTag} className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 flex items-center">
              <Eye size={20} className="mr-2 text-gray-500" /> SEO Optimization
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20"
                placeholder="Recommended: 50-60 characters"
                maxLength={60}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
              <textarea
                value={formData.metaDescription || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 resize-none"
                placeholder="Summarize the blog post (150-160 characters)"
                maxLength={160}
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 pt-4 pb-2 border-t border-gray-200 flex justify-end space-x-3 mt-8 z-10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-gray-700 font-semibold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Save size={18} />}
              <span>{blog ? "Save Changes" : "Publish Post"}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default BlogForm;