import { getAuthUrl } from "@/config/api.config";
import { request } from "../api/request.api";
import { EnumAsyncStorage, IAuthResponse } from "@/types/auth.interface";
import { deleteTokenSrorage, saveToStorage } from "./auth.helper";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Используется при входе в систему и регистрации.
export const AuthService = {
  async main(variant: "reg" | "login", email: string, password: string) {
    const response = await request<IAuthResponse>({
      url: getAuthUrl(`/${variant === "reg" ? "register" : "login"}`),
      method: "POST",
      data: { email, password },
    });
    if (response.accessToken) await saveToStorage(response);
    return response;
  },

  async logout() {
    await deleteTokenSrorage();
    await AsyncStorage.removeItem(EnumAsyncStorage.USER);
  },
};
