import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addPhotoToSlot } from "@/store/slices/imageSlice";
import type { IUploadImages } from "@/types";


const SelectedPhoto = () => {
  const dispatch = useAppDispatch();
  const selectedPhotos = useAppSelector((state) => state.uploadImages.uploadImages);
  const frameSlots = useAppSelector((state) => state.uploadImages.frameSlots);

  const handlePhotoClick = (photo: IUploadImages) => {
    // 첫 번째 빈 슬롯 찾기
    const emptySlotIndex = frameSlots.findIndex((slot) => slot === null);
    if (emptySlotIndex !== -1) {
      dispatch(addPhotoToSlot({ photo, slotIndex: emptySlotIndex }));
    }
  };

  if (selectedPhotos.length === 0) {
    return (
      <div className="w-full border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white">
        <p className="text-center text-gray-500">선택한 사진이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 border-2 border-[#e3e4e8] shadow-xl rounded-md p-8 bg-white">
      <h2 className="text-xl font-semibold mb-4">선택한 사진</h2>
      <div className="flex flex-col gap-2">
        {selectedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-gray-500/30 rounded flex items-center relative aspect-square w-full max-w-[120px] overflow-hidden cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("photoId", photo.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={photo.previewURL}
              alt={photo.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedPhoto;
