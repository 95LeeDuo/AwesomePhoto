import { useEffect, useState } from "react";
import { DEFAULT_SHTTUER_DELAY } from "@/pages/SelectImage/UploadArea";

const Countdown = () => {
  const [count, setCount] = useState(DEFAULT_SHTTUER_DELAY - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) {
    return (
      <div
        className={
          "absolute top-0 left-0 w-full h-full bg-white/50 animate-shoot"
        }
      />
    );
  }

  return (
    <span
      key={count}
      className={
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-white animate-count"
      }
    >
      {count}
    </span>
  );
};

export default Countdown;
