import {
  type ChangeEvent,
  type PropsWithChildren,
  type DragEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { Camera, ImageIcon, SwitchCamera, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUploadImages } from "@/store/slices/imageSlice";
import type { IUploadImages } from "@/types";
import { useNavigate } from "react-router-dom";
import UploadImageList from "@/pages/SelectImage/UploadImageList";
import Countdown from "@/pages/SelectImage/Countdown";

type TFacingMode = "user" | "environment";

export const DEFAULT_SHTTUER_DELAY = 4;

const UploadArea = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const uploadImages = useAppSelector(
    (state) => state.uploadImages.uploadImages,
  );
  const [isFileOver, setIsFileOver] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [facingMode, setFacingMode] = useState<TFacingMode>("environment");
  const [isCountdown, setIsCountdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (!files || files.length === 0) return;

    if (uploadImages.length + files.length > 10) {
      alert("10장 이상 업로드할 수 없습니다.");
      setIsFileOver(false);
      return;
    }

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const addPropertyFiles: IUploadImages[] = validFiles.map((file) => {
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

    dispatch(setUploadImages([...uploadImages, ...filteredFiles]));

    setIsFileOver(false);
  };

  const handleChangeUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadImages.length + files.length > 10) {
      alert("10장 이상 업로드할 수 없습니다.");
      return;
    }

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

    dispatch(setUploadImages([...uploadImages, ...filteredFiles]));
  };

  const handleClickCaptureCamera = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.debug("카메라가 아직 준비 안됨");
      return;
    }
    setIsCountdown(true);

    setTimeout(async () => {
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

      setIsCountdown(false);
      dispatch(setUploadImages([...uploadImages, addPropertyFile]));
    }, DEFAULT_SHTTUER_DELAY * 1000);
  };

  const handleCancelCamera = () => {
    setIsCameraMode(false);
    setIsCountdown(false);
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
      {/* D&D 영역 */}
      <div
        className={`aspect-video border-2 border-[#e3e4e8] shadow-xl rounded-md ${isFileOver ? "bg-black/20" : "bg-[#f0f1fa]"}`}
      >
        {isCameraMode ? (
          <div className={"w-full h-full relative"}>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={"h-full w-full rounded object-cover"}
            />
            {isCountdown && <Countdown />}
          </div>
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

        <input
          hidden
          multiple
          ref={fileInputRef}
          type={"file"}
          accept={"image/*"}
          onChange={handleChangeUploadFile}
        />
      </div>

      {/* 사진 리스트 영역 */}
      <UploadImageList disabled={isCountdown} />

      {/* 버튼 영역 */}
      {isCameraMode ? (
        <CameraButton
          handleCancelCamera={handleCancelCamera}
          handleClickCaptureCamera={handleClickCaptureCamera}
          handleChangeFacingMode={handleChangeFacingMode}
          disabled={isCountdown}
        />
      ) : (
        <Button
          onClick={() => setIsCameraMode(true)}
          size="lg"
          variant="outline"
          className={`w-full h-16 px-2 text-lg font-semibold border-2 text-[#fcfcfc] bg-[#4159d4] hover:bg-[#4159d4]/60 cursor-pointer`}
        >
          <Camera className="w-6 h-6 mr-2" />
          카메라 촬영
        </Button>
      )}
      <Button
        className={`h-16 w-full px-2 text-lg ${uploadImages.length < 4 || uploadImages.length > 10 ? "cursor-not-allowed" : "cursor-pointer"} hover:bg-black/50`}
        disabled={uploadImages.length < 4 || uploadImages.length > 10}
        onClick={() => {
          if (uploadImages.length >= 4 && uploadImages.length <= 10) {
            navigate("/select-location");
          }
        }}
      >
        선택 완료
      </Button>
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

interface CameraButtonProps {
  handleCancelCamera: () => void;
  handleClickCaptureCamera: () => Promise<void>;
  handleChangeFacingMode: () => void;
  disabled: boolean;
}

const CameraButton = (props: CameraButtonProps) => {
  return (
    <div className={"w-full flex justify-between items-center"}>
      <Button
        className={`w-12 h-12 rounded-full cursor-pointer`}
        onClick={props.handleCancelCamera}
        disabled={props.disabled}
      >
        <X className={"!w-6 !h-6"} />
      </Button>
      <Button
        onClick={props.handleClickCaptureCamera}
        size={"default"}
        className={"w-16 h-16 rounded-full bg-[#a049d4] cursor-pointer"}
        disabled={props.disabled}
      >
        <Camera className={"!w-6 !h-6"} />
      </Button>
      <Button
        className={"w-12 h-12 rounded-full cursor-pointer"}
        onClick={props.handleChangeFacingMode}
        disabled={props.disabled}
      >
        <SwitchCamera className={"!w-6 !h-6"} />
      </Button>
    </div>
  );
};
