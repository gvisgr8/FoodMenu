export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Dish {
  id: string;
  name: string;
  type: MealType[];
  isVegetarian: boolean;
  ingredients: string[];
  instructions: string[];
  image: string;
  description: string;
}

export interface DayPlan {
  date: string; // ISO string
  breakfast: string; // Dish ID
  lunch: string; // Dish ID
  dinner: string; // Dish ID
  isVegDay: boolean;
}

export interface UserSettings {
  vegDays: number[]; // 0-6 (Sunday-Saturday)
}
