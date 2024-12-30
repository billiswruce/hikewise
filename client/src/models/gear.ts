export interface GearItemType {
  _id: string;
  name: string;
  quantity: number;
  condition: string;
  categories: string[];
  brand?: string;
  color?: string | "rainbow";
  type: "Clothing" | "Equipment" | "Food";
}

export interface EditingGearItem extends GearItemType {
  _id: string;
}

export interface NewGearItem {
  name: string;
  quantity: number;
  condition: string;
  brand: string;
  color: string;
  categories: string[];
  type: "Clothing" | "Equipment" | "Food" | null;
}

export type GearType = "All" | "Clothing" | "Equipment" | "Food"; 