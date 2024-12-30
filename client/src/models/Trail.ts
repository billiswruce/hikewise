export interface Trail {
  _id: string;
  name: string;
  length: number;
  difficulty: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  hikeDate: string;
  hikeEndDate: string;
  image?: string;
  creatorId: string;
} 

