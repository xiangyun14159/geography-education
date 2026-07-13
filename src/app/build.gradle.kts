plugins {
    id("com.android.application")
}

android {
    namespace = "com.sunearth.teacher"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.sunearth.teacher"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

}

dependencies {}
