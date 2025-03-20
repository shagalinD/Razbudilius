import { IUser } from "./user.interface";

export interface IAuthFormData extends Pick<IUser, "email" | "password"> {}

//определяет ключи для хранения токенов в SecureStore
export enum EnumSecureStore {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
}

//определяет ключи для хранения токенов в AsyncStorage
export enum EnumAsyncStorage {
  USER = "user",
}

//описывает структуру объекта с токенами
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse extends ITokens {
  user: IUser;
}
