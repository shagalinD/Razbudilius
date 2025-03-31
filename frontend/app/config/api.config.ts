//хранит основной адрес сервера
import { SERVER_URL } from "@env";
if (!SERVER_URL) {
  console.error("SERVER_URL is not defined in .env file!");
  throw new Error("SERVER_URL is not configured");
}

export const API_URL = SERVER_URL;
//для эндпоинтов аутентификации
export const getAuthUrl = (path: string) => path; // Было: `/auth${path}`
//для пользовательских эндпоинтов
export const getUsersUrl = (string: string) => `/users${string}`;
