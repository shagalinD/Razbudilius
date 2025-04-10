import { FC } from "react";
import { Text, View, Image } from "react-native";
import Layout from "@/components/ui/layout/Layout";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "./useProfile";
import { AuthService } from "@/services/auth/auth.service";

const Profile: FC = () => {
  const { setUser } = useAuth();
  const { profile } = useProfile();
  return (
    <Layout>
      <Heading isCenter>Profile</Heading>
      <View className="my-6 items-center justify-center">
        <Image
          source={require("@/assets/User.jpg")}
          className="w-40 h-40 rounded-full"
        />
      </View>
      <Button
        onPress={() => AuthService.logout().then(() => setUser(null))}
        className="mt-5"
      >
        Logout
      </Button>
    </Layout>
  );
};

export default Profile;
