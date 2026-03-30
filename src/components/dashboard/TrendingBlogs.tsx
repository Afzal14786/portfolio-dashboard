import type { TrendingBlog } from '../../types/analytics';
import { Eye, Heart, MessageSquare } from 'lucide-react';

interface TrendingBlogsProps {
  blogs: TrendingBlog[];
}

export default function TrendingBlogs({ blogs }: TrendingBlogsProps) {
  if (blogs.length === 0) {
    return <div className="p-8 text-center text-gray-500">Not enough data to show trending blogs yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
            <th className="p-4 pl-6">Blog Title</th>
            <th className="p-4 text-center">Views</th>
            <th className="p-4 text-center">Likes</th>
            <th className="p-4 text-center pr-6">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {blogs.map((blog) => (
            <tr key={blog._id} className="hover:bg-gray-50 transition-colors group">
              <td className="p-4 pl-6">
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{blog.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</p>
              </td>
              <td className="p-4 text-center">
                <div className="flex items-center justify-center text-gray-700 font-medium">
                  <Eye className="w-4 h-4 mr-1.5 text-gray-400" /> {blog.views}
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex items-center justify-center text-gray-700 font-medium">
                  <Heart className="w-4 h-4 mr-1.5 text-red-400" /> {blog.likesCount}
                </div>
              </td>
              <td className="p-4 text-center pr-6">
                <div className="flex items-center justify-center text-gray-700 font-medium">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-blue-400" /> {blog.commentsCount}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}