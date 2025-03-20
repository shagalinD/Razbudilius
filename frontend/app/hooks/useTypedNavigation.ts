import { TypeRootStackParamList } from "@/navigation/navigation.types";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export const useTypedNavigation = () =>
  //хук,который предоставляет доступ к навигации
  useNavigation<NavigationProp<TypeRootStackParamList>>();
