import FrameCard from "@/components/Frame/FrameCard";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { setFrame } from "@/store/slices/frameSlice";
import type { FrameType } from "@/store/slices/frameSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState } from "react";

const Frame = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [api, setApi] = useState<CarouselApi>();
  const frames: Array<{
    title: string;
    subtitle: string;
    frameType: Exclude<FrameType, null>;
  }> = [
    {
      title: "1 x 4",
      subtitle: "세로 4컷",
      frameType: "1x4",
    },
    {
      title: "2 x 2 세로",
      subtitle: "세로형 4컷",
      frameType: "v2x2",
    },
    {
      title: "2 x 2 가로",
      subtitle: "가로형 4컷",
      frameType: "h2x2",
    },
  ] as const;

  const handleFrameSelect = (frameType: Exclude<FrameType, null>) => {
    console.log("Selected frame:", frameType);
    dispatch(setFrame(frameType));
    navigate("/select-photo");
  };
  const handleMobileFrameSelect = () => {
    if (!api) return;

    const selectedIndex = api.selectedScrollSnap();
    const frameType = frames[selectedIndex]?.frameType;

    if (frameType) {
      console.log("Selected frame:", frameType);
      dispatch(setFrame(frameType));
      navigate("/selectPhoto");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-2 relative z-10">
      <div className="text-center mb-5 ">
        <h2 className="text-3xl font-bold text-black">
          액자 프레임을 선택하세요
        </h2>
        <p className="text-base text-black">원하는 레이아웃을 골라보세요</p>
      </div>
      {/* 데스크탑 뷰 */}
      <div className="xs:flex hidden flex-wrap justify-center gap-6 max-w-4xl w-full">
        {frames.map((frame) => (
          <div
            key={frame.frameType}
            className="flex-1 justify-center items-center xs:min-w-[280px] xs:max-w-[320px]"
          >
            <FrameCard
              frameType={frame.frameType}
              title={frame.title}
              subtitle={frame.subtitle}
              onClick={() => handleFrameSelect(frame.frameType)}
            />
          </div>
        ))}
      </div>
      {/* 모바일 뷰 */}
      <div className="xs:hidden flex flex-col items-center justify-center w-full">
        <Carousel className="w-full max-w-[100vw] " setApi={setApi}>
          <CarouselContent>
            {frames.map((frame) => (
              <CarouselItem key={frame.frameType}>
                <div className="flex justify-center items-center xs:min-w-[200px] xs:max-w-[320px]">
                  <FrameCard
                    frameType={frame.frameType}
                    title={frame.title}
                    subtitle={frame.subtitle}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        <button
          className="w-[calc(100vw-40px)] h-12 mt-4 bg-blue-400 text-white rounded-lg"
          onClick={() => handleMobileFrameSelect()}
        >
          선택
        </button>
      </div>
    </div>
  );
};

export default Frame;
