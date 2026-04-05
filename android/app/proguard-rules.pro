# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Keep data classes
-keep class com.foodmenu.model.** { *; }

# Keep Room classes
-keep class * extends androidx.room.RoomDatabase { *; }
-keep @androidx.room.Entity class *

# Keep ViewModels
-keep class com.foodmenu.viewmodel.** { *; }

# Keep Activities and Fragments
-keep class com.foodmenu.** extends androidx.appcompat.app.AppCompatActivity { *; }
-keep class com.foodmenu.** extends androidx.fragment.app.Fragment { *; }

# Keep Gson annotations
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepattributes AnnotationDefault

-keepclassmembers,allowshrinking,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep data for tinker patching
-keep class com.tencent.tinker.** { *; }

# Keep all classes in the main package (adjust as needed)
-keep class com.foodmenu.** { *; }