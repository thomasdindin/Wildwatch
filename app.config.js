export default {
  expo: {
    name: "wildwatch",
    slug: "wildwatch",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.anonymous.wildwatch"
    },
    web: {
      bundler: "metro",
      output: "static"
    },
    plugins: [
      "expo-router",
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};