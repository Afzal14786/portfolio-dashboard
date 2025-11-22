import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreVertical } from 'lucide-react';

interface Comment {
  _id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  blogId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Here you would call your comment service
    console.log('New comment:', newComment);
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    // Here you would call your comment service
    console.log('Reply to', commentId, ':', replyContent);
    setReplyContent('');
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CommentComponent: React.FC<{ comment: Comment; depth?: number }> = ({ 
    comment, 
    depth = 0 
  }) => (
    <div className={`border-l-2 ${depth > 0 ? 'border-gray-200 pl-4 ml-4' : 'border-transparent'}`}>
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <MoreVertical size={16} />
              </button>
            </div>
            
            <p className="text-gray-700 mb-3">{comment.content}</p>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors cursor-pointer">
                <Heart size={16} />
                <span className="text-sm">{comment.likes}</span>
              </button>
              <button 
                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <MessageCircle size={16} />
                <span className="text-sm">Reply</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors cursor-pointer">
                <Flag size={16} />
                <span className="text-sm">Report</span>
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment._id && (
              <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.map(reply => (
        <CommentComponent 
          key={reply._id} 
          comment={reply} 
          depth={depth + 1}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentComponent key={comment._id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;