#!/bin/bash

# Generate a release keystore for Android app signing
# Run this script from the android directory

echo "Generating release keystore..."

keytool -genkey -v -keystore app/release.keystore \
  -alias release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass store_password \
  -keypass key_password \
  -dname "CN=Food Menu, OU=Development, O=FoodMenu, L=City, ST=State, C=US"

echo "Release keystore generated at app/release.keystore"
echo ""
echo "IMPORTANT: Update your build.gradle with the correct passwords and alias!"
echo "Also, backup this keystore file securely - you cannot recover it if lost."