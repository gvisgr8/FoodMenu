package com.foodmenu

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.foodmenu.databinding.FragmentMealPlanBinding
import com.foodmenu.viewmodel.MealViewModel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class MealPlanFragment : Fragment(R.layout.fragment_meal_plan) {

    private val viewModel: MealViewModel by activityViewModels()
    private var _binding: FragmentMealPlanBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentMealPlanBinding.bind(view)

        binding.mealPlanLoading.visibility = View.VISIBLE

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                val calendar = Calendar.getInstance()
                val dateKey = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(calendar.time)
                binding.mealPlanTitle.text = getString(R.string.today_meal_plan, dateKey)

                val (dayPlan, dishes) = viewModel.getMealPlanForDate(dateKey)
                binding.breakfastTitle.text = getString(R.string.breakfast)
                binding.breakfastContent.text = dishes[com.foodmenu.model.MealType.BREAKFAST]?.let {
                    "${it.name}\n${it.description}"
                } ?: getString(R.string.no_dish_assigned)

                binding.lunchTitle.text = getString(R.string.lunch)
                binding.lunchContent.text = dishes[com.foodmenu.model.MealType.LUNCH]?.let {
                    "${it.name}\n${it.description}"
                } ?: getString(R.string.no_dish_assigned)

                binding.dinnerTitle.text = getString(R.string.dinner)
                binding.dinnerContent.text = dishes[com.foodmenu.model.MealType.DINNER]?.let {
                    "${it.name}\n${it.description}"
                } ?: getString(R.string.no_dish_assigned)
                binding.mealPlanLoading.visibility = View.GONE
            }
        }
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
