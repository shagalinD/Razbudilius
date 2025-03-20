import { useAuth } from "@/hooks/useAuth";
import { errorCatch } from "@/services/api/error.api";
import { GetNewTokens } from "@/services/api/helper.auth";
import { getAccessToken } from "@/services/auth/auth.helper";
import { AuthService } from "@/services/auth/auth.service";
import { EnumSecureStore } from "@/types/auth.interface";
import { getItemAsync } from "expo-secure-store";
import { useEffect } from "react";

//помогает автоматически проверять и обновлять токены доступа,
export const useCheckAuth = (routeName?: string) => {
  const { user, setUser } = useAuth();
  //если нашелся accessToken пробуем его обновить, если ошибка "jwt expired", выходим из системы
  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        try {
          await GetNewTokens();
        } catch (e) {
          if (errorCatch(e) === "jwt expired") {
            //потому что запрос не может быть выполнен с истекшим
            await AuthService.logout();
            setUser(null);
          }
        }
      }
    };
    let ignore = checkAccessToken();
  }, []);

  //если не находит refreshToken , то выход из системы и сброс состояния
  useEffect(() => {
    const checkRefreshToken = async () => {
      const refreshToken = await getItemAsync(EnumSecureStore.REFRESH_TOKEN);
      if (!refreshToken && user) {
        await AuthService.logout();
        setUser(null);
      }
    };
    let ignore = checkRefreshToken();
  }, [routeName]);
};
