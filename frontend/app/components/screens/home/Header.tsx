import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useTypedNavigation } from "@/hooks/useTypedNavigation";
import { useProfile } from "../Profile/useProfile";

const Header: FC = () => {
  const { profile } = useProfile();
  const { navigate } = useTypedNavigation();
  //метод для перехода на другие экраны.
  return <View className="flex-row justify-between items-center"></View>;
};

export default Header;
