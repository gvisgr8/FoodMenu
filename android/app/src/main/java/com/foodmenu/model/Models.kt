package com.foodmenu.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

enum class MealType {
    BREAKFAST, LUNCH, DINNER
}

@Entity(tableName = "dishes")
data class Dish(
    @PrimaryKey val id: String,
    val name: String,
    val type: List<MealType>,
    val isVegetarian: Boolean,
    val ingredients: List<String>,
    val instructions: List<String>,
    val image: String,
    val description: String
)

@Entity(tableName = "day_plans")
data class DayPlan(
    @PrimaryKey val date: String, // ISO string
    val breakfast: String = "", // Dish ID
    val lunch: String = "", // Dish ID
    val dinner: String = "", // Dish ID
    val isVegDay: Boolean = false
)

data class UserSettings(
    val vegDays: List<Int> = listOf(2, 4) // 0-6 (Sunday-Saturday)
)

data class GeminiDishResponse(
    @SerializedName("name") val name: String,
    @SerializedName("type") val type: List<String>,
    @SerializedName("isVegetarian") val isVegetarian: Boolean,
    @SerializedName("ingredients") val ingredients: List<String>,
    @SerializedName("instructions") val instructions: List<String>,
    @SerializedName("description") val description: String,
    @SerializedName("photoKeyword") val photoKeyword: String
)