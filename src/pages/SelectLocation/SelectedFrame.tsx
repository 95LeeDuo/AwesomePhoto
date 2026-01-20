import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addPhotoToSlot, removePhotoFromSlot } from "@/store/slices/imageSlice";
import type { FrameType } from "@/store/slices/frameSlice";

// 프레임 타입별 슬롯 위치 설정
const SLOT_POSITIONS: Record<
  Exclude<FrameType, null>,
  React.CSSProperties[]
> = {
  "1x4": [
    {
      top: "1.5%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "38%",
      height: "22%",
    },
    {
      top: "26%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "38%",
      height: "22%",
    },
    {
      top: "50%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "38%",
      height: "22%",
    },
    {
      top: "74%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "38%",
      height: "22%",
    },
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

  // 드래그 앤 드롭: 사진을 슬롯에 배치
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    slotIndex: number,
  ) => {
    e.preventDefault();
    const photoId = e.dataTransfer.getData("photoId");
    if (photoId) {
      const photo = selectedPhotos.find((p) => p.id === photoId);
      if (photo) {
        dispatch(addPhotoToSlot({ photo, slotIndex }));
      }
    }
  };

  // 드래그 오버: 드롭 가능하도록 설정
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // 슬롯 클릭: 사진이 있으면 제거
  const handleClick = (slotIndex: number) => {
    if (frameSlots[slotIndex]) {
      // 슬롯에 사진이 있으면 제거
      dispatch(removePhotoFromSlot(slotIndex));
    }
  };

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
      <h2 className="text-xl font-semibold mb-4">프레임</h2>
      <div className="relative w-full aspect-3/4 bg-gray-100 rounded-md overflow-hidden">
        <img
          src="/test_frame.png"
          alt="frame"
          className="absolute inset-0 w-full h-full object-contain"
        />

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
      </div>
    </div>
  );
};

export default SelectedFrame;
