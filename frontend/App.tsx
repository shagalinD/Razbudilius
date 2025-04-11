import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "@/navigation/Navigation";
import AuthProvider from "@/providers/auth/AuthProvider";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ✅ Добавляем GestureHandlerRootView
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { API_URL } from "@/config/api.config";
import { Platform } from "react-native"; // Добавьте этот импорт

// import AlarmClock from "@/components/screens/home/alarm/Alarm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  // <View className="flex-1 items-center justify-center bg-blue-500">
  //   <Text className="text-white text-2xl">NativeWind работает! 🎉</Text>
  // </View>
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <AuthProvider>
          <SafeAreaProvider>
            {/* <ConnectionTest /> */}
            <Navigation />
          </SafeAreaProvider>
        </AuthProvider>

        <StatusBar style="dark" />
        <Toast />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
