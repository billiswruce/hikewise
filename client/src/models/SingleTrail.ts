import { Trail } from "./Trail";

export interface PackingItem {
  _id?: string;
  name: string;
  isChecked: boolean;
}

export interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId?: string;
}

export interface SingleTrailData extends Trail {
  weather: {
    temperature: number;
    description: string;
    icon: string;
  };
  comments: Comment[];
  packingList: {
    gear: PackingItem[];
    food: PackingItem[];
  };
} 