import { ComponentType } from "react";

export type TypeRootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Profile: undefined;
  Chat: {
    alarmId: string;
    alarmTime: string;
  }; // убрать chat
  AlarmClock: undefined;
};

export interface IRoute {
  name: keyof TypeRootStackParamList;
  component: ComponentType<any>; //Убрать any
}
