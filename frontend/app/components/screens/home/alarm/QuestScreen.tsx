import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useQuest } from "@/hooks/useQuest";
import { QuestDifficulty } from "@/types/apiChat";

const QuestScreen = () => {
  const [answer, setAnswer] = useState("");
  const {
    currentStep,
    isLoading,
    error,
    questHistory,
    startNewQuest,
    submitAnswer,
    resetQuest,
  } = useQuest();

  const handleStart = (difficulty: QuestDifficulty) => {
    resetQuest();
    startNewQuest(difficulty);
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      submitAnswer(answer);
      setAnswer("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      {!currentStep ? (
        <View style={styles.difficultyContainer}>
          <Text style={styles.title}>Выберите сложность квеста:</Text>
          <View style={styles.buttonGroup}>
            <Button
              title="30 секунд"
              onPress={() => handleStart("30s")}
              disabled={isLoading}
            />
            <Button
              title="1 минута"
              onPress={() => handleStart("1m")}
              disabled={isLoading}
            />
            <Button
              title="5 минут"
              onPress={() => handleStart("5m")}
              disabled={isLoading}
            />
          </View>
        </View>
      ) : (
        <View style={styles.questContainer}>
          <Text style={styles.question}>{currentStep.question}</Text>

          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Ваш ответ..."
            editable={!isLoading}
          />

          <Button
            title="Отправить ответ"
            onPress={handleSubmit}
            disabled={isLoading || !answer.trim()}
          />

          {questHistory.length > 1 && (
            <View style={styles.history}>
              <Text style={styles.historyTitle}>Предыдущие шаги:</Text>
              {questHistory.slice(0, -1).map((step, index) => (
                <Text key={index} style={styles.historyItem}>
                  {step.question}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  difficultyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  questContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 10,
  },
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  history: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  historyTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    marginBottom: 5,
    color: "#666",
  },
  loader: {
    marginTop: 20,
  },
});

export default QuestScreen;
