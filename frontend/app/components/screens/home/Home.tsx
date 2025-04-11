import { FC, useEffect, useState } from "react";
import { Text, View, ImageBackground, Button } from "react-native";
import Layout from "@/components/ui/layout/Layout";
import Header from "./Header";
import Banner from "./banner/Banner";
import { useNavigation } from "@react-navigation/native"; // добавлено
import type { NavigationProp } from "@react-navigation/native";

const Home: FC = () => {
  return (
    <Layout>
      {/* <Header /> */}
      <Banner />
    </Layout>
  );
};

export default Home;
