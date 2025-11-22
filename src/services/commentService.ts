import api from '../api/api';

export const commentService = {
  createComment: (blogId: string, content: string) => 
    api.post('/comments', { blog: blogId, content }),
  
  getComments: (blogId: string) => 
    api.get(`/comments/blog/${blogId}`),
  
  updateComment: (commentId: string, content: string) => 
    api.put(`/comments/${commentId}`, { content }),
  
  deleteComment: (commentId: string) => 
    api.delete(`/comments/${commentId}`),
  
  likeComment: (commentId: string) => 
    api.post(`/comments/${commentId}/like`),
  
  reportComment: (commentId: string, reason: string) => 
    api.post(`/comments/${commentId}/report`, { reason }),
  
  getCommentReplies: (commentId: string) => 
    api.get(`/comments/${commentId}/replies`),
};