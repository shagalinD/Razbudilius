import { FC, PropsWithChildren } from "react";
import { Pressable, Text } from "react-native";
import { IButton } from "./buttom.interface";

const Button: FC<PropsWithChildren<IButton>> = ({ children, ...rest }) => {
  return (
    <Pressable
      className="self-center bg-black/50 w-full py-3 rounded-full"
      {...rest}
    >
      <Text className="text-white text-center font-medium text-lg">
        {children}
      </Text>
    </Pressable>
  );
};

export default Button;

// компонент кнопки
// используем PropsWithChildren для того чтобы не прописывать children в IButton
