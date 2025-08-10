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
  const { runCode, testResults, executing } = useExecutionStore();
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
    if (slug && code) await runCode(slug, code, language);
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

  return (
    <>
      <div className="w-screen h-screen bg-[#0E0E0E] text-white overflow-hidden">
        <ProblemNavbar
          onRun={handleRunCode}
          onSubmit={() => {}}
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
            className="border-r border-border bg-[#141414] flex flex-col min-h-0"
          >
            <Tabs
              defaultValue="description"
              className="flex flex-col flex-1 min-h-0"
            >
              <TabsList className="bg-[#141414] border-b border-border rounded-none px-4 gap-8 shrink-0 w-full">
                {TabListControl.map((tab, index) => (
                  <TabsTrigger
                    key={index}
                    value={tab.value}
                    className="relative pb-3 pt-3 px-1 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white cursor-pointer"
                  >
                    {tab.icon}
                    <span className="ml-1">{tab.label}</span>
                    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#FFD700] transition-all duration-300 data-[state=active]:w-full" />
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
                <ScrollArea className="flex-1 min-h-0 px-6 py-4">
                  <p className="text-gray-400">No submissions yet.</p>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="solutions"
                className="flex flex-col flex-1 min-h-0"
              >
                <ScrollArea className="flex-1 min-h-0 px-6 py-4">
                  <p className="text-gray-400">
                    No community solutions available.
                  </p>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="discussions"
                className="flex flex-col flex-1 min-h-0"
              >
                <ScrollArea className="flex-1 min-h-0 px-6 py-4">
                  <p className="text-gray-400">No submissions yet.</p>
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
                <div className="flex items-center justify-between px-2 border-b border-border bg-[#141414]">
                  <div className="text-gray-200 flex gap-1 items-center">
                    <CodeXml className="w-4 h-4 text-[#e6c200]" />
                    <span className="text-sm font-medium">Code</span>
                  </div>
                  <Select value={language} onValueChange={handleSwitchLanguage}>
                    <SelectTrigger className="bg-[#1E1E1E] border border-border text-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] text-white border border-border">
                      {problem?.starterCodes?.map((code) => (
                        <SelectItem
                          key={code.language}
                          value={code.language}
                          className="text-sm hover:bg-[#2E2E2E] focus:bg-[#e6c200]"
                        >
                          {code.language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monaco container: ensure min-h-0 and overflow-hidden (editor will fill) */}
                <div className="flex-1 min-h-0 overflow-hidden">
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
                <Card className="flex-1 rounded-none border-none bg-[#141414] text-gray-200 overflow-hidden p-0">
                  <CardContent className="h-full flex flex-col p-2 min-h-0">
                    {hasTestResults ? (
                      <Tabs
                        defaultValue="test1"
                        className="flex flex-col h-full min-h-0"
                      >
                        <TabsList className="gap-2 rounded-md shrink-0">
                          {testResults &&
                            testResults.map((_, i) => (
                              <TabsTrigger
                                key={i}
                                value={`test${i + 1}`}
                                className="text-sm"
                              >
                                Test {executing ? <SpinLoader /> : i + 1}
                              </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="flex-1 min-h-0">
                          <ScrollArea className="flex-1 min-h-0 px-2 py-2">
                            {testResults &&
                              testResults.map((res, i) => (
                                <TabsContent
                                  key={i}
                                  value={`test${i + 1}`}
                                  className="p-2 bg-[#1E1E1E] rounded-md"
                                >
                                  <p className="text-xs text-muted-foreground">
                                    Input
                                  </p>
                                  <pre className="bg-[#2E2E2E] p-2 rounded-md mb-2 text-sm">
                                    {res.input}
                                  </pre>
                                  <p className="text-xs text-muted-foreground">
                                    Expected
                                  </p>
                                  <pre className="bg-[#2E2E2E] p-2 rounded-md mb-2 text-sm">
                                    {res.expected}
                                  </pre>
                                  <p className="text-xs text-muted-foreground">
                                    Your Output
                                  </p>
                                  <pre className="bg-[#2E2E2E] p-2 rounded-md mb-2 text-sm">
                                    {res.output ?? "No output"}
                                  </pre>
                                </TabsContent>
                              ))}
                          </ScrollArea>
                        </div>
                      </Tabs>
                    ) : (problem?.examples?.length ?? 0) > 0 ? (
                      <Tabs
                        defaultValue="test1"
                        className="flex flex-col h-full min-h-0"
                      >
                        <TabsList className="mb-2 shrink-0">
                          {problem.examples?.map((_, i) => (
                            <TabsTrigger
                              key={i}
                              value={`test${i + 1}`}
                              className="text-sm"
                            >
                              Test {executing ? <SpinLoader /> : i + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        <div className="flex-1 min-h-0">
                          <ScrollArea className="flex-1 min-h-0 px-2 py-2">
                            {problem?.examples?.map((ex, i) => (
                              <TabsContent
                                key={i}
                                value={`test${i + 1}`}
                                className="p-2 bg-[#1E1E1E] rounded-md"
                              >
                                <p className="text-xs text-muted-foreground">
                                  Input
                                </p>
                                <pre className="bg-[#2E2E2E] p-2 rounded-md mb-2 text-sm">
                                  {ex.input}
                                </pre>
                                <p className="text-xs text-muted-foreground">
                                  Expected
                                </p>
                                <pre className="bg-[#2E2E2E] p-2 rounded-md mb-2 text-sm">
                                  {ex.output}
                                </pre>
                              </TabsContent>
                            ))}
                          </ScrollArea>
                        </div>
                      </Tabs>
                    ) : (
                      <div className="text-gray-400">
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
