import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProblemFormSchema,
  type CreateProblemFormDTO,
} from "@/features/problem/schemas/problemSchema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MonacoEditor from "@/features/problem/components/MonacoEditor";
import { Save, Trash2 } from "lucide-react";
import { DEFAULT_PROBLEM_TEMPLATE } from "@/features/problem/templates/defaultProblem";
import { useProblemStore } from "@/stores/problemStore";
import SpinLoader from "@/components/shared/SpinLoader";

const LANGS = ["JAVASCRIPT", "PYTHON", "CPP", "JAVA"] as const;

export default function CreateProblemPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateProblemFormDTO>({
    resolver: zodResolver(createProblemFormSchema),
    defaultValues: DEFAULT_PROBLEM_TEMPLATE,
  });

  const { createProblem } = useProblemStore();

  const onSubmit = async (data: CreateProblemFormDTO) => {
    console.log("FINAL PAYLOAD", data);
    await createProblem(data);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* Outer container: controls horizontal padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Card wrapper: controls max width */}
        <Card className="mx-auto w-full max-w-7xl">
          <CardContent className="p-6 sm:p-8 space-y-10">
            <header className="space-y-1">
              <h1 className="text-2xl font-bold">Create Problem</h1>
              <p className="text-muted-foreground">
                Define a new coding problem
              </p>
            </header>

            {/* BASIC INFO */}
            <section className="space-y-4">
              <h2 className="font-semibold">Basic Info</h2>

              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input {...register("slug")} />
              </div>

              <div className="grid gap-2">
                <Label>Title</Label>
                <Input {...register("title")} />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea {...register("description")} rows={5} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Difficulty</Label>
                  <select
                    className="border rounded-md bg-background px-3 py-2"
                    {...register("difficulty")}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label>Problem No</Label>
                  <Input
                    inputMode="numeric"
                    {...register("no", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </section>

            {/* TAGS */}
            <section className="space-y-4">
              <h2 className="font-semibold">Tags & Companies</h2>

              <Input
                placeholder="Tags (comma separated)"
                onChange={(e) =>
                  setValue(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim()),
                  )
                }
              />

              <Input
                placeholder="Companies (comma separated)"
                onChange={(e) =>
                  setValue(
                    "companies",
                    e.target.value.split(",").map((c) => c.trim()),
                  )
                }
              />
            </section>

            {/* METADATA */}
            <section className="space-y-4">
              <h2 className="font-semibold">Metadata</h2>

              <Input
                placeholder="Topics (comma separated)"
                onChange={(e) =>
                  setValue(
                    "metadata.topics",
                    e.target.value.split(",").map((t) => t.trim()),
                  )
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Time Complexity (e.g. O(n))"
                  {...register("metadata.timeComplexity")}
                />

                <Input
                  placeholder="Space Complexity (e.g. O(1))"
                  {...register("metadata.spaceComplexity")}
                />
              </div>
            </section>

            {/* EXAMPLES */}
            <section className="space-y-6">
              <h2 className="font-semibold text-lg">
                Examples (Visible to Users)
              </h2>
              <p className="text-muted-foreground text-sm">
                These examples are shown on the problem page to help users
                understand the problem.
              </p>

              {watch("examples").map((_, index) => (
                <div key={index} className="space-y-4 border rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Example {index + 1}
                    </span>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Input</Label>
                      <Textarea
                        rows={3}
                        {...register(`examples.${index}.input`)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Output</Label>
                      <Textarea
                        rows={3}
                        {...register(`examples.${index}.output`)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Explanation</Label>
                      <Textarea
                        rows={3}
                        {...register(`examples.${index}.explanation`)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("examples", [
                    ...watch("examples"),
                    { input: "", output: "", explanation: "" },
                  ])
                }
              >
                + Add Example
              </Button>
            </section>

            {/* TEST CASES */}
            <section className="space-y-6">
              <h2 className="font-semibold text-lg">Test Cases (Judge Only)</h2>
              <p className="text-muted-foreground text-sm">
                These test cases are used for evaluation. They are NOT visible
                to users.
              </p>

              {watch("testCases").map((_, index) => (
                <div key={index} className="space-y-4 border rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Test Case {index + 1}
                    </span>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Input</Label>
                      <Textarea
                        rows={3}
                        {...register(`testCases.${index}.input`)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Expected Output</Label>
                      <Textarea
                        rows={3}
                        {...register(`testCases.${index}.output`)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("testCases", [
                    ...watch("testCases"),
                    { input: "", output: "" },
                  ])
                }
              >
                + Add Test Case
              </Button>
            </section>

            {/* CODE EDITORS */}
            <section className="space-y-10">
              <h2 className="font-semibold text-lg">Code Templates</h2>
              <p className="text-muted-foreground text-sm">
                Define what the user sees, what the judge executes, and the
                internal reference solution for each language.
              </p>

              {LANGS.map((lang) => (
                <div
                  key={lang}
                  className="space-y-8 border rounded-lg p-4 sm:p-6"
                >
                  <h3 className="text-lg font-bold">{lang}</h3>

                  {/* STARTER CODE */}
                  <div className="space-y-2">
                    <div>
                      <Label className="text-base font-semibold">
                        Starter Code (Visible to User)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        This is the code template shown to users when they open
                        the problem.
                      </p>
                    </div>

                    <div className="h-56 sm:h-64 rounded-md border">
                      <MonacoEditor
                        language={lang}
                        value={watch(`starterCodes.${lang}`) || ""}
                        onChange={(v) => setValue(`starterCodes.${lang}`, v)}
                      />
                    </div>
                  </div>

                  {/* WRAPPER CODE */}
                  <div className="space-y-2">
                    <div>
                      <Label className="text-base font-semibold">
                        Wrapper Code (Execution Only)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        This code wraps the user submission and is executed by
                        the judge (Judge0). Users never see this.
                      </p>
                    </div>

                    <div className="h-56 sm:h-64 rounded-md border">
                      <MonacoEditor
                        language={lang}
                        value={watch(`wrapperCodes.${lang}`) || ""}
                        onChange={(v) => setValue(`wrapperCodes.${lang}`, v)}
                      />
                    </div>
                  </div>

                  {/* REFERENCE SOLUTION */}
                  <div className="space-y-2">
                    <div>
                      <Label className="text-base font-semibold">
                        Reference Solution (Internal)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Correct solution used internally for validation and
                        comparison. This is never exposed to users.
                      </p>
                    </div>

                    <div className="h-56 sm:h-64 rounded-md border">
                      <MonacoEditor
                        language={lang}
                        value={watch(`referenceSolutions.${lang}`) || ""}
                        onChange={(v) =>
                          setValue(`referenceSolutions.${lang}`, v)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:items-center">
              <Button
                type="button"
                variant="outline"
                className="gap-2 cursor-pointer"
                onClick={() => {
                  console.log("Discard clicked");
                }}
              >
                <Trash2 className="h-4 w-4" />
                Discard
              </Button>

              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <SpinLoader />
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Problem
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
