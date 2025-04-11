import { FC } from "react";
import { Text, View, ImageBackground } from "react-native";
import Layout from "@/components/ui/layout/Layout";
import Header from "./Header";
import Banner from "./banner/Banner";

const Home: FC = () => {
  return (
    <Layout>
      {/* <Header /> */}
      <Banner />
    </Layout>
  );
};

export default Home;
