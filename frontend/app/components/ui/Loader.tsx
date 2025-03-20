import { FC } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const Loader: FC = () => {
  return <ActivityIndicator style={styles.loader} />;
};

const styles = StyleSheet.create({
  loader: {
    backgroundColor: "green",
  },
});
export default Loader;

//компонент , который показывает пользователю, что что-то загружается в приложении
