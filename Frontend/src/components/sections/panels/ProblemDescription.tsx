import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Problem } from "@/data/Problems";
import { getDifficultyBadgeClass } from "@/lib/utils";

type ProblemDescriptionProps = {
  problem: Problem;
  currentProblemId: string;
  onProblemChange: (problemId: string) => void;
  allProblems: Problem[];
};

const ProblemDescription = ({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}: ProblemDescriptionProps) => {
  return (
    <div className="h-full overflow-y-auto bg-background [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* HEADER SECTION */}
      <div className="p-6 bg-background border-base-300">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow-xl z-10">
            {problem.title}
          </h1>
          <Badge variant={getDifficultyBadgeClass(problem.difficulty)} className="text-sm flex items-center justify-center">
            {problem.difficulty}
          </Badge>
        </div>
        <p className="text-sm sm:text-base md:text-base text-brand relative z-10 text-balance delay-100 ml-2">
          {problem.category}
        </p>

        <div className="mt-5 w-full bg-background">
          <Select
            value={currentProblemId}
            onValueChange={(value) => onProblemChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a problem" />
            </SelectTrigger>
            <SelectContent side="bottom" avoidCollisions={false} position="popper">
              <SelectGroup>
                {allProblems.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-2 space-y-6">
        {/* PROBLEM DESC */}
        <div className="fade-top bg-background backdrop-blur-lg bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-base sm:text-base md:text-xl lg:text-2xl font-bold text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow mb-3">
            Description
          </h2>
          <div className="space-y-3 text-sm sm:text-sm md:text-sm leading-relaxed text-secondary-foreground">
            <p className="text-base-content/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-base-content/90">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="fade-right bg-background backdrop-blur-lg bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow">
            Examples
          </h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-sm sm:text-base md:text-base text-base-content">
                    Example {idx + 1}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-4 font-mono text-xs sm:text-sm md:text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-[70px]">
                      Input:
                    </span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-brand font-bold min-w-[70px]">
                      Output:
                    </span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-base-300 mt-2 text-gray-500">
                      <span className="text-base-content/60 font-sans text-xs sm:text-sm">
                        <span className="font-semibold">Explanation:</span>{" "}
                        {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="fade-bottom bg-background backdrop-blur-lg bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow">
            Constraints
          </h2>
          <ul className="space-y-2 text-sm sm:text-base md:text-sm text-base-content/90">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <code>{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
