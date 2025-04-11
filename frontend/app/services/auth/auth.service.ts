// app/services/auth.service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveToStorage, deleteTokenSrorage } from "./auth.helper";
import { EnumAsyncStorage } from "@/types/auth.interface";

export const AuthService = {
  async main(variant: "reg" | "login", email: string, password: string) {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/${variant === "reg" ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.accessToken) await saveToStorage(data);
      return data;
    } catch (error) {
      // Правильная типизация ошибки
      if (error instanceof Error) {
        console.error("Auth error:", error.message);
        throw new Error(error.message);
      }
      console.error("Unknown error:", error);
      throw new Error("An unknown error occurred");
    }
  },
  async logout() {
    await deleteTokenSrorage();
    await AsyncStorage.removeItem(EnumAsyncStorage.USER);
  },
};
