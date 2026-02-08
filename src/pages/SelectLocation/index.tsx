import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearFrameSlots } from "@/store/slices/imageSlice";
import SelectedPhoto from "./SelectedPhoto";
import SelectedFrame from "./SelectedFrame";

const SelectLocation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const frameSlots = useAppSelector((state) => state.uploadImages.frameSlots);
  const allFilled = frameSlots.length === 4 && frameSlots.every((s) => s != null);

  useEffect(() => {
    dispatch(clearFrameSlots());
  }, [dispatch]);

  return (
    <div className="max-w-[1200px] w-full mx-2 flex flex-col gap-6 items-center">
      <div className="w-full flex flex-row gap-6 items-start justify-center">
        <SelectedFrame />
        <SelectedPhoto />
      </div>
      <div className="w-full flex justify-center mt-2">
        <button
          type="button"
          onClick={() => navigate("/save")}
          disabled={!allFilled}
          className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:hover:bg-[#3b82f6]"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SelectLocation;
