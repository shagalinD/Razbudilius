import { FC, PropsWithChildren } from "react";
import { Text, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import cn from "clsx";

interface ILayout {
  className?: string;
}

const Layout: FC<PropsWithChildren<ILayout>> = ({ children, className }) => {
  return (
    <ImageBackground
      source={require("@/assets/ff59c4616eef370c3a2e2e7f389bf24a.jpg")} // Укажите путь к вашему изображению
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={[
          "rgba(76, 102, 159, 0.3)",
          "rgba(59, 89, 152, 0.3)",
          "rgba(25, 47, 106, 0.5)",
        ]} // Добавлена прозрачность
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    marginTop: 64,
  },
});

export default Layout;
