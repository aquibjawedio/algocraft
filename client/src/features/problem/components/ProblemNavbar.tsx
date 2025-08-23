import { Link } from "react-router-dom";
import { ChevronLeft, Play, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "@/components/shared/ProfileDropdown";

interface ProblemNavbarProps {
  onRun: () => void;
  onSubmit: () => void;
  isExecuting: boolean;
}

const ProblemNavbar = ({
  onRun,
  onSubmit,
  isExecuting,
}: ProblemNavbarProps) => {
  return (
    <div className="z-10 relative w-full flex items-center justify-between p-1 px-4 backdrop-blur-md border-b border-border bg-background/90">
      <div className="flex items-center gap-2">
        <Link
          to="/problems"
          className="flex items-center gap-1 text-foreground hover:text-yellow-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm ">Problems</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onRun}
          disabled={isExecuting}
          className="border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <Play className="w-4 h-4 text-yellow-400" />
          <span className="text-foreground">Run</span>
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isExecuting}
          variant="outline"
          className="border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <CloudUpload className="w-4 h-4 text-yellow-400" />
          <span className="text-foreground">Submit</span>
        </Button>
      </div>

      <div />
      <ProfileDropdown />
    </div>
  );
};

export default ProblemNavbar;
