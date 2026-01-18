import type { PropsWithChildren } from "react";
import SelectedPhoto from "./SelectedPhoto";
import SelectedFrame from "./SelectedFrame";

const SelectLocation = () => {
  return (
    <Container>
      <SelectedFrame />
      <SelectedPhoto />
    </Container>
  );
};

export default SelectLocation;

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-[1200px] w-full mx-2 flex flex-row gap-6 items-start justify-center">
      {children}
    </div>
  );
};
