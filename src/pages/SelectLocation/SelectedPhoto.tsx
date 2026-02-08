import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addPhotoToSlot } from "@/store/slices/imageSlice";
import type { FrameType } from "@/store/slices/frameSlice";
import type { IUploadImages } from "@/types";

/** 프레임 컨테이너 비율 3:4, 슬롯 % 기준으로 슬롯 가로세로비 계산 → 크롭 크기 (짧은 쪽 200px 기준) */
const FRAME_ASPECT = 3 / 4;
const BASE_SIZE = 200;

function getCropSizeForFrame(frameType: FrameType): { width: number; height: number } {
  if (!frameType) {
    return { width: 200, height: 267 };
  }
  switch (frameType) {
    case "1x4":
      return { width: Math.round(BASE_SIZE * (500 / 385)), height: BASE_SIZE };
    case "v2x2":
      return { width: BASE_SIZE, height: Math.round(BASE_SIZE * (30 / 35) / FRAME_ASPECT) };
    case "h2x2":
      return { width: BASE_SIZE, height: Math.round(BASE_SIZE * (35 / 30) / FRAME_ASPECT) };
    default:
      return { width: 200, height: 267 };
  }
}

const SelectedPhoto = () => {
  const dispatch = useAppDispatch();
  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);
  const selectedPhotos = useAppSelector(
    (state) => state.uploadImages.uploadImages,
  );
  const frameSlots = useAppSelector(
    (state) => state.uploadImages.frameSlots,
  );

  const cropSize = useMemo(
    () => getCropSizeForFrame(selectedFrame),
    [selectedFrame],
  );
  const CROP_WIDTH = cropSize.width;
  const CROP_HEIGHT = cropSize.height;

  const [selectedPhoto, setSelectedPhoto] = useState<IUploadImages | null>(
    null,
  );
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [containerSize, setContainerSize] = useState({ w: 400, h: 400 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startCropX = useRef(0);
  const startCropY = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [selectedPhoto]);

  const maxCropX = Math.max(0, containerSize.w - CROP_WIDTH);
  const maxCropY = Math.max(0, containerSize.h - CROP_HEIGHT);

  useEffect(() => {
    setCropX((prev) => Math.min(prev, maxCropX));
    setCropY((prev) => Math.min(prev, maxCropY));
  }, [maxCropX, maxCropY]);

  const clampCrop = useCallback(
    (x: number, y: number) => ({
      x: Math.max(0, Math.min(maxCropX, x)),
      y: Math.max(0, Math.min(maxCropY, y)),
    }),
    [maxCropX, maxCropY],
  );

  const handlePhotoSelect = (photo: IUploadImages) => {
    setSelectedPhoto(photo);
    setCropX(0);
    setCropY(0);
  };

  /**
   * object-contain 기준으로 컨테이너 좌표 → 원본 이미지 픽셀 좌표 변환
   * (로드된 img와 현재 컨테이너/크롭 위치 사용)
   */
  const getCropSourceRect = useCallback(
    (img: HTMLImageElement) => {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (!nw || !nh) return null;

      const W = containerSize.w;
      const H = containerSize.h;
      if (!W || !H) return null;

      const scale = Math.min(W / nw, H / nh);
      if (!Number.isFinite(scale) || scale <= 0) return null;

      const displayW = nw * scale;
      const displayH = nh * scale;
      const offsetX = (W - displayW) / 2;
      const offsetY = (H - displayH) / 2;

      const srcX = (cropX - offsetX) / scale;
      const srcY = (cropY - offsetY) / scale;
      const srcW = CROP_WIDTH / scale;
      const srcH = CROP_HEIGHT / scale;

      const clampedX = Math.max(0, Math.min(nw - srcW, srcX));
      const clampedY = Math.max(0, Math.min(nh - srcH, srcY));
      const clampedW = Math.min(srcW, nw - clampedX);
      const clampedH = Math.min(srcH, nh - clampedY);

      if (clampedW <= 0 || clampedH <= 0) return null;
      return { sx: clampedX, sy: clampedY, sw: clampedW, sh: clampedH };
    },
    [containerSize, cropX, cropY, CROP_WIDTH, CROP_HEIGHT],
  );

  const handleAddToSlot = useCallback(async () => {
    if (!selectedPhoto) return;
    const emptySlotIndex = frameSlots.findIndex((slot) => slot === null);
    if (emptySlotIndex === -1) return;

    const W = containerSize.w;
    const H = containerSize.h;
    if (!W || !H) {
      alert("크롭 영역을 계산할 수 없습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("이미지 로드 실패"));
        el.src = selectedPhoto.previewURL;
      });
      if (!img.naturalWidth || !img.naturalHeight) {
        alert("이미지가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const src = getCropSourceRect(img);
      if (!src) {
        alert("크롭 영역을 계산할 수 없습니다. 크롭 창 위치를 조절한 뒤 다시 시도해주세요.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = CROP_WIDTH;
      canvas.height = CROP_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("크롭을 지원하지 않는 환경입니다.");
        return;
      }

      ctx.drawImage(
        img,
        src.sx,
        src.sy,
        src.sw,
        src.sh,
        0,
        0,
        CROP_WIDTH,
        CROP_HEIGHT,
      );

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b ?? null),
          "image/jpeg",
          0.92,
        );
      });

      if (!blob) {
        alert("크롭 이미지 생성에 실패했습니다. (canvas)");
        return;
      }

      const baseName =
        (selectedPhoto.name ?? "").replace(/\.[^.]+$/, "") || "cropped";
      const file = new File([blob], `cropped-${baseName}.jpg`, {
        type: "image/jpeg",
      });
      const croppedPhoto: IUploadImages = Object.assign(file, {
        id: `cropped-${selectedPhoto.id}-${Date.now()}`,
        previewURL: URL.createObjectURL(blob),
      });
      dispatch(
        addPhotoToSlot({ photo: croppedPhoto, slotIndex: emptySlotIndex }),
      );
    } catch (e) {
      console.error("Crop error:", e);
      if (e instanceof Error && e.message === "이미지 로드 실패") {
        alert("이미지를 불러올 수 없습니다. 같은 사진을 다시 선택해 주세요.");
      } else {
        alert("크롭 이미지 생성에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  }, [
    selectedPhoto,
    frameSlots,
    containerSize,
    getCropSourceRect,
    dispatch,
  ]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!selectedPhoto) return;
      isDragging.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      startCropX.current = cropX;
      startCropY.current = cropY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [selectedPhoto, cropX, cropY],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      const { x, y } = clampCrop(
        startCropX.current + dx,
        startCropY.current + dy,
      );
      setCropX(x);
      setCropY(y);
    },
    [clampCrop],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  if (selectedPhotos.length === 0) {
    return (
      <div className="w-full border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white">
        <p className="text-center text-gray-500">선택한 사진이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 border-2 border-[#e3e4e8] shadow-xl rounded-md p-6 bg-white flex flex-col gap-6 min-h-0">
      {/* 이미지 전체 보이게, 그 위에 크롭 영역(창)을 드래그로 이동 */}
      <div className="flex flex-col items-center gap-6 flex-1 min-h-0">
        <div
          ref={containerRef}
          className="relative w-full max-w-md aspect-square overflow-hidden rounded-xl bg-[#1a1a1a] select-none"
        >
          {selectedPhoto ? (
            <>
              {/* 전체 이미지 (contain으로 전부 보임) */}
              <img
                ref={imageRef}
                src={selectedPhoto.previewURL}
                alt={selectedPhoto.name ?? ""}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
              {/* 크롭할 영역: 어두운 막 + 가운데만 뚫린 창(드래그 가능) */}
              <div
                className="absolute cursor-move touch-none border-2 border-white border-opacity-80 rounded"
                style={{
                  left: cropX,
                  top: cropY,
                  width: CROP_WIDTH,
                  height: CROP_HEIGHT,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-sm">아래에서 사진 선택</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          크롭할 영역(흰 테두리)을 드래그해서 움직이세요
        </p>

        <button
          type="button"
          onClick={handleAddToSlot}
          disabled={
            !selectedPhoto || frameSlots.every((s) => s !== null)
          }
          className="w-full max-w-[320px] py-3 px-4 rounded-full bg-[#FEE500] text-[#191919] text-sm font-semibold hover:bg-[#FEE500]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          프레임에 넣기
        </button>
      </div>

      {/* 하단 가로 사진 목록 */}
      <div className="shrink-0 border-t border-[#e3e4e8] pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {selectedPhotos.map((photo) => (
            <div
              key={photo.id}
              role="button"
              tabIndex={0}
              onClick={() => handlePhotoSelect(photo)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePhotoSelect(photo);
                }
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("photoId", photo.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2 focus:ring-offset-white ${
                selectedPhoto?.id === photo.id
                  ? "border-[#FEE500] ring-2 ring-[#FEE500]/50"
                  : "border-transparent hover:border-gray-300 opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={photo.previewURL}
                alt={photo.name ?? ""}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedPhoto;
