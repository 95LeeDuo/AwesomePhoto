import UploadArea from "@/pages/SelectImage/UploadArea";
import type { PropsWithChildren } from "react";

const SelectImage = () => {
  return (
    <Container>
      <UploadArea />
    </Container>
  );
};

export default SelectImage;

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-[1000px] w-full mx-2 flex flex-col gap-6 items-center justify-center">
      {children}
    </div>
  );
};
