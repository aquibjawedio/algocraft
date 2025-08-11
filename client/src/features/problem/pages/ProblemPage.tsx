// ProblemPage.tsx
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import MonacoEditor from "../components/MonacoEditor";
import { useEffect, useState, useMemo } from "react";
import { useProblemStore } from "@/stores/problemStore";
import { useParams } from "react-router-dom";
import SpinLoader from "@/components/shared/SpinLoader";
import { useExecutionStore } from "@/stores/executionStore";
import {
  BookOpenText,
  CodeXml,
  GalleryHorizontalEnd,
  MessagesSquare,
  SquareCode,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProblemNavbar from "../components/ProblemNavbar";
import DescriptionTab from "../components/DescriptionTab";
import SubmissionTab from "../components/SubmissionTab";

const TabListControl = [
  {
    value: "description",
    label: "Description",
    icon: <BookOpenText className="w-4 h-4" />,
  },
  {
    value: "submissions",
    label: "Submissions",
    icon: <GalleryHorizontalEnd className="w-4 h-4" />,
  },
  {
    value: "solutions",
    label: "Solutions",
    icon: <SquareCode className="w-4 h-4" />,
  },
  {
    value: "discussions",
    label: "Discussions",
    icon: <MessagesSquare className="w-4 h-4" />,
  },
];

const ProblemPage = () => {
  const [code, setCode] = useState("// Write your solution here...");
  const [language, setLanguage] = useState("JAVASCRIPT");

  const { problem, isLoading, getProblemBySlug } = useProblemStore();
  const { runCode, testResults, executing, submission, submitCode } =
    useExecutionStore();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (slug) getProblemBySlug(slug);
  }, [slug, getProblemBySlug]);

  useEffect(() => {
    if (problem?.starterCodes) {
      const starter = problem.starterCodes.find(
        (c) => c.language === language
      )?.code;
      if (starter) setCode(starter);
    }
  }, [problem, language]);

  const handleRunCode = async () => {
    if (slug && code) {
      await runCode(slug, code, language);
    }
  };

  const handleSubmitCode = async () => {
    if (slug && code) {
      await submitCode?.(slug, code, language);
    }
  };

  const handleSwitchLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    const starterCode = problem?.starterCodes?.find(
      (c) => c.language === newLanguage
    )?.code;
    setCode(starterCode ?? "// Write your solution here...");
  };

  const hasTestResults = useMemo(
    () => testResults && testResults.length > 0,
    [testResults]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <SpinLoader />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Problem not found</p>
      </div>
    );
  }

  console.log("Submimssion Data:", submission);

  return (
    <>
      <div className="w-screen h-screen bg-[#0E0E0E] text-white overflow-hidden">
        <ProblemNavbar
          onRun={handleRunCode}
          onSubmit={handleSubmitCode}
          isExecuting={executing}
        />

        {/* IMPORTANT: top-level group must be constrained (h-full) */}
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full flex"
        >
          {/* LEFT: description pane - ensure min-h-0 so its children can shrink */}
          <ResizablePanel
            defaultSize={38}
            minSize={25}
            className="border-r border-border bg-background flex flex-col min-h-0"
          >
            <Tabs
              defaultValue="description"
              className="flex flex-col flex-1 min-h-0"
            >
              <TabsList className="bg-background border-b border-border rounded-none px-2 gap-2 shrink- w-full">
                {TabListControl.map((tab, index) => (
                  <TabsTrigger
                    key={index}
                    value={tab.value}
                    className="relative pb-3 pt-3 px-1 text-sm font-medium text-foreground hover:bg-muted focus:bg-muted data-[state=active]:bg-accent-foreground/10 data-[state=active]:text-forground data-[state=active]:border-card flex items-center gap-1 cursor-pointer"
                  >
                    {tab.icon}
                    <span className="ml-1">{tab.label}</span>
                    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-accent transition-all duration-300 data-[state=active]:w-full" />
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent
                value="description"
                className="flex flex-col flex-1 min-h-0"
              >
                <DescriptionTab problem={problem} />
              </TabsContent>

              <TabsContent
                value="submissions"
                className="flex flex-col flex-1 min-h-0"
              >
                <SubmissionTab />
              </TabsContent>

              <TabsContent
                value="solutions"
                className="flex flex-col flex-1 min-h-0"
              >
                <ScrollArea className="flex-1 min-h-0 px-6 py-4">
                  <p className="text-muted-foreground">
                    No community solutions available.
                  </p>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="discussions"
                className="flex flex-col flex-1 min-h-0"
              >
                <ScrollArea className="flex-1 min-h-0 px-6 py-4">
                  <p className="text-muted-foreground">No submissions yet.</p>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle className="bg-[#1A1A1A]" withHandle />

          {/* RIGHT: editor pane - ensure min-h-0 */}
          <ResizablePanel
            defaultSize={62}
            minSize={40}
            className="bg-[#0E0E0E] flex flex-col min-h-0"
          >
            <ResizablePanelGroup
              direction="vertical"
              className="flex-1 min-h-0 flex"
            >
              {/* Editor upper */}
              <ResizablePanel
                defaultSize={70}
                minSize={40}
                className="border-b border-border flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between px-2 border-b border-border bg-background text-foreground">
                  <div className=" flex gap-1 items-center">
                    <CodeXml className="w-4 h-4 text-[#e6c200]" />
                    <span className="text-sm font-medium">Code</span>
                  </div>
                  <Select value={language} onValueChange={handleSwitchLanguage}>
                    <SelectTrigger className="bg-background border border-border text-foreground py-0">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground border border-border">
                      {problem?.starterCodes?.map((code) => (
                        <SelectItem
                          key={code.language}
                          value={code.language}
                          className="text-xs hover:bg-card focus:bg-[#e6c200] cursor-pointer"
                        >
                          {code.language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monaco container: ensure min-h-0 and overflow-hidden (editor will fill) */}
                <div className="flex-1 min-h-0 overflow-hidden bg-background">
                  <MonacoEditor
                    value={code}
                    onChange={setCode}
                    language={language.toLowerCase()}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-[#1A1A1A]" withHandle />

              {/* Test Results panel */}
              <ResizablePanel
                defaultSize={30}
                minSize={8}
                className="flex flex-col p-0 min-h-0"
              >
                <Card className="flex-1 rounded-none border-none bg-background text-foreground overflow-hidden p-0">
                  <CardContent className="h-full flex flex-col p-2 min-h-0">
                    {hasTestResults ? (
                      <Tabs
                        defaultValue="test1"
                        className="flex flex-col h-full min-h-0 bg-background"
                      >
                        <TabsList className="text-sm data-[state=active]:bg-accent-foreground/10 data-[state=active]:text-forground data-[state=active]:border-card rounded-md cursor-pointer">
                          {testResults?.map((_, i) => (
                            <TabsTrigger
                              key={i}
                              value={`test${i + 1}`}
                              className="text-sm  data-[state=active]:shadow-sm rounded-md data-[state=active]:bg-accent-foreground/10 data-[state=active]:text-forground data-[state=active]:border-card cursor-pointer"
                            >
                              Test {executing ? <SpinLoader /> : i + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        <div className="flex-1 min-h-0">
                          <ScrollArea className="flex-1 min-h-0 py-2">
                            {testResults?.map((res, i) => {
                              const passed =
                                res.expected?.trim() === res.output?.trim();
                              return (
                                <TabsContent
                                  key={i}
                                  value={`test${i + 1}`}
                                  className="p-3 rounded-md bg-card border border-border/30 space-y-4"
                                >
                                  <section>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                      Input
                                    </p>
                                    <pre className="p-2 rounded-md text-sm bg-muted/10">
                                      {res.input}
                                    </pre>
                                  </section>
                                  <section>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                      Expected
                                    </p>
                                    <pre className="p-2 rounded-md text-sm bg-muted/10">
                                      {res.expected}
                                    </pre>
                                  </section>
                                  <section>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                      Your Output
                                    </p>
                                    <pre
                                      className={`p-2 rounded-md text-sm ${
                                        passed
                                          ? "bg-accent/20"
                                          : "bg-destructive/20"
                                      }`}
                                    >
                                      {res.output ?? "No output"}
                                    </pre>
                                  </section>
                                </TabsContent>
                              );
                            })}
                          </ScrollArea>
                        </div>
                      </Tabs>
                    ) : (problem?.examples?.length ?? 0) > 0 ? (
                      <Tabs
                        defaultValue="test1"
                        className="flex flex-col h-full min-h-0"
                      >
                        <TabsList className="mb-2 shrink-0 bg-background border-border border rounded-md">
                          {problem.examples?.map((_, i) => (
                            <TabsTrigger
                              key={i}
                              value={`test${i + 1}`}
                              className="text-sm data-[state=active]:bg-accent-foreground/10 data-[state=active]:text-forground data-[state=active]:border-card rounded-md cursor-pointer"
                            >
                              Test {executing ? <SpinLoader /> : i + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        <div className="flex-1 min-h-0">
                          <ScrollArea className="flex-1 min-h-0 px-2 py-2">
                            {problem.examples?.map((ex, i) => (
                              <TabsContent
                                key={i}
                                value={`test${i + 1}`}
                                className="p-3 rounded-md bg-card border border-border/30 space-y-4"
                              >
                                <section>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                    Input
                                  </p>
                                  <pre className="p-2 rounded-md text-sm bg-muted/10">
                                    {ex.input}
                                  </pre>
                                </section>
                                <section>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                    Expected
                                  </p>
                                  <pre className="p-2 rounded-md text-sm bg-muted/10">
                                    {ex.output}
                                  </pre>
                                </section>
                              </TabsContent>
                            ))}
                          </ScrollArea>
                        </div>
                      </Tabs>
                    ) : (
                      <div className="text-muted-foreground text-sm p-4">
                        No test cases available.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
};

export default ProblemPage;
