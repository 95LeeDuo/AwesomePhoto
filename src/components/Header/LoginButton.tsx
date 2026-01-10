import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import GoogleLoginIcon from "@/components/Button/GoogleLoginIcon.tsx";
import KakaoLoginIcon from "@/components/Button/KakaoLoginIcon.tsx";
import type { MouseEvent } from "react";
import { signIn } from "@/lib/supabase.ts";
import type { Provider } from "@supabase/supabase-js";

const LoginButton = () => {
  const handleClickSignIn = async (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;

    const { error } = await signIn({
      provider: target.dataset["id"] as Provider,
      options: { redirectTo: `${window.location.origin}/OAuth` },
    });

    if (error) {
      alert(`Login Error ${error}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className={"border border-black/30 rounded-xl px-4 py-1 cursor-pointer"}
      >
        로그인
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className={"font-bold text-xl"}>로그인 옵션</DialogHeader>
        <div className={"flex flex-col gap-4 items-center"}>
          <h2 className={"text-base"}>
            로그인하면 촬영한 사진을 저장하고 다시 볼 수 있어요
          </h2>
          <div className={"flex flex-col gap-2"}>
            <GoogleLoginIcon
              className={"cursor-pointer"}
              data-id={"google"}
              onClick={handleClickSignIn}
            />
            <KakaoLoginIcon
              className={"cursor-pointer"}
              data-id={"kakao"}
              onClick={handleClickSignIn}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;
