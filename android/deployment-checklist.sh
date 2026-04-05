#!/bin/bash

# Food Menu Android Deployment Checklist
# Run this script to verify your setup before deploying to Play Store

echo "🍽️  Food Menu Android Deployment Checklist"
echo "=========================================="
echo ""

# Check if we're in the android directory
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Please run this script from the android directory"
    echo "   cd FoodMenu/android && ./deployment-checklist.sh"
    exit 1
fi

echo "📁 Project Structure Check:"
echo "---------------------------"

# Check for required files
files=(
    "app/build.gradle"
    "app/src/main/AndroidManifest.xml"
    "app/src/main/java/com/foodmenu/MainActivity.kt"
    "app/proguard-rules.pro"
    "fastlane/Fastfile"
    "fastlane/Appfile"
    "fastlane/metadata/android/en-US/title.txt"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done

echo ""
echo "🔐 Signing Configuration Check:"
echo "-------------------------------"

if [ -f "app/release.keystore" ]; then
    echo "✅ Release keystore found"
else
    echo "❌ Release keystore missing - run ./generate-keystore.sh"
fi

echo ""
echo "🤖 API Configuration Check:"
echo "---------------------------"

if grep -q "AIzaSyCwIZ8NC5MqH0J4IOOOtJk_d2JP2cKQKJ4" "app/src/main/java/com/foodmenu/viewmodel/MealViewModel.kt"; then
    echo "❌ API key not configured - update MealViewModel.kt"
else
    echo "✅ API key appears to be configured"
fi

echo ""
echo "📱 Build Test:"
echo "--------------"

echo "Testing debug build..."
if ./gradlew assembleDebug --quiet; then
    echo "✅ Debug build successful"
else
    echo "❌ Debug build failed"
fi

echo ""
echo "🚀 Next Steps:"
echo "--------------"
echo "1. Configure your Gemini API key in MealViewModel.kt"
echo "2. Generate release keystore: ./generate-keystore.sh"
echo "3. Test release build: ./gradlew assembleRelease"
echo "4. Create Google Play Console account"
echo "5. Set up Google Play API access for fastlane"
echo "6. Run: fastlane internal (for internal testing)"
echo "7. Run: fastlane production (for production release)"
echo ""
echo "📚 Documentation: See README.md for detailed instructions"