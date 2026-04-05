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
  Leaf
} from 'lucide-react';
import { DayPlan, Dish, UserSettings, MealType } from './types';
import { generateMonthlyPlan, getDishById, getAlternativeDishes } from './lib/mealEngine';
import { DISHES } from './data/dishes';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settings, setSettings] = useState<UserSettings>({ vegDays: [2, 4] }); // Tue, Thu as default veg days
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{ date: string, type: MealType } | null>(null);

  useEffect(() => {
    const newPlan = generateMonthlyPlan(currentDate.getFullYear(), currentDate.getMonth(), settings);
    setPlan(newPlan);
  }, [currentDate, settings]);

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

  // Calendar Grid Logic
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return plan[dayNum - 1];
    }
    return null;
  });

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl">
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Desi Meal Planner</h1>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 hover:bg-orange-50 rounded-full transition-colors"
        >
          <SettingsIcon className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
          <div className="flex items-center gap-4">
            <CalendarIcon className="text-orange-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-800">{monthName} {year}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-orange-50 rounded-lg border border-orange-100"><ChevronLeft /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-orange-50 rounded-lg border border-orange-100"><ChevronRight /></button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="hidden md:block text-center font-semibold text-slate-500 py-2 uppercase tracking-wider text-xs">
              {day}
            </div>
          ))}
          
          {calendarDays.map((dayPlan, idx) => (
            <div key={idx} className={`min-h-[200px] rounded-2xl border transition-all ${
              dayPlan 
                ? 'bg-white border-orange-100 shadow-sm hover:shadow-md' 
                : 'bg-slate-50/50 border-transparent hidden md:block'
            }`}>
              {dayPlan && (
                <div className="p-3 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-lg font-bold text-slate-400">
                      {new Date(dayPlan.date).getDate()}
                    </span>
                    {dayPlan.isVegDay && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> VEG
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 flex-grow">
                    <MealItem 
                      type="breakfast" 
                      dishId={dayPlan.breakfast} 
                      onDetail={() => setSelectedDish(getDishById(dayPlan.breakfast)!)}
                      onEdit={() => setEditingMeal({ date: dayPlan.date, type: 'breakfast' })}
                    />
                    <MealItem 
                      type="lunch" 
                      dishId={dayPlan.lunch} 
                      onDetail={() => setSelectedDish(getDishById(dayPlan.lunch)!)}
                      onEdit={() => setEditingMeal({ date: dayPlan.date, type: 'lunch' })}
                    />
                    <MealItem 
                      type="dinner" 
                      dishId={dayPlan.dinner} 
                      onDetail={() => setSelectedDish(getDishById(dayPlan.dinner)!)}
                      onEdit={() => setEditingMeal({ date: dayPlan.date, type: 'dinner' })}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

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
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-colors"
                >
                  <X />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedDish.isVegetarian ? (
                      <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">VEG</span>
                    ) : (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NON-VEG</span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-white">{selectedDish.name}</h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                <p className="text-slate-600 mb-6 italic">{selectedDish.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-orange-500" /> Ingredients
                    </h4>
                    <ul className="space-y-2">
                      {selectedDish.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600">
                          <div className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" /> Instructions
                    </h4>
                    <ol className="space-y-4">
                      {selectedDish.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3 text-slate-600">
                          <span className="font-bold text-orange-500 shrink-0">{i + 1}.</span>
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
                <button onClick={() => setIsSettingsOpen(false)}><X /></button>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
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
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
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
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
                <div>
                  <h3 className="text-xl font-bold capitalize">Change {editingMeal.type}</h3>
                  <p className="text-sm text-slate-500">Select an alternative dish</p>
                </div>
                <button onClick={() => setEditingMeal(null)} className="p-2 hover:bg-white rounded-full"><X /></button>
              </div>
              
              <div className="p-4 overflow-y-auto grid grid-cols-1 gap-3">
                {getAlternativeDishes(
                  editingMeal.type, 
                  plan.find(p => p.date === editingMeal.date)?.isVegDay || false,
                  plan.find(p => p.date === editingMeal.date)?.[editingMeal.type] || ''
                ).map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => updateMeal(editingMeal.date, editingMeal.type, dish.id)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all text-left group"
                  >
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
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
                      <CheckCircle2 className="text-orange-500" />
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

function MealItem({ type, dishId, onDetail, onEdit }: { 
  type: MealType, 
  dishId: string, 
  onDetail: () => void,
  onEdit: () => void
}) {
  const dish = getDishById(dishId);
  if (!dish) return null;

  return (
    <div className="group relative">
      <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/50 transition-colors cursor-pointer" onClick={onDetail}>
        <div className="relative shrink-0">
          <img 
            src={dish.image} 
            alt={dish.name} 
            className="w-12 h-12 rounded-lg object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-1 -left-1 bg-white border border-orange-100 text-[8px] font-black px-1 rounded uppercase text-orange-500 shadow-sm">
            {type[0]}
          </div>
        </div>
        <div className="min-w-0">
          <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
            {dish.name}
          </h5>
          <p className="text-[10px] text-slate-400 capitalize">{type}</p>
        </div>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 bg-white shadow-md rounded-full text-slate-400 hover:text-orange-500 hover:scale-110 transition-all"
          title="Swap Dish"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDetail(); }}
          className="p-1.5 bg-white shadow-md rounded-full text-slate-400 hover:text-orange-500 hover:scale-110 transition-all"
          title="View Recipe"
        >
          <Info className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
