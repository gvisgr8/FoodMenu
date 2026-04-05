package com.foodmenu

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.foodmenu.databinding.ActivityMainBinding
import com.foodmenu.viewmodel.MealViewModel
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val viewModel: MealViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        // Setup toolbar
        setSupportActionBar(binding.toolbar)

        // Setup FAB for adding dishes
        binding.fabAddDish.setOnClickListener {
            showAddDishDialog()
        }

        // Setup bottom navigation
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_meal_plan -> {
                    showFragment(MealPlanFragment())
                    true
                }
                R.id.nav_dishes -> {
                    showFragment(DishesFragment())
                    true
                }
                R.id.nav_settings -> {
                    showFragment(SettingsFragment())
                    true
                }
                else -> false
            }
        }

        // Load the default screen on launch
        binding.bottomNavigation.selectedItemId = R.id.nav_meal_plan
    }

    private fun showFragment(fragment: androidx.fragment.app.Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            viewModel.error.collect { error ->
                error?.let {
                    Toast.makeText(this@MainActivity, it, Toast.LENGTH_LONG).show()
                    viewModel.clearError()
                }
            }
        }

        lifecycleScope.launch {
            viewModel.isLoading.collect { isLoading ->
                // Show/hide loading indicator
                binding.progressBar.visibility = if (isLoading) android.view.View.VISIBLE else android.view.View.GONE
            }
        }
    }

    private fun showAddDishDialog() {
        val dialog = AddDishDialogFragment()
        dialog.show(supportFragmentManager, "AddDishDialog")
    }
}