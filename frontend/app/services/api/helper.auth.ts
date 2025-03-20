import { EnumSecureStore, IAuthResponse } from "@/types/auth.interface";
import { getItemAsync } from "expo-secure-store";
import axios from "axios";
import { API_URL, getAuthUrl } from "@/config/api.config";
import { saveToStorage } from "../auth/auth.helper";

export const GetNewTokens = async () => {
  try {
    const refreshToken = await getItemAsync(EnumSecureStore.REFRESH_TOKEN);
    // Отправляем запрос на сервер с refreshToken, чтобы получить новый accessToken
    const response = await axios.post<string, { data: IAuthResponse }>(
      API_URL + getAuthUrl("/login/access-token"),
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.accessToken) await saveToStorage(response.data);
    //Возвращаем ответ от сервера
    return response;
  } catch (e) {}
};
