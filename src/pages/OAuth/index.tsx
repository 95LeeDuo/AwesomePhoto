import { useEffect } from "react";
import { getUserInfo } from "@/lib/supabase.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks.ts";
import { setUserInfo } from "@/store/slices/userSlice.ts";
import type { IUserInfo } from "@/types";

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

  return null;
};

export default OAuth;
