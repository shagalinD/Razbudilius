import { FC } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TypeRootStackParamList } from "./navigation.types";
import { routes } from "./routes";
import Auth from "@/components/screens/auth/Auth";

const Stack = createNativeStackNavigator<TypeRootStackParamList>();
const PrivateNavigator: FC = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "fff",
        },
      }}
    >
      {/* {routes.map((route) => (
        <Stack.Screen key={route.name} {...route} />
      ))} */}
      {user ? (
        routes.map((route) => <Stack.Screen key={route.name} {...route} />)
      ) : (
        <Stack.Screen name="Auth" component={Auth} />
      )}
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
