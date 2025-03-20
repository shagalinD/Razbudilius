import { FC } from "react";
import { Text, View } from "react-native";
import { Control } from "react-hook-form";
import { IAuthFormData } from "@/types/auth.interface";
import { validEmail } from "./email.regex";
import Field from "@/components/ui/field/Field";

interface IAuthFields {
  control: Control<IAuthFormData>;
  // control от библиотеки react-hook-form,
  //используется для управления состоянием формы и валидации
}

const AuthFields: FC<IAuthFields> = ({ control }) => {
  return (
    <>
      <Field<IAuthFormData>
        placeholder="Enter email"
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: validEmail,
            message: "Please enter a valid email",
          },
        }}
      />
      <Field<IAuthFormData>
        placeholder="Enter password"
        control={control}
        name="password"
        secureTextEntry
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        }}
      />
    </>
  );
};

export default AuthFields;

//Компонент , который рендерит два поля ввода
