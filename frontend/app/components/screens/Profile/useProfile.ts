import { UserService } from "@/services/auth/user.service";
import { useQuery } from "@tanstack/react-query";
//хук для работы с серверными данными

export const useProfile = () => {
  const { data: profile } = useQuery({
    //Из useQuery берём data и переименовываем её в profile
    queryKey: ["get profile"],
    queryFn: () => UserService.getProfile(),
    //функция, которая выполняет HTTP-запрос и возвращает данные профиля.
  });
  return { profile };
};
