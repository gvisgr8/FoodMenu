package com.foodmenu.network

import com.foodmenu.model.Dish
import com.foodmenu.model.GeminiDishResponse
import com.foodmenu.model.MealType
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.GenerateContentResponse
import com.google.ai.client.generativeai.type.generationConfig
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class GeminiService(private val apiKey: String) {

    private val gson = Gson()

    private val model = GenerativeModel(
        modelName = "gemini-2.5-flash",
        apiKey = apiKey,
        generationConfig = generationConfig {
            temperature = 0.7f
        }
    )

    suspend fun generateDishDetails(dishName: String): Result<Dish> = withContext(Dispatchers.IO) {
        try {
            val prompt = """
                Provide details for the Indian dish: "$dishName". Include if it's vegetarian, its typical meal types (breakfast, lunch, dinner), ingredients, instructions, and a short description. Also provide a keyword for finding a food photo of it.
            """.trimIndent()

            val response = model.generateContent(prompt)
            val responseText = response.text ?: throw Exception("Empty response from Gemini")

            val geminiResponse = gson.fromJson(responseText, GeminiDishResponse::class.java)

            val dish = Dish(
                id = "custom-${System.currentTimeMillis()}",
                name = geminiResponse.name,
                type = geminiResponse.type.map { typeStr ->
                    when (typeStr.lowercase()) {
                        "breakfast" -> MealType.BREAKFAST
                        "lunch" -> MealType.LUNCH
                        "dinner" -> MealType.DINNER
                        else -> MealType.LUNCH // default
                    }
                },
                isVegetarian = geminiResponse.isVegetarian,
                ingredients = geminiResponse.ingredients,
                instructions = geminiResponse.instructions,
                description = geminiResponse.description,
                image = "https://loremflickr.com/400/400/${geminiResponse.photoKeyword.replace(" ", "_")}"
            )

            Result.success(dish)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}