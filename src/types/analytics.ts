import type { Blog } from './blog';

export interface DashboardStats {
  totalBlogs: number;
  totalViews: number;
  totalProjects: number;
  totalSkills: number;
  totalCertificates: number;
  totalComments: number;
  totalLikes: number;
  publishedBlogs: number;
  draftBlogs: number;
}

export interface TrendingBlog {
  _id: string;
  title: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface VisitorData {
  date: string;
  views: number;
  visitors: number;
}

export interface BlogStatusMetrics {
  status: 'Draft' | 'Published';
  count: number;
}


export interface PopulatedUser {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface InteractionRecord {
  _id: string;
  user: PopulatedUser | string;
  createdAt: string;
}

export interface CommentRecord extends InteractionRecord {
  content: string;
}

export interface PlatformStat {
  _id: string;
  count: number;
  totalClicks: number;
}

export interface BlogAnalytics {
  blog: Blog;
  analytics: {
    engagementRate: string;
    totalEngagements: number;
    platformStats: PlatformStat[];
  };
  breakdown: {
    likes: InteractionRecord[];
    comments: CommentRecord[];
    shares: unknown[]; 
  };
}


export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
  message?: string;
}

export interface BlogAnalyticsResponse {
  success: boolean;
  data: BlogAnalytics; 
  message?: string;
}

export interface BlogsByStatusResponse {
  success: boolean;
  data: BlogStatusMetrics[];
  message?: string;
}