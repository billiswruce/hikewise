interface FormData {
  name: string;
  length: string;
  difficulty: string;
  description: string;
  latitude: number;
  longitude: number;
  location: string;
  hikeDate: string;
  hikeEndDate: string;
  image: string;
  packingList: {
    gear: string[];
    food: string[];
  };
}

export type { FormData };