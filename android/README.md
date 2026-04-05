# Food Menu Android App

A native Android application for planning meals and managing dishes, powered by Google Gemini AI.

## Features

- **Meal Planning**: Plan your meals for the week with a calendar view
- **Dish Management**: Add custom dishes with AI-generated details
- **Vegetarian Days**: Configure which days are vegetarian
- **AI-Powered**: Uses Google Gemini to generate dish details, ingredients, and instructions

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FoodMenu/android
   ```

2. **Configure API Key**
   - Open `app/src/main/java/com/foodmenu/viewmodel/MealViewModel.kt`
   - Replace `"KJ4"` with your actual Gemini API key
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Build and Run**
   ```bash
   ./gradlew build
   ./gradlew installDebug
   ```

## 🚀 Google Play Store Deployment

### Prerequisites

1. **Google Play Console Account**
   - Create a developer account at [Google Play Console](https://play.google.com/console/)
   - Pay the one-time $25 registration fee

2. **App Signing**
   - Generate a release keystore (see below)
   - Or use Google Play App Signing (recommended)

### Step 1: Generate Release Keystore

```bash
# Run the keystore generation script
./generate-keystore.sh

# Or manually create keystore
keytool -genkey -v -keystore app/release.keystore \
  -alias release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=Your Name, OU=Development, O=Your Company, L=City, ST=State, C=Country"
```

### Step 2: Configure Signing in build.gradle

Update `app/build.gradle` with your keystore information:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'release-key'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
}
```

### Step 3: Build Release APK

```bash
# Build release APK
./gradlew assembleRelease

# Or build AAB (Android App Bundle - recommended)
./gradlew bundleRelease
```

### Step 4: Create Google Play Store Listing

1. **Go to Google Play Console**
2. **Create a new app**
   - App name: "Food Menu"
   - Default language: English
   - App type: App
   - Free or Paid: Free

3. **Fill out store listing** (use the metadata in `fastlane/metadata/android/en-US/`):
   - **Title**: Food Menu - AI-Powered Meal Planner
   - **Short description**: AI-powered meal planner with smart dish discovery
   - **Full description**: [Use the content from full_description.txt]
   - **Screenshots**: Add screenshots of your app (required)
   - **Icon**: Use the launcher icon
   - **Feature Graphic**: Create a 1024x500 banner

4. **Content rating**: Rate your app (should be Everyone or Teen)

5. **Pricing & distribution**: Set as Free app

### Step 5: Upload and Publish

#### Option A: Manual Upload
1. **Upload APK/AAB** in the "Production" track
2. **Add release notes** (use content from changelogs/1.txt)
3. **Review and publish**

#### Option B: Automated with Fastlane (Recommended)

1. **Install Fastlane**
   ```bash
   # Install Ruby (if not installed)
   # Then install fastlane
   gem install fastlane
   ```

2. **Setup Google Play API Access**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a service account with Play Store access
   - Download the JSON key file
   - Place it at `fastlane/google-play-service-account.json`

3. **Deploy to Internal Testing**
   ```bash
   fastlane internal
   ```

4. **Deploy to Beta**
   ```bash
   fastlane beta_deploy
   ```

5. **Deploy to Production**
   ```bash
   fastlane production
   ```

### Step 6: App Store Optimization (ASO)

1. **Keywords**: meal planner, food planning, recipe generator, AI cooking, healthy eating
2. **Category**: Food & Drink
3. **Screenshots**: Take high-quality screenshots showing:
   - Main meal planning interface
   - Add dish dialog with AI generation
   - Settings screen
   - Sample meal plans

### Required Assets for Play Store

- **App Icon**: 512x512 PNG (already created)
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: 2-8 screenshots (phone: 1080x1920, tablet: 1200x1920)
- **Promo Video**: Optional, 30 seconds max

### Environment Variables for CI/CD

Set these in your CI/CD environment:

```bash
# Keystore passwords
STORE_PASSWORD=your_store_password
KEY_ALIAS=release-key
KEY_PASSWORD=your_key_password

# Google Play API (for fastlane)
GOOGLE_PLAY_JSON_KEY=fastlane/google-play-service-account.json
```

## Architecture

- **MVVM Pattern**: Model-View-ViewModel architecture
- **Room Database**: Local data persistence
- **Kotlin Coroutines**: Asynchronous operations
- **Google Gemini AI**: AI-powered dish generation
- **Material Design 3**: Modern UI components

## Project Structure

```
app/src/main/java/com/foodmenu/
├── data/           # Database and DAOs
├── model/          # Data models
├── network/        # API services
├── repository/     # Data repositories
├── viewmodel/      # ViewModels
└── MainActivity.kt # Main activity
```

## Dependencies

- AndroidX Libraries
- Google AI Client (Gemini)
- Room (Database)
- Kotlin Coroutines
- Material Components
- Glide (Image loading)

## Permissions

- `INTERNET`: For API calls to Google Gemini
- `ACCESS_NETWORK_STATE`: For network state checking