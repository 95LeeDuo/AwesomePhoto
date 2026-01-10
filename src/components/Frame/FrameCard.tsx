export type FrameType = "1x4" | "v2x2" | "h2x2";

interface FrameCardProps {
  frameType: FrameType;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const FrameCard = ({ frameType, title, subtitle, onClick }: FrameCardProps) => {
  const renderFramePreview = () => {
    switch (frameType) {
      case "1x4":
        // 포토부스 1x4: 세로로 긴 직사각형 4개를 위아래로 배치
        return (
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="flex flex-col gap-1.5 w-[70px] h-[200px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 border-2 border-dashed border-gray-300 rounded"
                />
              ))}
            </div>
          </div>
        );
      case "v2x2":
        // 2x2 세로형: 세로가 긴 직사각형 프레임
        return (
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-1.5 w-[140px] h-[200px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-gray-300 rounded"
                />
              ))}
            </div>
          </div>
        );
      case "h2x2":
        // 2x2 가로형: 가로가 긴 직사각형 프레임
        return (
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-1.5 w-[200px] h-[140px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-gray-300 rounded"
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="group bg-white rounded-lg p-6 cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-out"
      onClick={onClick}
    >
      <div className="mb-4 flex justify-center items-center min-h-[200px]">
        <div className="group-hover:scale-105 transition-transform duration-300">
          {renderFramePreview()}
        </div>
      </div>
      <h3 className="text-lg font-bold text-black mb-1 text-center group-hover:text-purple-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-500 text-center group-hover:text-gray-700 transition-colors duration-300">
        {subtitle}
      </p>
    </div>
  );
};

export default FrameCard;
