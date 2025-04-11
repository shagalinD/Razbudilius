import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/config/api.config";
import { QuestResponse, QuestDifficulty, UserAnswer } from "@/types/apiChat";

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

interface StartQuestParams {
  dif: QuestDifficulty;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log("Отправка запроса:", config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Получен ответ:", response);
    return response;
  },
  (error: AxiosError) => {
    console.error("Ошибка запроса:", error);
    return Promise.reject(error);
  }
);

export const QuestService = {
  async startQuest(difficulty: QuestDifficulty): Promise<QuestResponse> {
    try {
      const response = await api.get<QuestResponse>("/start_quest", {
        params: { dif: difficulty },
      });

      return {
        content: response.data.content,
        session_id: response.data.session_id,
        status: response.data.status,
        progress: response.data.progress,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async sendAnswer(data: UserAnswer): Promise<QuestResponse> {
    try {
      const response = await api.post<QuestResponse>("/process_answer", data);

      return {
        content: response.data.content,
        session_id: response.data.session_id,
        status: response.data.status,
        progress: response.data.progress,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || error.message || "Ошибка сервера"
      );
    }
    return new Error("Неизвестная ошибка");
  },
};
