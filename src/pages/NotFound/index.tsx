import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="fixed top-0 bg-[#313338] h-full w-full flex justify-center items-center flex-col font-Pretendard tracking-wider">
      <img src="/notFound.png" alt="notFound" />
      <p className="text-xl font-bold">
        죄송합니다. 현재 찾을 수 없는 페이지를 요청 하셨습니다.
      </p>
      <p className="text-center pt-4 text-[#aaa]">
        존재하지 않는 주소를 입력하셨거나, <br />
        요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
      </p>
      <Link
        to={"/AwesomePhoto/"}
        className="px-10 py-2 bg-[#e9f3fc] text-[#242424] mt-10 rounded-md font-semibold text-xl"
      >
        메인으로
      </Link>
    </div>
  );
};

export default NotFound;
