import "./styles/global.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Router from "@/routes/Router.tsx";

function App() {
  return (
    <Layout>
      <Header />
      <Router />
    </Layout>
  );
}

export default App;
