import type { HTMLAttributes } from "react";

const KakaoLoginIcon = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props}>
      <img src="/icon/KakaoLoginIcon.png" />
    </button>
  );
};

export default KakaoLoginIcon;
