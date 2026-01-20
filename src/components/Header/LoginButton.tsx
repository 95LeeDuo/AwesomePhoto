import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GoogleLoginIcon from "@/components/Button/GoogleLoginIcon";
import KakaoLoginIcon from "@/components/Button/KakaoLoginIcon";
import type { MouseEvent } from "react";
import { signIn } from "@/lib/supabase";
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
        <DialogHeader className={"font-bold text-xl"}>
          <DialogTitle>로그인 옵션</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-col gap-4 items-center"}>
          <h2 className={"text-base"}>
            로그인하면 촬영한 사진을 저장하고 다시 볼 수 있어요
          </h2>
          <div className={"flex flex-col gap-2 max-w-[320px] w-full"}>
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
