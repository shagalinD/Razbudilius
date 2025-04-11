import { IUser } from "@/types/user.interface";
import { request } from "../api/request.api";
import { getUsersUrl } from "@/config/api.config";
import { getAccessToken } from "./auth.helper";

export const UserService = {
  async getProfile() {
    //Запрос к API
    const token = await getAccessToken();
    return request<IUser>({
      url: getUsersUrl("/profile"),
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
