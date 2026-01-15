import type { PropsWithChildren } from "react";
import SelectedPhoto from "./SelectedPhoto";
import SelectedFrame from "./SelectedFrame";

const SelectLocation = () => {
  return (
    <Container>
      <SelectedPhoto />
      <SelectedFrame />
    </Container>
  );
};

export default SelectLocation;

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-[1000px] w-full mx-2 flex flex-col gap-6 items-center">
      {children}
    </div>
  );
};
