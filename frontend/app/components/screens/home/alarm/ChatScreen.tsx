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
import { QuestDifficulty } from "@/types/apiChat";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ChatScreenProps = NativeStackScreenProps<
  TypeRootStackParamList,
  "Chat"
> & {
  navigation: NativeStackNavigationProp<TypeRootStackParamList, "Chat">;
};

const ChatScreen: FC<ChatScreenProps> = ({ route, navigation }) => {
  useEffect(() => {
    console.log("Чат открыт с параметрами:", route.params);
  }, []);
  const { alarmId, alarmTime } = route.params;
  const [messages, setMessages] = useState<
    { id: string; text: string; isUser: boolean }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [chatMode, setChatMode] = useState<"free" | "quest">("free");
  const [currentQuestStep, setCurrentQuestStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startQuest = async (difficulty: QuestDifficulty) => {
    setIsLoading(true);
    setChatMode("quest");
    setCurrentQuestStep(0);
    setMessages([]);

    try {
      const firstStep = await QuestService.startQuest(difficulty);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-bot",
          text: firstStep.question,
          isUser: false,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          text: "Не удалось начать квест. Попробуйте позже.",
          isUser: false,
        },
      ]);
      setChatMode("free");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    if (chatMode === "quest") {
      setIsLoading(true);
      try {
        const response = await QuestService.sendAnswer({
          session_id: alarmId,
          user_answer: inputText,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-bot",
            text: response.next_step?.question || "Квест завершен!",
            isUser: false,
          },
        ]);

        setCurrentQuestStep((prev) => prev + 1);
      } catch (error) {
        console.error("Ошибка при обработке ответа:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Обычный режим чата
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-bot",
            text: `Ответ на "${inputText}" (alarmId: ${alarmId})`,
            isUser: false,
          },
        ]);
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Чат будильника {alarmTime}</Text>

      {chatMode === "free" && messages.length === 0 && (
        <View style={styles.questOptions}>
          <Text style={styles.questTitle}>Выберите режим:</Text>
          <TouchableOpacity
            style={styles.questButton}
            onPress={() => setChatMode("free")}
          >
            <Text>Свободный чат</Text>
          </TouchableOpacity>
          <Text style={styles.questSubtitle}>Или начать квест:</Text>
          <TouchableOpacity
            style={styles.questButton}
            onPress={() => startQuest("30s")}
            disabled={isLoading}
          >
            <Text>Легкий (30 сек)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.questButton}
            onPress={() => startQuest("1m")}
            disabled={isLoading}
          >
            <Text>Средний (1 мин)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.questButton}
            onPress={() => startQuest("5m")}
            disabled={isLoading}
          >
            <Text>Сложный (5 мин)</Text>
          </TouchableOpacity>
        </View>
      )}
      <Button
        title="Закрыть чат"
        onPress={() => navigation.navigate("Home")}
        color="#ff4444"
      />

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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите сообщение..."
          editable={!isLoading}
        />
        <Button
          title="Отправить"
          onPress={sendMessage}
          disabled={isLoading || !inputText.trim()}
        />
      </View>

      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}
    </View>
  );
};

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
