import React, { useState, FC, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TypeRootStackParamList } from "@/navigation/navigation.types";
import { QuestService } from "@/services/quest.service";
import { QuestDifficulty, QuestResponse } from "@/types/apiChat";

type ChatScreenProps = NativeStackScreenProps<TypeRootStackParamList, "Chat">;

const ChatScreen: FC<ChatScreenProps> = ({ route, navigation }) => {
  const { alarmTime } = route.params;
  const [messages, setMessages] = useState<
    { id: string; text: string; isUser: boolean }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questProgress, setQuestProgress] = useState("");

  const startQuest = async (difficulty: QuestDifficulty) => {
    setIsLoading(true);
    setMessages([]);

    try {
      const response = await QuestService.startQuest(difficulty);
      setSessionId(response.session_id);
      addBotMessage(response.content, response.progress);
    } catch (error) {
      if (error instanceof Error) {
        addBotMessage(error.message);
      } else {
        addBotMessage("Произошла неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendAnswer = async () => {
    if (!inputText.trim() || !sessionId) return;

    const userMessage = inputText;
    setInputText("");
    addUserMessage(userMessage);

    setIsLoading(true);
    try {
      const response = await QuestService.sendAnswer({
        session_id: sessionId,
        user_answer: userMessage,
      });

      setSessionId(response.session_id);
      addBotMessage(response.content, response.progress);

      if (response.status === "completed") {
        setSessionId(null);
        addBotMessage("Квест завершен! Можете начать новый.");
      }
    } catch (error) {
      if (error instanceof Error) {
        addBotMessage(error.message);
      } else {
        addBotMessage("Произошла неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        isUser: true,
      },
    ]);
  };

  const addBotMessage = (text: string, progress?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `${text}${progress ? `\nПрогресс: ${progress}` : ""}`,
        isUser: false,
      },
    ]);
    if (progress) setQuestProgress(progress);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Чат будильника {alarmTime}</Text>
      {questProgress && <Text>Прогресс: {questProgress}</Text>}

      {!sessionId && (
        <View style={styles.questOptions}>
          <Text style={styles.questTitle}>Выберите сложность квеста:</Text>
          {["30s", "1m", "5m"].map((diff) => (
            <TouchableOpacity
              key={diff}
              style={styles.questButton}
              onPress={() => startQuest(diff as QuestDifficulty)}
              disabled={isLoading}
            >
              <Text>
                {diff === "30s" && "Легкий (30 сек)"}
                {diff === "1m" && "Средний (1 мин)"}
                {diff === "5m" && "Сложный (5 мин)"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.isUser ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={item.isUser ? styles.userText : styles.botText}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {sessionId && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Введите ваш ответ..."
            editable={!isLoading}
            onSubmitEditing={sendAnswer}
          />
          <Button
            title="Отправить"
            onPress={sendAnswer}
            disabled={isLoading || !inputText.trim()}
          />
        </View>
      )}

      <Button
        title="Закрыть чат"
        onPress={() => navigation.goBack()}
        color="#ff4444"
      />

      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}
    </View>
  );
};

// Стили остаются без изменений из предыдущей версии
// ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  questOptions: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  questTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questSubtitle: {
    marginTop: 15,
    marginBottom: 10,
    fontStyle: "italic",
  },
  questButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },
  loader: {
    marginTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userText: {
    color: "#ffffff",
  },
  botText: {
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
    backgroundColor: "#ffffff",
  },
});

export default ChatScreen;
