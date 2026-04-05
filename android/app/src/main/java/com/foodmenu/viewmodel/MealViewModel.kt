package com.foodmenu.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.foodmenu.data.AppDatabase
import com.foodmenu.model.DayPlan
import com.foodmenu.model.Dish
import com.foodmenu.model.MealType
import com.foodmenu.model.UserSettings
import com.foodmenu.network.GeminiService
import com.foodmenu.repository.MealRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class MealViewModel(application: Application) : AndroidViewModel(application) {

    private val database = AppDatabase.getDatabase(application)
    private val geminiService = GeminiService("AIzaSyCwIZ8NC5MqH0J4IOOOtJk_d2JP2cKQKJ4") // Replace with your API key
    private val repository = MealRepository(
        database.dishDao(),
        database.dayPlanDao(),
        geminiService
    )

    private val _currentDate = MutableStateFlow(java.util.Calendar.getInstance())
    val currentDate: StateFlow<java.util.Calendar> = _currentDate

    private val _settings = MutableStateFlow(UserSettings())
    val settings: StateFlow<UserSettings> = _settings

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadSettings()
        initializeDefaultDishes()
    }

    private fun loadSettings() {
        // Load settings from SharedPreferences
        val sharedPrefs = getApplication<Application>().getSharedPreferences("foodmenu_prefs", Application.MODE_PRIVATE)
        val vegDays = sharedPrefs.getStringSet("veg_days", setOf("2", "4"))?.map { it.toInt() } ?: listOf(2, 4)
        _settings.value = UserSettings(vegDays = vegDays)
    }

    private fun saveSettings(settings: UserSettings) {
        val sharedPrefs = getApplication<Application>().getSharedPreferences("foodmenu_prefs", Application.MODE_PRIVATE)
        sharedPrefs.edit()
            .putStringSet("veg_days", settings.vegDays.map { it.toString() }.toSet())
            .apply()
        _settings.value = settings
    }

    private fun initializeDefaultDishes() {
        viewModelScope.launch {
            // Add some default dishes if none exist
            val existingDishes = repository.getAllDishes().first()
            if (existingDishes.isEmpty()) {
                val defaultDishes = listOf(
                    Dish(
                        id = "default-1",
                        name = "Aloo Paratha",
                        type = listOf(MealType.BREAKFAST),
                        isVegetarian = true,
                        ingredients = listOf("Potatoes", "Flour", "Oil", "Spices"),
                        instructions = listOf("Boil potatoes", "Make dough", "Stuff potatoes", "Cook on griddle"),
                        image = "https://loremflickr.com/400/400/aloo_paratha",
                        description = "Stuffed potato flatbread, perfect for breakfast"
                    ),
                    Dish(
                        id = "default-2",
                        name = "Chicken Biryani",
                        type = listOf(MealType.LUNCH, MealType.DINNER),
                        isVegetarian = false,
                        ingredients = listOf("Chicken", "Rice", "Spices", "Onions", "Yogurt"),
                        instructions = listOf("Marinate chicken", "Cook rice", "Layer and cook", "Serve hot"),
                        image = "https://loremflickr.com/400/400/chicken_biryani",
                        description = "Fragrant rice dish with spiced chicken"
                    ),
                    Dish(
                        id = "default-3",
                        name = "Paneer Butter Masala",
                        type = listOf(MealType.LUNCH, MealType.DINNER),
                        isVegetarian = true,
                        ingredients = listOf("Paneer", "Tomatoes", "Cream", "Butter", "Spices"),
                        instructions = listOf("Make tomato base", "Add paneer", "Finish with cream", "Serve with naan"),
                        image = "https://loremflickr.com/400/400/paneer_butter_masala",
                        description = "Creamy paneer curry with rich flavors"
                    )
                )
                repository.addDish(defaultDishes[0])
                repository.addDish(defaultDishes[1])
                repository.addDish(defaultDishes[2])
            }
        }
    }

    fun updateCurrentDate(calendar: java.util.Calendar) {
        _currentDate.value = calendar
    }

    fun updateSettings(settings: UserSettings) {
        saveSettings(settings)
    }

    fun addDish(dishName: String, onSuccess: (Dish) -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null

            repository.generateAndAddDish(dishName).fold(
                onSuccess = { dish ->
                    _isLoading.value = false
                    onSuccess(dish)
                },
                onFailure = { exception ->
                    _isLoading.value = false
                    val errorMessage = exception.message ?: "Failed to add dish"
                    _error.value = errorMessage
                    onError(errorMessage)
                }
            )
        }
    }

    suspend fun getMealPlanForDate(date: String): Pair<DayPlan, Map<MealType, Dish?>> {
        return repository.getMealPlanWithDishes(date)
    }

    fun updateMeal(date: String, mealType: MealType, dishId: String) {
        viewModelScope.launch {
            repository.updateMeal(date, mealType, dishId)
        }
    }

    fun getAllDishes() = repository.getAllDishes()

    fun clearError() {
        _error.value = null
    }
}