import {
  type ChangeEvent,
  type PropsWithChildren,
  type MouseEvent,
  type DragEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { Camera, ImageIcon, SwitchCamera, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface IUploadImages extends File {
  id: string;
  previewURL: string;
}

type TFacingMode = "user" | "environment";

const UploadArea = () => {
  const [uploadImages, setUploadImages] = useState<IUploadImages[]>([]);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [facingMode, setFacingMode] = useState<TFacingMode>("environment");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const addPropertyFiles = validFiles.map((file) => {
      return {
        ...file,
        id: `${file.name}_${file.lastModified}`,
        previewURL: URL.createObjectURL(file),
      };
    });

    const existingIds = new Set(uploadImages.map((img) => img.id));
    const filteredFiles = addPropertyFiles.filter(
      (img) => !existingIds.has(img.id),
    );

    setUploadImages((prev) => [...prev, ...filteredFiles]);

    setIsFileOver(false);
  };

  const handleChangeUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const addPropertyFiles = validFiles.map((file) => {
      return {
        ...file,
        id: `${file.name}_${file.lastModified}`,
        previewURL: URL.createObjectURL(file),
      };
    });

    const existingIds = new Set(uploadImages.map((img) => img.id));
    const filteredFiles = addPropertyFiles.filter(
      (img) => !existingIds.has(img.id),
    );

    setUploadImages((prev) => [...prev, ...filteredFiles]);
  };

  const handleChangeRemoveFile = (e: MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    setUploadImages((prev) => [...prev.filter((image) => image.id !== id)]);
  };

  const handleClickCaptureCamera = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.debug("카메라가 아직 준비 안됨");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg");

    const blob = await fetch(dataURL).then((res) => res.blob());
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    const addPropertyFile = {
      ...file,
      id: `${file.name}_${file.lastModified}`,
      previewURL: URL.createObjectURL(file),
    };

    setUploadImages((prev) => [...prev, addPropertyFile]);
  };

  const handleChangeFacingMode = async () => {
    if (!isCameraMode) return;

    const nextMode = facingMode === "user" ? "environment" : "user";

    stopCamera();
    await startCamera(nextMode);
    setFacingMode(nextMode);
  };

  const startCamera = async (mode: TFacingMode) => {
    if (!videoRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: mode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    streamRef.current = stream;
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isCameraMode) {
      startCamera(facingMode);
      return;
    }

    stopCamera();

    return stopCamera;
  }, [isCameraMode]);

  return (
    <Container>
      <div
        className={`aspect-video border-2 border-[#e3e4e8] shadow-xl rounded-md ${isFileOver ? "bg-black/20" : "bg-[#f0f1fa]"}`}
      >
        {isCameraMode ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={"h-full w-full rounded"}
            // className="object-contain"
          />
        ) : (
          <div
            className={"cursor-pointer h-full"}
            onDragEnter={() => setIsFileOver(true)}
            onDragLeave={() => setIsFileOver(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropFiles}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center gap-4 h-full pointer-events-none">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#4159d4]/10 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-[#4159d4]" />
              </div>
              <p className="text-[#6d717e] mx-2">
                사진을 이 영역에 드래그 앤 드롭하거나, 클릭하여 업로드하세요.
              </p>
            </div>
          </div>
        )}
      </div>
      {uploadImages.length > 0 && (
        <div className={"grid gap-2 xs:grid-cols-4 grid-cols-2"}>
          {uploadImages.map((uploadImage) => (
            <div
              key={uploadImage.id}
              className={
                "bg-gray-500/30 rounded flex items-center relative aspect-square"
              }
            >
              <img src={uploadImage.previewURL} alt={uploadImage.name} />
              <div
                data-id={uploadImage.id}
                className={
                  "absolute -top-1 -right-1 bg-gray-400 rounded-full p-1 cursor-pointer"
                }
                onClick={handleChangeRemoveFile}
              >
                <X className={"w-[12px] h-[12px] text-white"} />
              </div>
            </div>
          ))}
        </div>
      )}

      {isCameraMode ? (
        <div className={"w-full flex justify-between items-center"}>
          <Button
            className={"w-12 h-12 rounded-full cursor-pointer"}
            onClick={() => setIsCameraMode(false)}
          >
            <X className={"!w-6 !h-6"} />
          </Button>
          <Button
            onClick={handleClickCaptureCamera}
            size={"default"}
            className={"w-16 h-16 rounded-full bg-[#a049d4] cursor-pointer"}
          >
            <Camera className={"!w-6 !h-6"} />
          </Button>
          <Button
            className={"w-12 h-12 rounded-full cursor-pointer"}
            onClick={handleChangeFacingMode}
          >
            <SwitchCamera className={"!w-6 !h-6"} />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsCameraMode(true)}
          size="lg"
          variant="outline"
          className={`w-full h-16 px-2 text-lg font-semibold border-2 
            ${isCameraMode ? "border-[#e3e4e8] hover:bg-[#a049d4] hover:text-white hover:border-[#a049d4] bg-transparent" : "text-[#fcfcfc] bg-[#4159d4] hover:bg-[#4159d4]/60"}
          cursor-pointer`}
        >
          <Camera className="w-6 h-6 mr-2" />
          {isCameraMode ? "촬영 종료" : "카메라 촬영"}
        </Button>
      )}

      <input
        hidden
        multiple
        ref={fileInputRef}
        type={"file"}
        accept={"image/*"}
        onChange={handleChangeUploadFile}
      />
    </Container>
  );
};

export default UploadArea;

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={
        "w-full border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white flex flex-col gap-4"
      }
    >
      {children}
    </div>
  );
};
