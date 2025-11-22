export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  coverImage?: {  // Make optional
    url: string;
    cloudinaryId: string;
    alt: string;
    caption: string;
  };
  images: Array<{
    cloudinaryId: string;
    url: string;
    alt: string;
    caption: string;
    position: number;
    uploadedAt: string;
  }>;
  codeBlocks: Array<{
    id: string;
    language: string;
    code: string;
    lineCount: number;
    showLineNumbers: boolean;
    position: number;
    createdAt: string;
  }>;
  readTime: string;
  wordCount: number;
  topic: string;
  tags: string[];
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishedAt: string | null;
  scheduledFor: string | null;
  views?: number;  // Make optional
  likes: string[];
  likesCount?: number;  // Make optional
  commentsCount?: number;  // Make optional
  shares?: number;  // Make optional
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  version: number;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
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
    likes: any[];
    comments: any[];
    shares: any[];
  };
}