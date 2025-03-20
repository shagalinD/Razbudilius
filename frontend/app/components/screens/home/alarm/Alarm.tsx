import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Modal,
  StyleSheet,
  Button,
  FlatList,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Alarm {
  id: string;
  time: Date;
  isEnabled: boolean;
}

const AlarmClock = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Загрузка будильников при монтировании компонента
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const savedAlarms = await AsyncStorage.getItem("alarms");
        if (savedAlarms) {
          const parsedAlarms = JSON.parse(savedAlarms).map((alarm: any) => ({
            ...alarm,
            time: new Date(alarm.time),
          }));
          setAlarms(parsedAlarms);
        } else {
          setAlarms([]);
        }
      } catch (error) {
        console.error("Ошибка загрузки будильников:", error);
        setAlarms([]);
      }
    };
    loadAlarms();
  }, []);

  // Сохранение будильников в AsyncStorage
  const saveAlarms = async (updatedAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem("alarms", JSON.stringify(updatedAlarms));
      setAlarms(updatedAlarms);
    } catch (error) {
      console.error("Ошибка сохранения будильников:", error);
    }
  };

  // Добавление нового будильника
  const addAlarm = async () => {
    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: selectedTime,
      isEnabled: true,
    };

    const updatedAlarms = [...alarms, newAlarm];
    await saveAlarms(updatedAlarms);
    setShowPicker(false); // Закрываем модальное окно
  };

  // Удаление будильника
  const deleteAlarm = async (id: string) => {
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
    await saveAlarms(updatedAlarms);
  };

  // Переключение состояния будильника (вкл/выкл)
  const toggleAlarm = async (id: string) => {
    const updatedAlarms = alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
    );
    await saveAlarms(updatedAlarms);
  };

  // Обработчик изменения времени в DateTimePicker
  const handleTimeChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date); // Обновляем выбранное время
    }
    if (Platform.OS === "android") {
      setShowPicker(false); // На Android закрываем пикер после выбора времени
    }
  };

  // Рендер элемента списка будильников
  const renderAlarmItem = ({ item }: { item: Alarm }) => (
    <View style={styles.alarmItem}>
      <Text style={styles.timeText}>
        {item.time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Switch
        value={item.isEnabled}
        onValueChange={() => toggleAlarm(item.id)}
      />
      <Button title="Удалить" onPress={() => deleteAlarm(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarms</Text>

      {/* Контейнер с будильниками */}
      <FlatList
        data={alarms}
        renderItem={renderAlarmItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет активных будильников</Text>
        }
        contentContainerStyle={styles.flatListContent}
      />

      {/* Контейнер с кнопкой теперь фиксирован внизу */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.addButtonText}>Добавить будильник</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <Modal visible={showPicker} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
              <Button title="Добавить будильник" onPress={addAlarm} />
              <Button title="Отмена" onPress={() => setShowPicker(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    paddingBottom: 90,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  alarmItem: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  timeText: {
    color: "white",
    fontSize: 20,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#555",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});

export default AlarmClock;
