import SpinLoader from "@/components/shared/SpinLoader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExecutionStore } from "@/stores/executionStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, XCircle, Clock, Zap } from "lucide-react";
import CodeBlock from "@/components/shared/CodeBlock";

const SubmissionTab = () => {
  const { getAllSubmissions, submissions, isLoading } = useExecutionStore();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (submissions === null && slug) {
      getAllSubmissions(slug);
    }
  }, [getAllSubmissions, slug, submissions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinLoader />
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No submissions yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 px-6 py-4">
      <Accordion type="single" collapsible className="w-full">
        {submissions.map((sub) => (
          <AccordionItem
            key={sub.id}
            value={sub.id.toString()}
            className="border-b border-border/20"
          >

            <AccordionTrigger className="hover:no-underline px-2 py-3 rounded-lg data-[state=open]:bg-card/40 transition-colors cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {sub.status === "ACCEPTED" ? (
                    <Check className="text-green-400 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-400 w-5 h-5" />
                  )}
                  <span
                    className={`font-medium ${
                      sub.status === "ACCEPTED"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {sub.status}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs border-border/40 text-muted-foreground"
                  >
                    {sub.language}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {sub.createdAt.slice(0, 10)}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 pt-3 bg-card/20 rounded-lg mt-2">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {sub.passedTestCases}/{sub.totalTestCases} tests passed
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {sub.averageTime.toFixed(2)} ms
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    {sub.averageMemory.toFixed(2)} MB
                  </div>
                </div>
              </div>


              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Percentiles
                </h4>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Runtime: {sub.runtimePercentile} percentile</span>
                  <span>Memory: {sub.memoryPercentile} percentile</span>
                </div>
              </div>

              <CodeBlock
                code={sub.code}
                language={sub.language.toLowerCase()}
              />

              {sub.firstFailedInput && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Failure Details
                  </h4>
                  <div className="text-xs text-destructive border-t border-border/10 pt-2">
                    Failed on input:{" "}
                    <code className="bg-destructive/10 px-1 py-0.5 rounded">
                      {sub.firstFailedInput}
                    </code>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default SubmissionTab;
