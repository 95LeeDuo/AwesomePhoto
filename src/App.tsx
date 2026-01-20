import "./styles/global.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Router from "@/routes/Router";
import { type PropsWithChildren, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { supabase } from "@/lib/supabase";
import { resetUserInfo } from "@/store/slices/userSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        dispatch(resetUserInfo());
      }
    });

    return () => data.subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Layout>
      <Header />
      <ContentWrapper>
        <Router />
      </ContentWrapper>
    </Layout>
  );
}

export default App;

const ContentWrapper = ({ children }: PropsWithChildren) => {
  return (
    <section className={"flex justify-center p-4 z-10 flex-1"}>
      {children}
    </section>
  );
};
