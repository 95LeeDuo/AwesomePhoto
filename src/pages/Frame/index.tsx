import FrameCard from "@/components/Frame/FrameCard";
import type { FrameType } from "@/components/Frame/FrameCard";

const Frame = () => {
  const frames: Array<{
    type: FrameType;
    title: string;
    subtitle: string;
  }> = [
    {
      type: "1x4-vertical",
      title: "1 x 4",
      subtitle: "세로 4컷",
    },
    {
      type: "2x2-vertical",
      title: "2 x 2 세로",
      subtitle: "세로형 4컷",
    },
    {
      type: "2x2-horizontal",
      title: "2 x 2 가로",
      subtitle: "가로형 4컷",
    },
  ];

  const handleFrameSelect = (type: FrameType) => {
    console.log("Selected frame:", type);
    // TODO: 프레임 선택 로직 구현
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12 relative z-10">
      <div className=" text-center mb-5">
        <h2 className="text-3xl font-bold text-black">
          액자 프레임을 선택하세요
        </h2>
        <p className="text-base text-black">원하는 레이아웃을 골라보세요</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-4xl w-full">
        {frames.map((frame) => (
          <div
            key={frame.type}
            className="flex-1 justify-center items-center min-w-[280px] max-w-[320px]"
          >
            <FrameCard
              type={frame.type}
              title={frame.title}
              subtitle={frame.subtitle}
              onClick={() => handleFrameSelect(frame.type)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frame;
