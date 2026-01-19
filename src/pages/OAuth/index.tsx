import { useEffect } from "react";
import { getUserInfo } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setUserInfo } from "@/store/slices/userSlice";
import type { IUserInfo } from "@/types";
import Spinner from "@/components/Spinner";

const OAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: user, error } = await getUserInfo();

      if (error || !user) {
        navigate("/");
        return;
      }

      dispatch(setUserInfo(user.identities[0] as IUserInfo));
      navigate("/");
    };
    getUser();
  }, []);

  return <Spinner />;
};

export default OAuth;
