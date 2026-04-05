import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Settings as SettingsIcon, 
  Info, 
  RefreshCw,
  CheckCircle2,
  X,
  UtensilsCrossed,
  Clock,
  Leaf,
  Plus,
  Loader2,
  Search
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { DayPlan, Dish, UserSettings, MealType } from './types';
import { generateMonthlyPlan, getDishById, getAlternativeDishes, getRandomDish } from './lib/mealEngine';
import { DISHES } from './data/dishes';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('desi-meal-settings');
    return saved ? JSON.parse(saved) : { vegDays: [2, 4] };
  });
  const [allDishes, setAllDishes] = useState<Dish[]>(() => {
    const saved = localStorage.getItem('desi-meal-custom-dishes');
    const custom = saved ? JSON.parse(saved) : [];
    return [...DISHES, ...custom];
  });
  const [plan, setPlan] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem('desi-meal-plan');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{ date: string, type: MealType } | null>(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('desi-meal-settings', JSON.stringify(settings));
  }, [settings]);

  // Persist plan
  useEffect(() => {
    if (plan.length > 0) {
      localStorage.setItem('desi-meal-plan', JSON.stringify(plan));
    }
  }, [plan]);

  // Persist custom dishes
  useEffect(() => {
    const custom = allDishes.filter(d => !DISHES.find(base => base.id === d.id));
    localStorage.setItem('desi-meal-custom-dishes', JSON.stringify(custom));
  }, [allDishes]);

  // Sync plan with veg settings
  useEffect(() => {
    setPlan(prev => prev.map(day => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      const shouldBeVeg = settings.vegDays.includes(dayOfWeek);
      
      if (day.isVegDay !== shouldBeVeg) {
        const updatedDay = { ...day, isVegDay: shouldBeVeg };
        
        // If it's now a veg day, ensure all dishes are vegetarian
        if (shouldBeVeg) {
          const b = getDishById(day.breakfast, allDishes);
          const l = getDishById(day.lunch, allDishes);
          const d = getDishById(day.dinner, allDishes);
          
          if (b && !b.isVegetarian) updatedDay.breakfast = getRandomDish('breakfast', true, [], allDishes).id;
          if (l && !l.isVegetarian) updatedDay.lunch = getRandomDish('lunch', true, [], allDishes).id;
          if (d && !d.isVegetarian) updatedDay.dinner = getRandomDish('dinner', true, [], allDishes).id;
        }
        
        return updatedDay;
      }
      return day;
    }));
  }, [settings.vegDays, allDishes]);

  useEffect(() => {
    const savedPlan = localStorage.getItem('desi-meal-plan');
    const parsedPlan: DayPlan[] = savedPlan ? JSON.parse(savedPlan) : [];
    
    const hasMonthPlan = parsedPlan.some(p => {
      const d = new Date(p.date);
      return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
    });

    if (!hasMonthPlan) {
      const newMonthPlan = generateMonthlyPlan(currentDate.getFullYear(), currentDate.getMonth(), settings, allDishes);
      setPlan(prev => {
        const filtered = prev.filter(p => {
          const d = new Date(p.date);
          return d.getFullYear() !== currentDate.getFullYear() || d.getMonth() !== currentDate.getMonth();
        });
        return [...filtered, ...newMonthPlan];
      });
    }
  }, [currentDate, settings, allDishes]);

  const handleAddDish = async () => {
    if (!newDishName.trim()) return;
    setIsAddingDish(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide details for the Indian dish: "${newDishName}". Include if it's vegetarian, its typical meal types (breakfast, lunch, dinner), ingredients, instructions, and a short description. Also provide a keyword for finding a food photo of it.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.ARRAY, items: { type: Type.STRING } },
              isVegetarian: { type: Type.BOOLEAN },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
              photoKeyword: { type: Type.STRING }
            },
            required: ["name", "type", "isVegetarian", "ingredients", "instructions", "description", "photoKeyword"]
          }
        }
      });

      const data = JSON.parse(response.text);
      const newDish: Dish = {
        id: `custom-${Date.now()}`,
        name: data.name,
        type: data.type.map((t: string) => t.toLowerCase()) as MealType[],
        isVegetarian: data.isVegetarian,
        ingredients: data.ingredients,
        instructions: data.instructions,
        description: data.description,
        image: `https://loremflickr.com/400/400/${encodeURIComponent(data.photoKeyword || data.name)}`
      };

      setAllDishes(prev => [...prev, newDish]);
      setNewDishName('');
      setIsAddDishOpen(false);
    } catch (error) {
      console.error("Error adding dish:", error);
      alert("Failed to add dish. Please try again.");
    } finally {
      setIsAddingDish(false);
    }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const updateMeal = (date: string, type: MealType, dishId: string) => {
    setPlan(prev => prev.map(day => {
      if (day.date === date) {
        return { ...day, [type]: dishId };
      }
      return day;
    }));
    setEditingMeal(null);
  };

  const toggleVegDay = (day: number) => {
    setSettings(prev => ({
      ...prev,
      vegDays: prev.vegDays.includes(day) 
        ? prev.vegDays.filter(d => d !== day)
        : [...prev.vegDays, day]
    }));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  
  const currentMonthPlan = plan.filter(p => {
    const d = new Date(p.date);
    return d.getFullYear() === year && d.getMonth() === currentDate.getMonth();
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return currentMonthPlan[dayNum - 1];
    }
    return null;
  });

  return (
    <div className="min-h-screen bg-brand-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-brand-100 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-brand-500 p-2 rounded-xl shadow-lg shadow-brand-200">
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Desi Meal Planner</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddDishOpen(true)}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-md shadow-brand-100 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Dish</span>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-brand-50 rounded-xl transition-colors text-slate-600"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-brand-100">
          <div className="flex items-center gap-4">
            <div className="bg-brand-100 p-2 rounded-lg">
              <CalendarIcon className="text-brand-600 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{monthName} {year}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-brand-50 rounded-xl border border-brand-100 transition-colors"><ChevronLeft /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-brand-50 rounded-xl border border-brand-100 transition-colors"><ChevronRight /></button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="hidden md:block text-center font-bold text-brand-700 py-3 uppercase tracking-wider text-[10px] bg-brand-100/50">
              {day}
            </div>
          ))}
          
          {calendarDays.map((dayPlan, idx) => (
            <div key={idx} className={`calendar-day ${!dayPlan ? 'other-month' : ''}`}>
              {dayPlan && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-black text-slate-300">
                      {new Date(dayPlan.date).getDate()}
                    </span>
                    {dayPlan.isVegDay && (
                      <span className="bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                        <Leaf className="w-2.5 h-2.5" /> VEG
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 flex-grow">
                    <MealItem 
                      type="breakfast" 
                      dishId={dayPlan.breakfast} 
                      allDishes={allDishes}
                      onDetail={() => setSelectedDish(getDishById(dayPlan.breakfast, allDishes)!)}
                      onEdit={() => setEditingMeal({ date: dayPlan.date, type: 'breakfast' })}
                    />
                    <MealItem 
                      type="lunch" 
                      dishId={dayPlan.lunch} 
                      allDishes={allDishes}
                      onDetail={() => setSelectedDish(getDishById(dayPlan.lunch, allDishes)!)}
                      onEdit={() => setEditingMeal({ date: dayPlan.date, type: 'lunch' })}
                    />
                    <MealItem 
                      type="dinner" 
                      dishId={dayPlan.dinner} 
                      allDishes={allDishes}
                      onDetail={() => setSelectedDish(getDishById(dayPlan.dinner, allDishes)!)}
                      onEdit={() => setEditingMeal({ date: dayPlan.date, type: 'dinner' })}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Add Dish Modal */}
      <AnimatePresence>
        {isAddDishOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add New Dish</h3>
                <button onClick={() => setIsAddDishOpen(false)} className="p-2 hover:bg-brand-50 rounded-full transition-colors"><X /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Dish Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="e.g. Paneer Butter Masala"
                      className="w-full bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddDish()}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <button 
                  onClick={handleAddDish}
                  disabled={isAddingDish || !newDishName.trim()}
                  className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isAddingDish ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Details...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Menu
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400">
                  AI will automatically generate ingredients, instructions, and find a photo for your dish.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img 
                  src={selectedDish.image} 
                  alt={selectedDish.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-full text-white transition-colors"
                >
                  <X />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedDish.isVegetarian ? (
                      <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">VEG</span>
                    ) : (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NON-VEG</span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">{selectedDish.name}</h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <p className="text-slate-600 mb-8 italic leading-relaxed">{selectedDish.description}</p>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                      <UtensilsCrossed className="w-5 h-5 text-brand-500" /> Ingredients
                    </h4>
                    <ul className="space-y-3">
                      {selectedDish.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                          <div className="w-2 h-2 bg-brand-300 rounded-full shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-brand-500" /> Instructions
                    </h4>
                    <ol className="space-y-5">
                      {selectedDish.instructions.map((step, i) => (
                        <li key={i} className="flex gap-4 text-slate-600 text-sm leading-relaxed">
                          <span className="font-black text-brand-500 shrink-0 bg-brand-50 w-6 h-6 flex items-center justify-center rounded-lg text-xs">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Planner Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-brand-50 rounded-full transition-colors"><X /></button>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
                  Vegetarian Only Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <button
                      key={i}
                      onClick={() => toggleVegDay(i)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        settings.vegDays.includes(i)
                          ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Selected days will only suggest vegetarian dishes for all meals.
                </p>
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-200"
              >
                Save Preferences
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Meal Modal */}
      <AnimatePresence>
        {editingMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-brand-50 flex justify-between items-center bg-brand-50/50">
                <div>
                  <h3 className="text-xl font-bold capitalize tracking-tight">Change {editingMeal.type}</h3>
                  <p className="text-sm text-slate-500">Select an alternative dish</p>
                </div>
                <button onClick={() => setEditingMeal(null)} className="p-2 hover:bg-white rounded-full transition-colors"><X /></button>
              </div>
              
              <div className="p-4 overflow-y-auto grid grid-cols-1 gap-3">
                {getAlternativeDishes(
                  editingMeal.type, 
                  plan.find(p => p.date === editingMeal.date)?.isVegDay || false,
                  plan.find(p => p.date === editingMeal.date)?.[editingMeal.type] || '',
                  allDishes
                ).map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => updateMeal(editingMeal.date, editingMeal.type, dish.id)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-50 border border-transparent hover:border-brand-200 transition-all text-left group"
                  >
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">{dish.name}</h4>
                        {dish.isVegetarian && <Leaf className="w-3 h-3 text-green-500" />}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{dish.description}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className="text-brand-500" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MealItem({ type, dishId, allDishes, onDetail, onEdit }: { 
  type: MealType, 
  dishId: string, 
  allDishes: Dish[],
  onDetail: () => void,
  onEdit: () => void
}) {
  const dish = getDishById(dishId, allDishes);
  if (!dish) return null;

  return (
    <div className="group relative">
      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-50 transition-colors cursor-pointer" onClick={onDetail}>
        <div className="relative shrink-0">
          <img 
            src={dish.image} 
            alt={dish.name} 
            className="w-10 h-10 rounded-lg object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-1 -left-1 bg-white border border-brand-100 text-[7px] font-black px-1 rounded uppercase text-brand-600 shadow-sm">
            {type[0]}
          </div>
        </div>
        <div className="min-w-0">
          <h5 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
            {dish.name}
          </h5>
        </div>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pr-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 bg-white shadow-md rounded-full text-slate-400 hover:text-brand-500 hover:scale-110 transition-all"
          title="Swap Dish"
        >
          <RefreshCw className="w-2.5 h-2.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDetail(); }}
          className="p-1.5 bg-white shadow-md rounded-full text-slate-400 hover:text-brand-500 hover:scale-110 transition-all"
          title="View Recipe"
        >
          <Info className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}
