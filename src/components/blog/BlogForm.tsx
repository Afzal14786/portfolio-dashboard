import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Tag, Eye, Upload } from "lucide-react";
import { type Blog, type BlogCreateData } from "../../types/blog";
import RichTextEditor from "./RichTextEditor";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { blogService } from "../../services/blogService";

interface BlogFormProps {
  blog?: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
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
  const [error, setError] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const topics = [
    "Technology",
    "Programming",
    "Web Development",
    "Mobile Development",
    "AI & Machine Learning",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "Data Science",
    "Blockchain",
    "UI/UX Design",
    "Career",
  ];

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        topic: blog.topic || "Technology",
        tags: blog.tags || [],
        status: blog.status || "draft",
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        scheduledFor: blog.scheduledFor || undefined,
      });
      if (blog.scheduledFor) {
        setScheduledDate(
          new Date(blog.scheduledFor).toISOString().slice(0, 16)
        );
      }
      if (blog.coverImage?.url) {
        setImagePreview(blog.coverImage.url);
      }
    }
  }, [blog]);

  const handleAddTag = () => {
    if (
      tagInput.trim() &&
      !formData.tags.includes(tagInput.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
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
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // In BlogForm.tsx - Update the handleSubmit function
  // In your BlogForm component, add this validation
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Validate metaTitle length before sending
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      setError('Meta title must be 60 characters or less');
      setLoading(false);
      return;
    }

    // Validate metaDescription length before sending
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      setError('Meta description must be 160 characters or less');
      setLoading(false);
      return;
    }

    let coverImageUrl = imagePreview;

    // Upload cover image if new image selected
    if (coverImage && typeof coverImage !== "string") {
      const formData = new FormData();
      formData.append("image", coverImage);
      
      try {
        const uploadResponse = await blogService.uploadImage(formData);
        coverImageUrl = uploadResponse.data.imageUrl || uploadResponse.data.url;
      } catch (uploadError: any) {
        setError(uploadError.response?.data?.error || "Failed to upload image");
        setLoading(false);
        return;
      }
    }

    // Prepare blog data
    const blogData = {
      title: formData.title,
      content: formData.content,
      topic: formData.topic,
      tags: formData.tags,
      status: formData.status,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      coverImage: coverImageUrl ? {
        url: coverImageUrl,
        alt: formData.title,
        caption: ""
      } : undefined,
      scheduledFor: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
    };

    console.log("Sending blog data:", blogData);

    // Create or update blog
    if (blog) {
      await blogService.updateBlog(blog._id, blogData);
    } else {
      await blogService.createBlog(blogData);
    }

    onSuccess();
  } catch (err: any) {
    console.error("Error details:", err.response?.data);
    const errorMessage = err.response?.data?.error || 
                        err.response?.data?.errors?.[0] || 
                        err.response?.data?.message ||
                        err.message || 
                        "Failed to save blog";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={blog ? "Edit Blog" : "Create New Blog"}
      size="xl"
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="coverImage"
              />
              <label
                htmlFor="coverImage"
                className="cursor-pointer block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-600">
                  Click to upload cover image
                </span>
                <span className="text-gray-400 text-sm block">
                  PNG, JPG, WebP up to 5MB
                </span>
              </label>
            </div>
            {imagePreview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Blog Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter blog title..."
            required
          />
        </div>

        {/* Topic and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Topic *
            </label>
            <select
              id="topic"
              value={formData.topic}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, topic: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Scheduled Date */}
        {formData.status === "scheduled" && (
          <div>
            <label
              htmlFor="scheduledFor"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Schedule For
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="datetime-local"
                id="scheduledFor"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Tag size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            height={400}
          />
        </div>

        {/* SEO Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye size={20} className="mr-2" />
            SEO Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="metaTitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTitle: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Meta title for SEO (recommended: 50-60 characters)"
                maxLength={60}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.metaTitle.length}/60 characters
              </div>
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Meta description for SEO (recommended: 150-160 characters)"
                maxLength={160}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.metaDescription.length}/160 characters
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Save size={16} />}
            <span>{blog ? "Update Blog" : "Create Blog"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BlogForm;
