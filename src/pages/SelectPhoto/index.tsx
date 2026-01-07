import Greeting from "@/pages/SelectPhoto/Greeting.tsx";
import UploadArea from "@/pages/SelectPhoto/UploadArea.tsx";
import type { PropsWithChildren } from "react";

const SelectPhoto = () => {
  return (
    <Container>
      <Greeting />
      <UploadArea />
    </Container>
  );
};

export default SelectPhoto;

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-[1000px] w-full mx-2 flex flex-col gap-6 items-center">
      {children}
    </div>
  );
};
