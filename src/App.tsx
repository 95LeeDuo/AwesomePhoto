import "./styles/global.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";
import type { PropsWithChildren } from "react";

function App() {
  return (
    <Layout>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </Layout>
  );
}

export default App;

const ContentWrapper = ({ children }: PropsWithChildren) => {
  return (
    <section className={"flex justify-center p-4 z-10"}>{children}</section>
  );
};
