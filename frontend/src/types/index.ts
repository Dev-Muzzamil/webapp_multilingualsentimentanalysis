export interface SentimentResult {
  text: string;
  language: string;
  translation?: string;
  sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
    method?: string;
  };
  timestamp: string;
  processingTime?: number;
  id?: string;
  warning?: string;
}

export interface DataSource {
  type: string;
  name: string;
  description: string;
  requiredParams: string[];
  optionalParams: string[];
  realTimeSupported: boolean;
}

export interface TimelineData {
  time: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  averageScore: number;
}

export interface AnalyticsData {
  totalResults: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  languageDistribution: Record<string, number>;
  sourceDistribution: Record<string, number>;
  averageScore: number;
  timeline: TimelineData[];
  timeRange: string;
  startDate: string;
  endDate: string;
}

export interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  publishedAt: string;
  likeCount: number;
}

export interface YouTubeData {
  source: string;
  sourceId: string;
  videoInfo: {
    id: string;
    title: string;
    description: string;
    channelTitle?: string;
    publishedAt?: string;
    viewCount?: string;
  };
  comments: YouTubeComment[];
  timestamp: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface RealTimeAnalysis {
  source: string;
  sourceId: string;
  results: SentimentResult[];
  timestamp: string;
}

export interface DashboardData {
  overview: {
    totalToday: number;
    totalLastHour: number;
    averageScoreToday: number;
    averageScoreLastHour: number;
  };
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  languageDistribution: Record<string, number>;
  sourceDistribution: Record<string, number>;
  timeline: TimelineData[];
  recentResults: SentimentResult[];
  hourlyTrend: TimelineData[];
}