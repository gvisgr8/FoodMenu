package com.foodmenu

import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.foodmenu.databinding.FragmentDishesBinding
import com.foodmenu.viewmodel.MealViewModel
import kotlinx.coroutines.launch

class DishesFragment : Fragment(R.layout.fragment_dishes) {

    private val viewModel: MealViewModel by activityViewModels()
    private var _binding: FragmentDishesBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentDishesBinding.bind(view)

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.getAllDishes().collect { dishes ->
                    binding.dishesContainer.removeAllViews()
                    if (dishes.isEmpty()) {
                        val message = TextView(requireContext()).apply {
                            text = getString(R.string.no_dishes_saved)
                            textSize = 16f
                        }
                        binding.dishesContainer.addView(message)
                    } else {
                        dishes.forEach { dish ->
                            val textView = TextView(requireContext()).apply {
                                text = "${dish.name}: ${dish.description}"
                                setPadding(0, 12, 0, 12)
                            }
                            binding.dishesContainer.addView(textView)
                        }
                    }
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
