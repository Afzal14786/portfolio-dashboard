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

// Strict API Response Wrappers
export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
  message?: string;
}

export interface BlogAnalyticsResponse {
  success: boolean;
  trending: TrendingBlog[];
  visitorData: VisitorData[];
  message?: string;
}

export interface BlogsByStatusResponse {
  success: boolean;
  data: BlogStatusMetrics[];
  message?: string;
}