package com.foodmenu.data

import androidx.room.TypeConverter
import com.foodmenu.model.MealType
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromMealTypeList(value: List<MealType>): String {
        return gson.toJson(value)
    }

    @TypeConverter
    fun toMealTypeList(value: String): List<MealType> {
        val listType = object : TypeToken<List<MealType>>() {}.type
        return gson.fromJson(value, listType)
    }

    @TypeConverter
    fun fromStringList(value: List<String>): String {
        return gson.toJson(value)
    }

    @TypeConverter
    fun toStringList(value: String): List<String> {
        val listType = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(value, listType)
    }
}