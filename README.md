# Food Menu - AI-Powered Meal Planner

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

An intelligent meal planning application powered by Google Gemini AI. Plan your meals, discover new dishes, and enjoy healthy eating with AI assistance.

## 🚀 Platforms

- **🌐 Web App**: React + TypeScript + Vite
- **📱 Android App**: Kotlin + Material Design 3
- **☁️ AI Studio**: Cloud deployment ready

## ✨ Features

- **AI-Powered Dish Discovery**: Add any dish by name and let AI generate complete recipes with ingredients and instructions
- **Smart Meal Planning**: Plan your entire week with an intuitive calendar interface
- **Vegetarian Day Configuration**: Set specific days for vegetarian meals
- **Offline Functionality**: Plan meals anywhere without internet
- **Beautiful UI**: Clean Material Design with responsive layouts
- **Local Data Storage**: Privacy-focused with all data stored locally

## 🛠️ Tech Stack

### Web App
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **AI**: Google Gemini API
- **Deployment**: AI Studio / Vercel / Netlify

### Android App
- **Language**: Kotlin
- **Architecture**: MVVM with Repository pattern
- **Database**: Room (SQLite)
- **UI**: Material Design 3, View Binding
- **AI**: Google GenAI SDK
- **Build**: Gradle with Kotlin DSL

## 🚀 Quick Start

### Web App

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Configure API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run development server
npm run dev

# Build for production
npm run build
```

### Android App

**Prerequisites:** Android Studio / JDK 17+

```bash
cd android

# Configure API key in MealViewModel.kt
# Generate release keystore
./generate-keystore.sh

# Build debug APK
./gradlew assembleDebug

# Install on device
./gradlew installDebug
```

## 📱 Google Play Store Deployment

### Automated Deployment (Recommended)

1. **Setup Google Play API Access**
   - Create service account in Google Cloud Console
   - Download JSON key file → `android/fastlane/google-play-service-account.json`

2. **Configure Secrets**
   ```bash
   # GitHub Secrets (for CI/CD)
   STORE_PASSWORD=your_keystore_password
   KEY_PASSWORD=your_key_password
   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=your_service_account_json
   ```

3. **Deploy**
   ```bash
   # Internal testing
   cd android && fastlane internal

   # Beta testing
   fastlane beta_deploy

   # Production
   fastlane production
   ```

### Manual Deployment

1. **Generate Signed APK/AAB**
   ```bash
   cd android
   ./gradlew bundleRelease  # For AAB (recommended)
   # or
   ./gradlew assembleRelease  # For APK
   ```

2. **Upload to Play Console**
   - Go to [Google Play Console](https://play.google.com/console/)
   - Create new app → Upload bundle → Configure store listing → Publish

See `android/README.md` for detailed deployment instructions.

## 🔧 Configuration

### API Key Setup

**Web App:**
```bash
# .env file
GEMINI_API_KEY=your_gemini_api_key_here
```

**Android App:**
```kotlin
// MealViewModel.kt
private val geminiService = GeminiService("your_gemini_api_key_here")
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Environment Variables

- `GEMINI_API_KEY`: Required for AI dish generation
- `STORE_PASSWORD`: Android keystore password (for Play Store deployment)
- `KEY_PASSWORD`: Android key password (for Play Store deployment)

## 📁 Project Structure

```
FoodMenu/
├── src/                    # Web app source
│   ├── components/         # React components
│   ├── lib/               # Utilities and API calls
│   ├── data/              # Static data
│   └── types.ts           # TypeScript definitions
├── android/               # Android app
│   ├── app/src/main/java/com/foodmenu/
│   │   ├── data/          # Room database
│   │   ├── model/         # Data models
│   │   ├── network/       # API services
│   │   ├── repository/    # Data repositories
│   │   └── viewmodel/     # ViewModels
│   └── fastlane/          # Play Store deployment
├── .github/workflows/     # CI/CD pipelines
├── package.json           # Web app dependencies
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent dish generation
- **Material Design** for beautiful UI components
- **React & Kotlin** communities for excellent frameworks

---

**View your app in AI Studio:** https://ai.studio/apps/ec4668b2-2ed3-4b43-9ebe-8889330c0349
