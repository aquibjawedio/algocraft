import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, isLoading, logoutUser } = useAuthStore();

  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth/login");
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={user?.avatarUrl || "/default-avatar.png"}
              alt="User Avatar"
            />
            <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="cursor-pointer bg-background text-foreground"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-red-500"
            onClick={() => setOpen(true)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        action={handleLogout}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProfileDropdown;
