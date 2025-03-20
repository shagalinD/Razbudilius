import { TypeRootStackParamList } from "@/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import { View, Text, Button, Pressable } from "react-native";
import { useTypedNavigation } from "@/hooks/useTypedNavigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAuthFormData } from "@/types/auth.interface";
import Loader from "@/components/ui/Loader";
import AuthFields from "./AuthFields";
import { useAuthMutations } from "./useAuthMutations";

const Auth: FC = () => {
  const [isReg, setIsReg] = useState(false);

  const { handleSubmit, reset, control } = useForm<IAuthFormData>({
    mode: "onChange",
  });
  const { isLoading, loginSync, registerSync } = useAuthMutations(reset);
  const onSubmit: SubmitHandler<IAuthFormData> = (data) => {
    if (isReg) registerSync(data);
    else loginSync(data);
  };

  return (
    <View className="flex-1 justify-center items-center px-2 -mt-20">
      <View className="w-3/4">
        <Text className="text-center text-blue-500 text-xl font-medium mb-2">
          {isReg ? "Sign Up" : "Log in"}
        </Text>
        {isLoading && <Loader />}

        <AuthFields control={control} />
        <Button
          title={isReg ? "Sign Up" : "Log in"}
          onPress={handleSubmit(onSubmit)}
        />
        <Pressable onPress={() => setIsReg(!isReg)}>
          <Text className="text-black text-center mt-2">
            {isReg ? "Already have an account?" : "Don't have an account?"}
            <Text className="text-green-500">
              {" "}
              {isReg ? "Login" : "Sign up"}
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Auth;
