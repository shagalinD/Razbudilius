import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { TextInputProps } from "react-native";

export interface IField<T extends FieldValues>
  extends Omit<TextInputProps, "onChange" | "onChageText" | "value"> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: Omit<
    RegisterOptions<T, FieldPath<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
}
// Этот интерфейс нужен для типизации кастомного компонента поля ввода (например, Field.tsx),
// спользуется для создания обёртки над TextInput, чтобы связать его с react-hook-form и упростить работу с формами
