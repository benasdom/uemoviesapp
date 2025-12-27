import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import { useFonts } from 'expo-font'; // Base hook
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "./globals.css";

// Import all your font variations

// 1. Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 2. Load all fonts in one hook
  const [loaded, error] = useFonts({
    Michroma_400Regular,
    Inter_400Regular,
    Inter_700Bold,
    'Bungee': Bungee_400Regular,
  });

  // 3. Hide splash screen once fonts are ready
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 4. Return null (keep splash screen up) until fonts load
  if (!loaded && !error) {
    return null;
  }

  // 5. Render the App Provider / Stack
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="movies/videourls" options={{ headerShown: false }} />
    </Stack>
  );
}
