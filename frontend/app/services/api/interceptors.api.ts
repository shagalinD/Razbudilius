// Обработка истекших токенов
import { API_URL } from "@/config/api.config";
import { EnumSecureStore } from "@/types/auth.interface";
import axios from "axios";
import { getItemAsync } from "expo-secure-store";
import { errorCatch } from "./error.api";
import { GetNewTokens } from "./helper.auth";
import { deleteTokenSrorage, getAccessToken } from "../auth/auth.helper";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Перехватчик для запросов

//Этот код выполняется перед отправкой каждого запроса.
instance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
  //Возвращаем изменённую конфигурацию запроса.
});

//перехватчик для ответов. Этот код выполняется после получения ответа от сервера.
instance.interceptors.response.use(
  (config) => config,
  //возвращаем ответ без изменений, если всё прошло успешно.
  async (error) => {
    const originalRequest = error.config;
    // Получаем исходную конфигурацию запроса, который вызвал ошибку.

    if (
      (error.response.status === 401 ||
        //не авторизован
        errorCatch(error) === "jwt expided" ||
        //истечение срока действия JWT
        errorCatch(error) === "jwt must be provided") &&
      //JWT не предоставлен
      error.config &&
      !error.config._isRetry
      // Если это не повторный запрос
    ) {
      originalRequest._isRetry = true;
      try {
        await GetNewTokens();
        return instance.request(originalRequest);
      } catch (error) {
        if (errorCatch(error) === "jwt expired")
          // Если ошибка связана с истечением срока действия JWT.
          await deleteTokenSrorage();
        // Удаляем токен из хранилища
      }
    }
    throw error;
  }
);
export default instance;
