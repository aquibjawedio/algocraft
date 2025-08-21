import SpinLoader from "@/components/shared/SpinLoader";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Cpu, Database, RefreshCw, Timer } from "lucide-react";
import { useExecutionStore } from "@/stores/executionStore";
import { useState } from "react";

interface TimeAndSpaceDialogProps {
  submissionId: string;
}

const TimeAndSpaceDialog = ({ submissionId }: TimeAndSpaceDialogProps) => {
  const [complexity, setComplexity] = useState({ time: "", space: "" });

  const { computeTimeAndSpaceComplexity, isFetching } = useExecutionStore();

  const handleTimeAndSpace = async (submissionId: string) => {
    const result = await computeTimeAndSpaceComplexity(submissionId);
    setComplexity(result as { time: string; space: string });
    console.log("Time and Space Complexity:", result);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mt-2 transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => handleTimeAndSpace(submissionId)}
        >
          <RefreshCw
            className={`w-5 h-5 transition-transform duration-300 group-hover:rotate-180 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="dark bg-background text-foreground border-none rounded-2xl shadow-xl">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertDialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5" /> Time & Space Complexity
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="mt-4 text-sm text-foreground flex flex-col items-center justify-center">
              {isFetching ? (
                <div className="flex flex-col items-center gap-3">
                  <SpinLoader />
                  <span className="font-semibold text-muted-foreground">
                    Analyzing...
                  </span>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-[#948979]" />
                    <span className="font-semibold">Time Complexity:</span>
                    <span className="font-mono text-base font-bold">
                      {complexity.time || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#948979]" />
                    <span className="font-semibold">Space Complexity:</span>
                    <span className="font-mono text-base font-bold">
                      {complexity.space || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="px-6 cursor-pointer">
              Close
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TimeAndSpaceDialog;
