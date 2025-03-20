//хранит основной адрес сервера
export const SERVER_URL = process.env.SERVER_URL;
export const API_URL = `${SERVER_URL}/api`;

//для эндпоинтов аутентификации
export const getAuthUrl = (string: string) => `/auth${string}`;
//для пользовательских эндпоинтов
export const getUsersUrl = (string: string) => `/users${string}`;
