import type { User } from "./user";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  topic?: string;
  coverImage: string | { url: string; alt?: string; caption?: string; public_id?: string };
  tags: string[];
  status: 'Draft' | 'Published' | 'Scheduled';
  views: number;
  likesCount: number;
  commentsCount: number;
  author: Pick<User, '_id' | 'name' | 'profileImage'> | string; 
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
}

export interface BlogCreateData {
  title: string;
  content: string;
  topic: string;
  tags: string[];
  status: string;
  coverImage?: {
    url: string;
    cloudinaryId: string;
    alt: string;
    caption: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  scheduledFor?: string;
}

export interface BlogUpdateData extends Partial<BlogCreateData> {
  _id: string;
}

export interface DashboardStats {
  overview: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    scheduledBlogs: number;
    totalViews: number;
    totalWords: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalReaders: number;
  };
  trending: Blog[];
}

export interface InteractionRecord {
  _id: string;
  user: string;
  createdAt: string;
}

export interface BlogAnalytics {
  blog: Blog;
  analytics: {
    engagementRate: string;
    totalEngagements: number;
    platformStats: Array<{
      _id: string;
      count: number;
      totalClicks: number;
    }>;
  };
  breakdown: {
    likes: InteractionRecord[];
    comments: InteractionRecord[];
    shares: InteractionRecord[];
  };
}