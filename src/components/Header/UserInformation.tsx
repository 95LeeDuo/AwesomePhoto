import type { IUserInfo } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/supabase.ts";

interface IUserInformationProps {
  userInfo: IUserInfo;
}

const UserInformation = (props: IUserInformationProps) => {
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"focus-visible:outline-none"}>
        <div className={"flex gap-2 items-center cursor-pointer "}>
          <img
            src={props.userInfo.identity_data.avatar_url}
            alt={"유저 이미지"}
            className={"w-8 h-8 rounded-full"}
          />
          <span className={"truncate"}>
            {props.userInfo.identity_data.name}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>마이페이지</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInformation;
