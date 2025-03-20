import { FC, PropsWithChildren } from "react";
import { Text } from "react-native";
import cn from "clsx";

interface IHeading {
  isCenter?: boolean;
  className?: string;
}

const Heading: FC<PropsWithChildren<IHeading>> = ({
  children,
  isCenter = false,
  className,
}) => {
  return (
    <Text
      className={cn(
        "text-white mt-5 font-medium text-3xl",
        isCenter && "text-center",
        className
      )}
    >
      {children}
    </Text>
  );
};

export default Heading;

//компонент заголовка
