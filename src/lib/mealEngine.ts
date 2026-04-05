import { Dish, DayPlan, UserSettings, MealType } from '../types';
import { DISHES } from '../data/dishes';

/**
 * Generates a meal plan for a given month, ensuring no repeats for 14 days
 * and respecting vegetarian day settings.
 */
export function generateMonthlyPlan(year: number, month: number, settings: UserSettings, allDishes: Dish[] = DISHES): DayPlan[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const plan: DayPlan[] = [];
  
  // Track last 14 days of dishes to avoid repeats
  const recentDishes: Record<MealType, string[]> = {
    breakfast: [],
    lunch: [],
    dinner: []
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isVegDay = settings.vegDays.includes(dayOfWeek);

    const breakfast = getRandomDish('breakfast', isVegDay, recentDishes.breakfast, allDishes);
    const lunch = getRandomDish('lunch', isVegDay, recentDishes.lunch, allDishes);
    const dinner = getRandomDish('dinner', isVegDay, recentDishes.dinner, allDishes);

    // Update recent dishes (keep last 14)
    updateRecent(recentDishes.breakfast, breakfast.id);
    updateRecent(recentDishes.lunch, lunch.id);
    updateRecent(recentDishes.dinner, dinner.id);

    plan.push({
      date: date.toISOString().split('T')[0],
      breakfast: breakfast.id,
      lunch: lunch.id,
      dinner: dinner.id,
      isVegDay
    });
  }

  return plan;
}

export function getRandomDish(type: MealType, mustBeVeg: boolean, recentIds: string[], allDishes: Dish[] = DISHES): Dish {
  let available = allDishes.filter(d => d.type.includes(type));
  
  if (mustBeVeg) {
    available = available.filter(d => d.isVegetarian);
  }

  // Filter out recent repeats if possible
  let nonRepeated = available.filter(d => !recentIds.includes(d.id));
  
  // If we run out of non-repeated dishes (unlikely with a large enough DB), 
  // fallback to any available
  const source = nonRepeated.length > 0 ? nonRepeated : available;
  
  return source[Math.floor(Math.random() * source.length)];
}

function updateRecent(list: string[], id: string) {
  list.push(id);
  if (list.length > 14) {
    list.shift();
  }
}

export function getDishById(id: string, allDishes: Dish[] = DISHES): Dish | undefined {
  return allDishes.find(d => d.id === id);
}

export function getAlternativeDishes(type: MealType, mustBeVeg: boolean, currentId: string, allDishes: Dish[] = DISHES): Dish[] {
  return allDishes.filter(d => 
    d.type.includes(type) && 
    (!mustBeVeg || d.isVegetarian) && 
    d.id !== currentId
  );
}
