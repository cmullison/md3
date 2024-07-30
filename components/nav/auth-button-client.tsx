import { useProfile } from "@/providers/profile-provider";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { signOut } from "@/app/actions";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserIcon, LogOut, Sun, Moon, Laptop, Flag } from "lucide-react";
import { useTheme } from "next-themes";

const AuthButtonClient = () => {
  const profile = useProfile();
  const params = useParams();
  const { setTheme } = useTheme();

  if (!profile) {
    return null; // Instead of redirecting, we'll just return null
  }

  function getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  }

  const initials = getInitials(profile.first_name, profile.last_name);

  return (
    <div className="flex flex-row items-center lg:flex-row lg:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-12 h-12 cursor-pointer">
            <AvatarFallback className="flex items-center justify-center">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="#edit-profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("masters-dark")}>
            <Flag className="mr-2 h-4 w-4" />
            <span>The Masters</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Laptop className="mr-2 h-4 w-4"></Laptop>
            <span>System</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="hidden mt-2 flex-shrink-0 lg:mt-0 text-sm font-medium">
        {profile.first_name} {profile.last_name}
      </span>
    </div>
  );
};

export default AuthButtonClient;
