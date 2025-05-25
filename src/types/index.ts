export interface VGProduct {
  title: string;
  price: number;
  availability: boolean;
  productUrl: string;
  imageUrl?: string;
  description?: string;
  seller?: string;
}

export interface VGRankingData {
  site: string;
  siteUrl: string;
  productCount: number;
  products: VGProduct[];
  lastUpdated: Date;
}

export interface SearchFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: boolean;
  sites?: string[];
  sortBy?: 'price' | 'title' | 'site' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  results: TavilySearchResult[];
  query: string;
  response_time: number;
}