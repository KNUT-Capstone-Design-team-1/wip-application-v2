const BUILD = process.env.BUILD ?? '1';

const ADMOB_ANDROID_APP_ID =
  process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ??
  'ca-app-pub-3940256099942544~3347511713';

const ADMOB_IOS_APP_ID =
  process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ??
  'ca-app-pub-3940256099942544~1458002511';

export default {
  expo: {
    name: '이게뭐약',
    slug: 'whatispill',
    scheme: 'whatispill',
    owner: 'mustbemadness',
    version: '3.1.1',
    orientation: 'portrait',
    icon: './assets/icons/android-adaptive-icon.png',

    newArchEnabled: true,
    platforms: ['ios', 'android'],

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mbm.whatispill',
      buildNumber: BUILD,

      icon: {
        light: './assets/icons/ios-icon-light.png',
        dark: './assets/icons/ios-icon-dark.png',
        tinted: './assets/icons/ios-icon-tinted.png',
      },

      infoPlist: {
        NSCameraUsageDescription:
          '$(PRODUCT_NAME)에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다',

        NSPhotoLibraryUsageDescription:
          '$(PRODUCT_NAME)에서 알약 검색에 필요한 이미지를 가져오기 위해 사진 권한이 필요합니다',

        NSLocationWhenInUseUsageDescription:
          '$(PRODUCT_NAME)에서 주변 약국을 찾기 위해 위치 권한이 필요합니다',

        LSApplicationQueriesSchemes: ['mailto'],

        ITSAppUsesNonExemptEncryption: false,
      },

      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY_IOS,
      },
    },

    android: {
      package: 'com.mbm.whatispill',
      versionCode: Number(BUILD),

      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY_ANDROID,
        },
      },

      splash: {
        image: './assets/icons/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/icons/splash-icon.png',
          backgroundColor: '#ffffff',
        },
      },

      adaptiveIcon: {
        foregroundImage: './assets/icons/android-adaptive-icon.png',

        monochromeImage: './assets/icons/android-adaptive-icon.png',

        backgroundColor: '#ffffff',
      },

      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: 'resize',

      permissions: [
        'android.permission.INTERNET',
        'android.permission.CAMERA',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'com.google.android.gms.permission.AD_ID',
      ],

      blockedPermissions: [
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.READ_MEDIA_VIDEO',
        'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
      ],
    },

    plugins: [
      [
        'expo-splash-screen',
        {
          image: './assets/icons/splash-icon.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            image: './assets/icons/splash-icon.png',
            backgroundColor: '#ffffff',
          },
          imageWidth: 200,
        },
      ],

      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: '36.0.0',

            useLegacyPackaging: true,

            enableProguardInReleaseBuilds: true,

            extraProguardRules:
              '-keep class io.realm.** { *; }\n' +
              '-keep class io.realm.react.** { *; }\n' +
              '-dontwarn java.beans.**\n' +
              '-dontwarn javax.xml.bind.**',

            enableMinifyInReleaseBuilds: true,
          },
        },
      ],

      [
        'react-native-vision-camera',
        {
          cameraPermission:
            '$(PRODUCT_NAME)에서 알약을 촬영하기 위해 카메라 권한이 필요합니다',
          enableMicrophonePermission: false,
        },
      ],

      [
        'expo-font',
        {
          android: {
            fonts: [
              {
                fontFamily: 'Jalnan2',

                fontDefinitions: [
                  {
                    path: './assets/fonts/Jalnan2.otf',
                    weight: 400,
                  },
                ],
              },
              {
                fontFamily: 'Pretendard',
                fontDefinitions: [
                  {
                    path: './assets/fonts/Pretendard-Bold.ttf',
                    weight: 700,
                  },
                  {
                    path: './assets/fonts/Pretendard-SemiBold.ttf',
                    weight: 600,
                  },
                  {
                    path: './assets/fonts/Pretendard-Medium.ttf',
                    weight: 500,
                  },
                  {
                    path: './assets/fonts/Pretendard-Regular.ttf',
                    weight: 400,
                  },
                ],
              },
            ],
          },

          ios: {
            fonts: [
              './assets/fonts/Jalnan2.otf',
              './assets/fonts/Pretendard-Bold.ttf',
              './assets/fonts/Pretendard-SemiBold.ttf',
              './assets/fonts/Pretendard-Medium.ttf',
              './assets/fonts/Pretendard-Regular.ttf',
            ],
          },
        },
      ],

      [
        'expo-image-picker',
        {
          photosPermission:
            '$(PRODUCT_NAME)에서 알약 검색에 필요한 이미지를 가져오기 위해 사진 권한이 필요합니다',

          cameraPermission:
            '$(PRODUCT_NAME)에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다',
          microphonePermission: false,
        },
      ],

      'expo-router',

      [
        'expo-location',
        {
          locationWhenInUsePermission:
            '$(PRODUCT_NAME)에서 주변 약국을 찾기 위해 위치 권한이 필요합니다',
          locationAlwaysAndWhenInUsePermission: false,
          locationAlwaysPermission: false,
        },
      ],

      ['expo-file-system'],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: ADMOB_ANDROID_APP_ID,
          iosAppId: ADMOB_IOS_APP_ID,
        },
      ],
    ],

    extra: {
      eas: {
        projectId: '8120ae66-d8a3-4e4a-885e-a76c3477b881',
      },
    },
  },
};
