import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addPhotoToSlot, removePhotoFromSlot } from "@/store/slices/imageSlice";
import type { FrameType } from "@/store/slices/frameSlice";
import { SLOT_1X4_WIDTH_PCT, SLOT_1X4_HEIGHT_PCT } from "./slotPositions";

// 프레임 타입별 슬롯 위치 설정 (1x4는 500x385 비율)
const SLOT_POSITIONS: Record<
  Exclude<FrameType, null>,
  React.CSSProperties[]
> = {
  "1x4": [
    { top: "1.5%", left: "50%", transform: "translateX(-50%)", width: `${SLOT_1X4_WIDTH_PCT}%`, height: `${SLOT_1X4_HEIGHT_PCT}%` },
    { top: "25.5%", left: "50%", transform: "translateX(-50%)", width: `${SLOT_1X4_WIDTH_PCT}%`, height: `${SLOT_1X4_HEIGHT_PCT}%` },
    { top: "50%", left: "50%", transform: "translateX(-50%)", width: `${SLOT_1X4_WIDTH_PCT}%`, height: `${SLOT_1X4_HEIGHT_PCT}%` },
    { top: "74%", left: "50%", transform: "translateX(-50%)", width: `${SLOT_1X4_WIDTH_PCT}%`, height: `${SLOT_1X4_HEIGHT_PCT}%` },
  ],
  v2x2: [
    {
      top: "12%",
      left: "25%",
      transform: "translateX(-50%)",
      width: "35%",
      height: "30%",
    },
    {
      top: "12%",
      left: "75%",
      transform: "translateX(-50%)",
      width: "35%",
      height: "30%",
    },
    {
      top: "58%",
      left: "25%",
      transform: "translateX(-50%)",
      width: "35%",
      height: "30%",
    },
    {
      top: "58%",
      left: "75%",
      transform: "translateX(-50%)",
      width: "35%",
      height: "30%",
    },
  ],
  h2x2: [
    {
      top: "20%",
      left: "15%",
      transform: "translateY(-50%)",
      width: "30%",
      height: "35%",
    },
    {
      top: "20%",
      left: "50%",
      transform: "translateY(-50%)",
      width: "30%",
      height: "35%",
    },
    {
      top: "80%",
      left: "15%",
      transform: "translateY(-50%)",
      width: "30%",
      height: "35%",
    },
    {
      top: "80%",
      left: "50%",
      transform: "translateY(-50%)",
      width: "30%",
      height: "35%",
    },
  ],
};

const SelectedFrame = () => {
  const dispatch = useAppDispatch();
  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame); // 선택된 프레임 타입
  const selectedPhotos = useAppSelector((state) => state.uploadImages.uploadImages); // 선택된 사진 목록
  const frameSlots = useAppSelector((state) => state.uploadImages.frameSlots); // 프레임 슬롯에 배치된 사진들

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
      e.preventDefault();
      const photoId = e.dataTransfer.getData("photoId");
      const photo = photoId ? selectedPhotos.find((p) => p.id === photoId) : undefined;
      if (photo) dispatch(addPhotoToSlot({ photo, slotIndex }));
    },
    [dispatch, selectedPhotos]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleClick = useCallback(
    (slotIndex: number) => {
      if (frameSlots[slotIndex]) dispatch(removePhotoFromSlot(slotIndex));
    },
    [dispatch, frameSlots]
  );

  // 현재 프레임 타입에 맞는 슬롯 위치 가져오기
  const slotPositions = selectedFrame
    ? (SLOT_POSITIONS[selectedFrame] ?? [])
    : [];

  // 프레임이 선택되지 않았거나 유효하지 않은 경우
  if (!selectedFrame || !slotPositions.length) {
    return (
      <div className="w-full border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white">
        <p className="text-center text-gray-500">프레임을 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white">
      <div className="relative w-full aspect-3/4 bg-gray-100 rounded-md overflow-hidden">
        {/* 슬롯 이미지들(뒤 레이어) */}
        {slotPositions.map((position, index) => (
          <div
            key={index}
            className="absolute bg-white/50 hover:bg-blue-50/50 cursor-pointer transition-colors overflow-hidden"
            style={position}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onClick={() => handleClick(index)}
          >
            {frameSlots[index] ? (
              <img
                src={frameSlots[index]!.previewURL}
                alt={frameSlots[index]!.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                슬롯 {index + 1}
              </div>
            )}
          </div>
        ))}

        {/* 프레임(투명 영역 0) → 가장 앞에 배치, 클릭은 아래 슬롯으로 전달 */}
        <img
          src="/test_frame.png"
          alt="frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        />
      </div>
    </div>
  );
};

export default SelectedFrame;
