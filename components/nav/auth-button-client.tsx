import { useProfile } from "@/providers/profile-provider"; // Adjust the import path accordingly
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { signOut } from "@/app/actions";

const AuthButtonClient = () => {
  const profile = useProfile();

  if (!profile) {
    return redirect("/");
  }
  function getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  }

  const initials = getInitials(profile.first_name, profile.last_name);

  return (
    <div className="flex flex-col items-center lg:flex-row lg:gap-4">
      <div className="flex flex-col items-center lg:flex-row lg:gap-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="flex items-center justify-center">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="mt-2 flex-shrink-0 lg:mt-0 text-sm font-medium">
          Hey, {profile.first_name}!
        </span>
      </div>
      <form action={signOut}>
        <button className="mt-2 lg:mt-0 py-2 px-4 text-sm rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  );
};

export default AuthButtonClient;
