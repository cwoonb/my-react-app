// 뉴스 관련 타입
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
  views: number;
  likes: number;
}

export interface NewsCategory {
  name: string;
  count: number;
  color: string;
}

// 채팅 관련 타입
export interface ChatProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  image: string;
  interests: string[];
}

export interface ChatMessage {
  id: string;
  profileId: string;
  text: string;
  timestamp: string;
  isFromMe: boolean;
}
