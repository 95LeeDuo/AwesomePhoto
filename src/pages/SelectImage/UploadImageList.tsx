import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.ts";
import type { MouseEvent } from "react";
import { setUploadImages } from "@/store/slices/uploadImagesSlice.ts";

const UploadImageList = () => {
  const dispatch = useAppDispatch();
  const uploadImages = useAppSelector(
    (state) => state.uploadImages.uploadImages,
  );

  const handleChangeRemoveFile = (e: MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    dispatch(setUploadImages(uploadImages.filter((image) => image.id !== id)));
  };

  return (
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
  );
};

export default UploadImageList;
