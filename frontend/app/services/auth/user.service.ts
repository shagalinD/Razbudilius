import { IUser } from "@/types/user.interface";
import { request } from "../api/request.api";
import { getUsersUrl } from "@/config/api.config";

export const UserService = {
  async getProfile() {
    //Запрос к API
    //результат будет соответствовать интерфейсу IUser
    return request<IUser>({
      url: getUsersUrl("/profile"),
      method: "GET",
    });
  },
};
