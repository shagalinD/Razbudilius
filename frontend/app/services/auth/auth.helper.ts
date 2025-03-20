import { TypeUserState } from "@/providers/auth/auth-provider.interface";
import {
  EnumSecureStore,
  EnumAsyncStorage,
  ITokens,
  IAuthResponse,
} from "@/types/auth.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

//вспомогательные функции для работы с токенами
export const getAccessToken = async () => {
  const accessToken = await getItemAsync(EnumSecureStore.ACCESS_TOKEN);
  return accessToken || null;
};

export const saveTokenSrorage = async (data: ITokens) => {
  await setItemAsync(EnumSecureStore.ACCESS_TOKEN, data.accessToken);
  await setItemAsync(EnumSecureStore.REFRESH_TOKEN, data.refreshToken);
};

export const deleteTokenSrorage = async () => {
  await deleteItemAsync(EnumSecureStore.ACCESS_TOKEN);
  await deleteItemAsync(EnumSecureStore.REFRESH_TOKEN);
};

export const getUserFromStorage = async () => {
  try {
    return JSON.parse(
      (await AsyncStorage.getItem(EnumAsyncStorage.USER)) || "{}"
    );
  } catch (e) {
    return null;
  }
};

export const saveToStorage = async (data: IAuthResponse) => {
  await saveTokenSrorage(data);
  try {
    await AsyncStorage.setItem(
      EnumAsyncStorage.USER,
      JSON.stringify(data.user)
    );
  } catch (error) {}
};

// Токены хранятся в Secure Store (Expo Secure Store)
//Данные пользователя хранятся в AsyncStorage (локальное хранилище).
