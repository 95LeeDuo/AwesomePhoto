import { type PropsWithChildren } from "react";
import { Camera, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const UploadArea = () => {
  return (
    <Container>
      <div
        className={
          "aspect-video border-2 border-[#e3e4e8] shadow-xl rounded-md bg-[#f0f1fa] mb-4"
        }
      >
        <div className="flex flex-col items-center justify-center gap-4 h-full">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#4159d4]/10 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-[#4159d4]" />
          </div>
          <p className="text-[#6d717e]">{"사진이 여기에 표시됩니다"}</p>
        </div>
      </div>

      <div className={"flex gap-2"}>
        <Button
          // onClick={() => fileInputRef.current?.click()}
          size="lg"
          className="w-full h-16 text-lg font-semibold text-[#fcfcfc] bg-[#4159d4] hover:bg-[#4159d4]/60 cursor-pointer"
        >
          <Upload className="w-6 h-6 mr-2" />
          {"사진 업로드"}
        </Button>
        <Button
          // onClick={startCamera}
          size="lg"
          variant="outline"
          className="w-full h-16 text-lg font-semibold border-2 border-[#e3e4e8] hover:bg-[#a049d4] hover:text-white hover:border-[#a049d4] bg-transparent cursor-pointer"
        >
          <Camera className="w-6 h-6 mr-2" />
          {"카메라 촬영"}
        </Button>
      </div>
    </Container>
  );
};

export default UploadArea;

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={
        "w-full border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white"
      }
    >
      {children}
    </div>
  );
};
