import { useAuth } from "@/hooks/useAuth";
import { AuthService } from "@/services/auth/auth.service";
import { IAuthFormData } from "@/types/auth.interface";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { UseFormReset } from "react-hook-form";

//Хук для управления процессом входа
// оборачивает запросы в react-query, обрабатывает результат, управляет состоянием пользователя и загрузки.
export const useAuthMutations = (reset: UseFormReset<IAuthFormData>) => {
  const { setUser } = useAuth();

  const { mutate: loginSync, isPending: isLoginLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ email, password }: IAuthFormData) =>
      AuthService.main("login", email, password),
    onSuccess(data) {
      reset(); //Очищает форму после успешного запроса
      setUser(data.user); //сохраняет пользователя
    },
  });

  const { mutate: registerSync, isPending: isRegisterLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: ({ email, password }: IAuthFormData) =>
      AuthService.main("reg", email, password),
    onSuccess(data) {
      reset();
      setUser(data.user); //сохраняет пользователя
    },
  });

  //чтобы не пересоздавался при каждом рендере.
  return useMemo(
    () => ({
      loginSync,
      registerSync,
      isLoading: isLoginLoading || isRegisterLoading,
    }),
    [isLoginLoading, isRegisterLoading]
  );
};
