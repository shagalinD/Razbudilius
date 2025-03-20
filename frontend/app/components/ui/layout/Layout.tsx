import { FC, PropsWithChildren } from "react"; // Импортируем PropsWithChildren из react
import { Text, ScrollView, StyleSheet } from "react-native";
import cn from "clsx";
import { LinearGradient } from "expo-linear-gradient"; // Используем expo-linear-gradient для Expo

interface ILayout {
  className?: string;
}

const Layout: FC<PropsWithChildren<ILayout>> = ({ children, className }) => {
  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]} // Задаем цвета градиента
      start={{ x: 0, y: 0 }} // Начальная точка градиента
      end={{ x: 1, y: 1 }} // Конечная точка градиента
      style={styles.container} // Используем объект стилей
    >
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 64,
  },
});
export default Layout;
