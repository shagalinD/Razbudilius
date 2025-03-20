import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC, useState, useEffect } from "react";
import { TypeRootStackParamList } from "./navigation.types";
import PrivateNavigator from "./PrivateNavigator";
import BottomMenu from "@/components/ui/layout/bottom-menu/BottomMenu";
import { useAuth } from "@/hooks/useAuth";
import AlarmClock from "@/components/screens/home/alarm/Alarm";
import { useCheckAuth } from "@/providers/auth/useCheckAuth";

const Navigation: FC = () => {
  const { user } = useAuth();
  const navRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState<string | undefined>();

  useEffect(() => {
    if (!navRef.isReady()) return;

    setCurrentRoute(navRef.getCurrentRoute()?.name || "Auth");

    const listener = navRef.addListener("state", () => {
      setCurrentRoute(navRef.getCurrentRoute()?.name || "Auth");
    });

    return () => {
      listener();
    };
  }, [navRef]);

  useCheckAuth(currentRoute);

  return (
    <>
      <NavigationContainer ref={navRef}>
        <PrivateNavigator />
        {currentRoute === "Home" && <AlarmClock />}
      </NavigationContainer>
      {currentRoute && (
        <BottomMenu nav={navRef.navigate} currentRoute={currentRoute} />
      )}
    </>
  );
};

export default Navigation;
