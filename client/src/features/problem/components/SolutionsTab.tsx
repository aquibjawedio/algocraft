import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const SolutionsTab = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <ScrollArea className="flex-1 min-h-0 px-6 py-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-muted-foreground">
            You need to be logged in to view solutions.
          </p>
          <Button
            variant="outline"
            className="mt-4 px-8 cursor-pointer"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </Button>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 px-6 py-4">
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No solutions available.</p>
      </div>
    </ScrollArea>
  );
};

export default SolutionsTab;
