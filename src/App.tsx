import "./styles/global.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Layout>
      <Header />
      <Outlet />
    </Layout>
  );
}

export default App;