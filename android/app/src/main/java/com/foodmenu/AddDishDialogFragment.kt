package com.foodmenu

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.viewModels
import com.foodmenu.databinding.DialogAddDishBinding
import com.foodmenu.viewmodel.MealViewModel
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class AddDishDialogFragment : DialogFragment() {

    private var _binding: DialogAddDishBinding? = null
    private val binding get() = _binding!!
    private val viewModel: MealViewModel by viewModels({ requireActivity() })

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        _binding = DialogAddDishBinding.inflate(layoutInflater)

        return MaterialAlertDialogBuilder(requireContext())
            .setView(binding.root)
            .create()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnCancel.setOnClickListener {
            dismiss()
        }

        binding.btnAdd.setOnClickListener {
            val dishName = binding.etDishName.text.toString().trim()
            if (dishName.isNotEmpty()) {
                addDish(dishName)
            } else {
                Toast.makeText(context, "Please enter a dish name", Toast.LENGTH_SHORT).show()
            }
        }

        binding.etDishName.setOnEditorActionListener { _, _, _ ->
            val dishName = binding.etDishName.text.toString().trim()
            if (dishName.isNotEmpty()) {
                addDish(dishName)
                true
            } else {
                false
            }
        }
    }

    private fun addDish(dishName: String) {
        binding.btnAdd.isEnabled = false
        binding.progressBar.visibility = View.VISIBLE

        viewModel.addDish(dishName,
            onSuccess = { dish ->
                Toast.makeText(context, "Dish '${dish.name}' added successfully!", Toast.LENGTH_SHORT).show()
                dismiss()
            },
            onError = { error ->
                binding.btnAdd.isEnabled = true
                binding.progressBar.visibility = View.GONE
                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
            }
        )
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}