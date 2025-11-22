import api from '../api/api';

export const likeService = {
  toggleLike: (targetId: string, targetType: 'blog' | 'comment') => 
    api.post('/likes/toggle', { target: targetId, targetType }),
  
  getLikes: (targetId: string, targetType: 'blog' | 'comment') => 
    api.get(`/likes/${targetType}/${targetId}`),
  
  getUserLikes: (userId: string) => 
    api.get(`/likes/user/${userId}`),
};