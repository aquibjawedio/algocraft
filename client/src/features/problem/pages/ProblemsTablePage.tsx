import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { useProblemStore } from "@/stores/problemStore";
import SpinLoader from "@/components/shared/SpinLoader";
import { useEffect } from "react";

const difficultyColors = {
  EASY: "text-green-500",
  MEDIUM: "text-yellow-500",
  HARD: "text-red-500",
};

const ProblemsTablePage = () => {
  const { problems, getAllProblems, isLoading } = useProblemStore();

  useEffect(() => {
    if (problems === null) {
      getAllProblems();
    }
  }, [getAllProblems, problems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Problems</h1>
      <div className="rounded-lg border border-border bg-muted/50 backdrop-blur-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-center">✓</TableHead>
              <TableHead className="w-10 text-center">
                <Hash size={16} className="mx-auto text-muted-foreground" />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="w-20 text-center">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems?.map((problem) => (
              <TableRow
                key={problem.no}
                className="transition-all hover:bg-accent/50"
              >
                <TableCell className="text-center">
                  {problem ? (
                    <Check
                      size={16}
                      className="mx-auto text-green-500 dark:text-green-400"
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/40 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="font-medium text-center text-foreground">
                  {problem.no}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="text-primary hover:underline"
                  >
                    {problem.title}
                  </Link>
                </TableCell>
                <TableCell
                  className={`${
                    difficultyColors[problem.difficulty]
                  } font-medium`}
                >
                  {problem.difficulty}
                </TableCell>
                <TableCell className="text-center">
                  <a
                    href={problem.originalSource?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center group"
                  >
                    <Badge
                      variant="outline"
                      className="rounded-full p-1 border-border group-hover:bg-accent/50 transition"
                    >
                      <img
                        src={problem.originalSource?.logo}
                        alt={problem.originalSource?.name}
                        className="w-5 h-5 rounded-full"
                      />
                    </Badge>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProblemsTablePage;
