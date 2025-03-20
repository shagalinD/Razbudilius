import Auth from "@/components/screens/auth/Auth";
import Home from "@/components/screens/home/Home";
import Profile from "@/components/screens/Profile/Profile";

import { IRoute } from "./navigation.types";

export const routes: IRoute[] = [
  // {
  //   name: "Auth",
  //   component: Auth,
  // },
  {
    name: "Home",
    component: Home,
  },
  {
    name: "Profile",
    component: Profile,
  },
];
