import {
  ArrowRightIcon,
  ChevronRightIcon,
  Code2Icon,
} from "lucide-react";
import { PROBLEMS } from "../../data/Problems";
import { getDifficultyBadgeClass } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import Stats from "../sections/stats/default";
import Glow from "../ui/glow";
import { Link } from "react-router-dom";



const problems = Object.values(PROBLEMS);

const easyProblemsCount = problems.filter(
  (p) => p.difficulty === "Easy",
).length;
const mediumProblemsCount = problems.filter(
  (p) => p.difficulty === "Medium",
).length;
const hardProblemsCount = problems.filter(
  (p) => p.difficulty === "Hard",
).length;

export default function Problems({
  title = "Practice Problems",
  description = "Sharpen your coding skills with these currated problems",
  badge = (
    <Badge variant="outline" className="animate-appear">
      <span className="text-card-foreground">Grind Hard</span>
      <ArrowRightIcon className="size-3" />
    </Badge>
  ),
}: any) {
  return (
    <div className="relative w-full">
      <Glow
        variant="topCorner"
        className="animate-appear-zoom opacity-0 delay-1000 "
      />
      <div className="max-w-container mx-auto flex flex-col gap-4 sm:gap-8 fade-bottom pt-8">
        <div className="flex flex-col items-center text-center">
          {badge !== false && badge}
        </div>

        <div className="flex flex-col items-center gap-4 text-center sm:gap-8">
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-2xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-4xl sm:leading-tight md:text-6xl md:leading-tight">
            {title}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text">
            {description}
          </p>
          <div className="flex flex-col md:flex-row w-full border-red-500">
            {/* Left column */}
            <div className="flex w-full md:w-[80%] flex-col gap-6">
              {problems.map((problem) => (
                <Item key={problem.id} variant="muted">
                  <ItemMedia variant="icon">
                    <Code2Icon className="size-6 text-white" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="flex items-center gap-2 text-xl font-semibold text-white">
                      {problem.title}
                      <Badge
                        variant={getDifficultyBadgeClass(problem.difficulty)}
                      >
                        {problem.difficulty}
                      </Badge>
                    </ItemTitle>
                    <ItemDescription className="text-sm text-muted-foreground">
                      {problem.category}
                    </ItemDescription>
                    <ItemDescription className="text-slate-100">
                      {problem.description.text}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Link to={`/problems/${problem.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        Solve
                        <ChevronRightIcon className="size-4" />
                      </Button>
                    </Link>
                  </ItemActions>
                </Item>
              ))}
            </div>

            {/* Right column */}
            <div className="w-full md:w-[20%] md:mt-0">
              <Stats
                items={[
                  {
                    label: "Easy",
                    value: easyProblemsCount,
                  },
                  {
                    label: "Medium",
                    value: mediumProblemsCount,
                  },
                  {
                    label: "Hard",
                    value: hardProblemsCount,
                    suffix: "",
                  },
                ]}
              />
            </div>
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}
