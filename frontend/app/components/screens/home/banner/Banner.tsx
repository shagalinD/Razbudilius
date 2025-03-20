import { FC } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Banner: FC = () => {
  return (
    <View className="mt-5 w-full bg-black/50 px-12 py-12 rounded-2xl justify-between flex-row">
      <View>
        <Text className="font-medium w-50 text-white text-2xl text-center">
          Your smart alarm!
        </Text>
      </View>
      <View className="absolute bottom-0 right-4 w-32 h-32">
        <Image
          source={require("@/assets/Intellegent.png")}
          className="w-full h-full"
        />
      </View>
    </View>
  );
};
export default Banner;
