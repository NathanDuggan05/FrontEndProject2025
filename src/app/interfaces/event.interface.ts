export interface EventResponse {
  id: string;
  name: string;
  date?: string;
  venue?: {
    name: string;
    city?: string;
    state?: string;
  };
  image?: string;
  url?: string;
  listeners?: number;
}