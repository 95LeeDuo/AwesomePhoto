import { useNavigate } from "react-router-dom";
import { setNavigate } from "@/lib/navagation";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <div onClick={() => navigate("/frame")}>Home</div>;
};

export default Home;
