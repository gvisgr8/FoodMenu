package com.foodmenu.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.foodmenu.model.DayPlan
import com.foodmenu.model.Dish
import com.foodmenu.model.MealType
import kotlinx.coroutines.flow.Flow

@Dao
interface DishDao {
    @Query("SELECT * FROM dishes")
    fun getAllDishes(): Flow<List<Dish>>

    @Query("SELECT * FROM dishes WHERE id = :id")
    suspend fun getDishById(id: String): Dish?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDish(dish: Dish)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDishes(dishes: List<Dish>)

    @Query("DELETE FROM dishes WHERE id = :id")
    suspend fun deleteDish(id: String)
}

@Dao
interface DayPlanDao {
    @Query("SELECT * FROM day_plans WHERE date = :date")
    suspend fun getDayPlan(date: String): DayPlan?

    @Query("SELECT * FROM day_plans WHERE date >= :startDate AND date <= :endDate")
    fun getDayPlansForMonth(startDate: String, endDate: String): Flow<List<DayPlan>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDayPlan(dayPlan: DayPlan)

    @Query("UPDATE day_plans SET breakfast = :dishId WHERE date = :date")
    suspend fun updateBreakfast(date: String, dishId: String)

    @Query("UPDATE day_plans SET lunch = :dishId WHERE date = :date")
    suspend fun updateLunch(date: String, dishId: String)

    @Query("UPDATE day_plans SET dinner = :dishId WHERE date = :date")
    suspend fun updateDinner(date: String, dishId: String)
}