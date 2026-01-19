import type { PropsWithChildren } from "react";
import BackgroundBalls from "@/components/Layout/BackgroundBalls";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main
      className={
        "min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden"
      }
    >
      <BackgroundBalls />
      {children}
    </main>
  );
};

export default Layout;
