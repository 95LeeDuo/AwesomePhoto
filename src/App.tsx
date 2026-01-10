import "./styles/global.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Router from "@/routes/Router.tsx";
import { type PropsWithChildren, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks.ts";
import { supabase } from "@/lib/supabase.ts";
import { resetUserInfo } from "@/store/slices/userSlice.ts";

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
    <section className={"flex justify-center p-4 z-10"}>{children}</section>
  );
};
