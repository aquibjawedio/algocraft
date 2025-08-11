import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProblemSchemaDTO } from "../schemas/problemSchema";
import { Accordion } from "@/components/ui/accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lightbulb, Info, Tags, Timer } from "lucide-react";

type DescriptionTabProps = {
  problem: ProblemSchemaDTO | null | undefined;
};

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-500/15 text-green-400 border border-green-500/20",
  MEDIUM: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  HARD: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const DescriptionTab = ({ problem }: DescriptionTabProps) => {
  if (!problem) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-lg">Problem not found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full p-4 py-2 pb-20 bg-background">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight leading-snug text-foreground">
          {problem.no + ". " + problem.title}
        </h1>
        <Badge
          variant="outline"
          className={`${
            difficultyColors[problem.difficulty]
          } px-2 py-0.5 rounded-full text-xs font-normal uppercase w-fit`}
        >
          {problem.difficulty}
        </Badge>
      </div>

      <Separator className="my-4" />

      <div
        className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: problem.description }}
      />

      {problem.examples?.length ? (
        <section className="mt-10 space-y-6">
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="transition hover:bg-muted/5 rounded-md space-y-3  relative"
            >
              <span className="font-semibold text-foreground block mb-1">
                Example {i + 1}
              </span>

              {/* Vertical connector line */}
              <div className="absolute left-0 top-8 bottom-0 w-0.5 bg-border rounded pb-2" />

              {/* Input */}
              <div className="flex items-start">
                <div className="w-1 bg-primary rounded mr-3" />
                <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                  <span className="font-semibold text-foreground">Input:</span>{" "}
                  {ex.input}
                </pre>
              </div>

              {/* Output */}
              <div className="flex items-start text-foreground">
                <div className="w-1 bg-secondary rounded mr-3" />
                <pre className="whitespace-pre-wrap text-sm leading-6">
                  <span className="font-semibold text-foreground">Output:</span>{" "}
                  {ex.output}
                </pre>
              </div>

              {/* Explanation */}
              {ex.explanation && (
                <div className="flex items-start">
                  <div className="w-1 bg-accent rounded mr-3" />
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                    <span className="font-semibold text-foreground">
                      Explanation: 
                    </span>{" "}
                    {ex.explanation}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </section>
      ) : null}

      {problem.constraints && (
        <section className="mt-10">
          <h3 className="text-lg font-semibold border-b border-border/40 pb-2 text-foreground">
            Constraints
          </h3>
          <pre className="rounded-md p-4 text-sm whitespace-pre-wrap bg-muted/5 text-foreground">
            {problem.constraints}
          </pre>
        </section>
      )}

      {problem.hints?.length ? (
        <section className="mt-10">
          <Accordion type="single" collapsible className="space-y-2">
            {problem.hints.map((hint, i) => (
              <AccordionItem
                key={i}
                value={`hint-${i}`}
                className="rounded-md overflow-hidden border border-border/30 bg-muted/5 hover:bg-muted/10 transition cursor-pointer"
              >
                <AccordionTrigger className="flex items-center gap-2 p-2 text-sm hover:bg-muted/10 text-foreground">
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>Hint {i + 1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 text-sm leading-6 text-foreground">
                  {hint}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}

      {(problem.metadata?.topics?.length ||
        problem.metadata?.timeComplexity ||
        problem.metadata?.spaceComplexity) && (
        <section className="mt-12 text-sm text-muted-foreground space-y-4">
          {problem.metadata?.topics?.length ? (
            <div className="flex items-start gap-2">
              <Tags className="w-4 h-4 text-foreground mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Topics:</span>{" "}
                {problem.metadata.topics.join(", ")}
              </div>
            </div>
          ) : null}

          {problem.metadata?.timeComplexity && (
            <div className="flex items-start gap-2">
              <Timer className="w-4 h-4 text-foreground mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">
                  Time Complexity:
                </span>{" "}
                {problem.metadata.timeComplexity}
              </div>
            </div>
          )}

          {problem.metadata?.spaceComplexity && (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-foreground mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">
                  Space Complexity:
                </span>{" "}
                {problem.metadata.spaceComplexity}
              </div>
            </div>
          )}
        </section>
      )}
    </ScrollArea>
  );
};

export default DescriptionTab;
