// services/quest.service.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "@/config/api.config";
import { QuestResponse, QuestDifficulty } from "@/types/apiChat";

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
  console.log("Отправка запроса:", {
    url: config.url,
    method: config.method,
    params: config.params,
    data: config.data,
    headers: config.headers,
  });
  return config;
});

// Интерцептор для логирования ответов
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Получен ответ:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error("Ошибка запроса:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const QuestService = {
  async startQuest(difficulty: QuestDifficulty): Promise<QuestResponse> {
    try {
      const params: StartQuestParams = { dif: difficulty };

      const response = await api.get<QuestResponse>("/start_quest", { params });

      return {
        question: response.data.question,
        hints: response.data.hints || [],
        session_id: response.data.session_id,
        ...(response.data.next_question && {
          next_question: response.data.next_question,
        }),
        ...(response.data.is_correct && {
          is_correct: response.data.is_correct,
        }),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async sendAnswer(data: {
    session_id: string;
    user_answer: string;
  }): Promise<QuestResponse> {
    try {
      const response = await api.post<QuestResponse>("/process_answer", data);

      return {
        question: response.data.question || "",
        hints: response.data.hints || [],
        session_id: data.session_id,
        ...(response.data.next_question && {
          next_question: response.data.next_question,
        }),
        ...(response.data.next_step && {
          next_step: {
            question: response.data.next_step.question,
            hints: response.data.next_step.hints || [],
            session_id: response.data.next_step.session_id || data.session_id,
          },
        }),
        is_correct: response.data.is_correct || false,
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
    if (error instanceof Error) {
      return error;
    }
    return new Error("Неизвестная ошибка");
  },
};
