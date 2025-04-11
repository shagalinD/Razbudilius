import { useState } from "react";
import { QuestService } from "@/services/quest.service";
import { QuestStep, QuestResponse, QuestDifficulty } from "@/types/apiChat";

export const useQuest = () => {
  const [currentStep, setCurrentStep] = useState<QuestStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questHistory, setQuestHistory] = useState<QuestStep[]>([]);

  const startNewQuest = async (difficulty: QuestDifficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await QuestService.startQuest(difficulty);
      const firstStep: QuestStep = {
        question: response.question,
        hints: response.hints,
        session_id: response.session_id,
      };
      setCurrentStep(firstStep);
      setQuestHistory([firstStep]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!currentStep) return;

    setIsLoading(true);
    try {
      const response = await QuestService.sendAnswer({
        session_id: currentStep.session_id,
        user_answer: answer,
      });

      if (response.is_final) {
        setCurrentStep(null);
      } else if (response.next_step) {
        // Явно проверяем что next_step существует
        const nextStep: QuestStep = {
          question: response.next_step.question,
          hints: response.next_step.hints,
          session_id: response.next_step.session_id,
        };

        setCurrentStep(nextStep);
        setQuestHistory((prev) => [...prev, nextStep]); // Теперь точно QuestStep
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };
  return {
    currentStep,
    isLoading,
    error,
    questHistory,
    startNewQuest,
    submitAnswer,
    resetQuest: () => {
      setCurrentStep(null);
      setQuestHistory([]);
      setError(null);
    },
  };
};
