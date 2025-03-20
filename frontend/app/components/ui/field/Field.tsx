import { FC } from "react";
import { Text, View, TextInput } from "react-native";
import { IField } from "./field.interface";
import { Controller } from "react-hook-form";

const Field = <T extends Record<string, any>>({
  control,
  rules,
  name,
  className,
  ...rest
}: IField<T>): JSX.Element => {
  return (
    <Controller
      // Controller — это компонент из react-hook-form, который управляет полем ввода
      // связывает TextInput c сосотоянием формы, , чтобы react-hook-form мог автоматически отслеживать его значение, обработчики событий
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        //значение, обработчики событий
        fieldState: { error },
        //содержит информацию о состоянии поля
      }) => (
        <View className="w-full">
          <View
            className={`bg-green border-2 rounded-xl px-4 py-3 my-3 ${
              error ? "border-red-500" : "border-gray-400"
            }`}
          >
            <TextInput
              autoCapitalize="none"
              onChangeText={onChange}
              onBlur={onBlur}
              value={(value || "").toString()}
              placeholderTextColor="#6A6A6A"
              style={{ fontSize: 18, color: "black" }}
              {...rest}
            />
          </View>
          {error && (
            <Text className="text-red-500 text-base mt-2">{error.message}</Text>
            //выводит текст ошибки
          )}
        </View>
      )}
    />
  );
};

export default Field;

// кастомный компонент Field, который используется как поле ввода с поддержкой react-hook-form.
