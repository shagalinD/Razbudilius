//В AuthProvider происходит инициализация состояния пользователя при первом запуске приложения.
import {
  FC,
  PropsWithChildren,
  createContext,
  useState,
  useEffect,
} from "react";
import { Pressable, Text } from "react-native";
import { IContext, TypeUserState } from "./auth-provider.interface";
import * as SplashScreen from "expo-splash-screen";
import {
  getAccessToken,
  getUserFromStorage,
} from "@/services/auth/auth.helper";

//будет хранить данные о пользователе и функцию для обновления этих данных
export const AuthContext = createContext({} as IContext);

let ignore = SplashScreen.preventAutoHideAsync(); //**Предотвращаем автоматическое скрытие экрана загрузки**
const AuthProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [user, setUser] = useState<TypeUserState>(null);
  useEffect(() => {
    //хук выполняется при монтировании компонента
    //**Проверяем наличие токена при загрузке приложения**
    let isMounted = true;
    const checkAccessToken = async () => {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const user = await getUserFromStorage();
          if (isMounted) setUser(user);
        }
      } catch {
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    let ignore = checkAccessToken();
    return () => {
      isMounted = false;
    };
  });

  //возвращается AuthContext.Provider, который предоставляет данные о пользователе
  // и функцию для его обновления всем дочерним компонентам.
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
