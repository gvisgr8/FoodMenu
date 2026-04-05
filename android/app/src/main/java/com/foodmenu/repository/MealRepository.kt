package com.foodmenu.repository

import com.foodmenu.data.DayPlanDao
import com.foodmenu.data.DishDao
import com.foodmenu.model.DayPlan
import com.foodmenu.model.Dish
import com.foodmenu.model.MealType
import com.foodmenu.model.UserSettings
import com.foodmenu.network.GeminiService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

class MealRepository(
    private val dishDao: DishDao,
    private val dayPlanDao: DayPlanDao,
    private val geminiService: GeminiService
) {

    // Dish operations
    fun getAllDishes(): Flow<List<Dish>> = dishDao.getAllDishes()

    suspend fun getDishById(id: String): Dish? = dishDao.getDishById(id)

    suspend fun addDish(dish: Dish) {
        dishDao.insertDish(dish)
    }

    suspend fun generateAndAddDish(dishName: String): Result<Dish> {
        return geminiService.generateDishDetails(dishName).onSuccess { dish ->
            addDish(dish)
        }
    }

    // Day plan operations
    suspend fun getDayPlan(date: String): DayPlan {
        return dayPlanDao.getDayPlan(date) ?: DayPlan(date = date)
    }

    fun getDayPlansForMonth(startDate: String, endDate: String): Flow<List<DayPlan>> {
        return dayPlanDao.getDayPlansForMonth(startDate, endDate)
    }

    suspend fun updateMeal(date: String, mealType: MealType, dishId: String) {
        when (mealType) {
            MealType.BREAKFAST -> dayPlanDao.updateBreakfast(date, dishId)
            MealType.LUNCH -> dayPlanDao.updateLunch(date, dishId)
            MealType.DINNER -> dayPlanDao.updateDinner(date, dishId)
        }
    }

    suspend fun saveDayPlan(dayPlan: DayPlan) {
        dayPlanDao.insertDayPlan(dayPlan)
    }

    // Settings operations (using SharedPreferences in ViewModel)
    suspend fun getMealPlanWithDishes(date: String): Pair<DayPlan, Map<MealType, Dish?>> {
        val dayPlan = getDayPlan(date)
        val dishes = mutableMapOf<MealType, Dish?>()

        dishes[MealType.BREAKFAST] = dayPlan.breakfast.takeIf { it.isNotEmpty() }?.let { getDishById(it) }
        dishes[MealType.LUNCH] = dayPlan.lunch.takeIf { it.isNotEmpty() }?.let { getDishById(it) }
        dishes[MealType.DINNER] = dayPlan.dinner.takeIf { it.isNotEmpty() }?.let { getDishById(it) }

        return Pair(dayPlan, dishes)
    }
}