import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Импортируем Picker

interface Alarm {
  id: string;
  time: string; // Время в формате "HH:MM"
  isEnabled: boolean;
}

const AlarmClock = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>("00");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");

  // Загрузка будильников
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const savedAlarms = await AsyncStorage.getItem("alarms");
        if (savedAlarms) {
          setAlarms(JSON.parse(savedAlarms));
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    };
    loadAlarms();
  }, []);

  // Сохранение будильников
  const saveAlarms = async (updatedAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem("alarms", JSON.stringify(updatedAlarms));
      setAlarms(updatedAlarms);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  // Добавление будильника
  const addAlarm = (time: string) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      isEnabled: true,
    };
    saveAlarms([...alarms, newAlarm]);
  };

  // Обработчик добавления будильника
  const handleAddAlarm = () => {
    const alarmTime = `${selectedHour}:${selectedMinute}`;
    addAlarm(alarmTime);
  };

  // Рендер элемента списка
  const renderAlarmItem = ({ item }: { item: Alarm }) => (
    <View style={styles.alarmItem}>
      <Text style={styles.timeText}>{item.time}</Text>
      <Switch
        value={item.isEnabled}
        onValueChange={() => toggleAlarm(item.id)}
      />
      <Button title="Удалить" onPress={() => deleteAlarm(item.id)} />
    </View>
  );

  // Удаление будильника
  const deleteAlarm = (id: string) => {
    saveAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  // Переключение будильника
  const toggleAlarm = (id: string) => {
    saveAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Будильники</Text>

      <FlatList
        data={alarms}
        renderItem={renderAlarmItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет активных будильников</Text>
        }
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedHour}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSelectedHour(itemValue)} // Типизация параметра
        >
          {Array.from({ length: 24 }, (_, index) => (
            <Picker.Item
              key={index}
              label={String(index).padStart(2, "0")}
              value={String(index).padStart(2, "0")}
            />
          ))}
        </Picker>

        <Text style={styles.separator}>:</Text>

        <Picker
          selectedValue={selectedMinute}
          style={styles.picker}
          onValueChange={(itemValue: string) => setSelectedMinute(itemValue)} // Типизация параметра
        >
          {Array.from({ length: 60 }, (_, index) => (
            <Picker.Item
              key={index}
              label={String(index).padStart(2, "0")}
              value={String(index).padStart(2, "0")}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
        <Text style={styles.addButtonText}>+ Добавить будильник</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  alarmItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeText: {
    color: "#fff",
    fontSize: 18,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: 80,
    height: 50,
    backgroundColor: "#555",
    color: "#fff",
  },
  separator: {
    color: "#fff",
    fontSize: 30,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default AlarmClock;
