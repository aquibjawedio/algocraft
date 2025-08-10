import { Link } from "react-router-dom";
import { ChevronLeft, Play, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="z-10 relative w-full flex items-center justify-between p-1 px-4 bg-card/5 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        <Link
          to="/problems"
          className="flex items-center gap-1 text-yellow-500 hover:text-yellow-300 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Problems</span>
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
          <span>Run</span>
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isExecuting}
          variant="outline"
          className="border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <CloudUpload className="w-4 h-4 text-yellow-400" />
          <span>Submit</span>
        </Button>
      </div>

      <div />
    </div>
  );
};

export default ProblemNavbar;
