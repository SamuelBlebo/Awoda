require("dotenv").config();

module.exports = {
  expo: {
    name: "Awoda",
    slug: "awoda",
    scheme: "awoda",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FAF7F5",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.awoda.app",
    },
    android: {
      package: "com.awoda.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FAF7F5",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-notifications"],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
};
