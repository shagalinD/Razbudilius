export type QuestDifficulty = "30s" | "1m" | "5m";

// export interface QuestStep {
//   question: string;
//   hints: string[]; // Теперь hints обязательное поле
//   session_id: string;
// }

export type UserAnswer = {
  session_id: string;
  user_answer: string;
};

export interface QuestResponse {
  content: string;
  session_id: string | null;
  status: string;
  progress: string;
}

// export interface StartQuestResponse {
//   question: string;
//   hints: string[];
//   session_id: string;
// }

// export interface ProcessAnswerResponse {
//   next_question?: string;
//   next_step?: {
//     question: string;
//     hints: string[];
//     session_id: string;
//   };
//   hints: string[];
//   is_correct: boolean;
//   is_final?: boolean;
// }
