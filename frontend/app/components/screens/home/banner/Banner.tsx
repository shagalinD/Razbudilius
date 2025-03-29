import { FC } from "react";
import { Text, View } from "react-native";
import LottieView from "lottie-react-native";

const Banner: FC = () => {
  return (
    <View className="relative mt-5" style={{ width: "80%", marginLeft: 20 }}>
      <View className="bg-black/30 px-6 py-6 rounded-2xl">
        <Text className="text-white text-2xl font-bold text-center">
          Your smart alarm!
        </Text>
      </View>

      {/* Lottie анимация с абсолютным позиционированием */}
      <LottieView
        source={require("@/assets/Animation - 1743276969680.json")}
        autoPlay
        loop
        style={{
          position: "absolute",
          width: 185,
          height: 185,
          left: -40, // Сдвиг влево относительно баннера
          top: "50%", // Центрирование по вертикали
          marginTop: 45, // Компенсация половины высоты анимации
          zIndex: 1,
        }}
      />
    </View>
  );
};

export default Banner;
