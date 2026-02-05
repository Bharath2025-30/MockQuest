import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass, getDifficutyName } from "../../../lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ActiveSessions = (
  { sessions, isLoading, isUserInSession }
: any) => {
  return (
    <div className="col-span-1 lg:col-span-2 card bg-base-300 p-5 h-full">
      <div className="card-body">
        {/* HEADERS SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl text-black">
              <ZapIcon className="size-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-success rounded-full" />
            <span className="text-xs sm:text-sm font-medium text-success">
              {sessions.length} active
            </span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div
          className="space-y-3 max-h-[400px] overflow-y-auto pr-1 sm:pr-2 [scrollbar-width:none] [-ms-overflow-style:none] 
  [&::-webkit-scrollbar]:hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10 sm:py-20">
              <LoaderIcon className="size-8 sm:size-10 animate-spin text-brand" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session: any) => (
              <div
                key={session.id}
                className="card bg-base-100 border border-base-300 hover:border-brand/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div className="relative size-10 sm:size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Code2Icon className="size-5 sm:size-6 text-black" />
                      <div className="absolute -top-1 -right-1 size-3 sm:size-4 bg-success rounded-full border-2 border-base-100" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <h3 className="font-bold text-base sm:text-lg truncate">
                          {session.problemTitle.slice(0, 1)?.toUpperCase() +
                            session.problemTitle.slice(1)}
                        </h3>

                          <Badge
                            variant={getDifficultyBadgeClass(
                              getDifficutyName(session.problemDifficulty),
                            )}
                          >
                            {getDifficutyName(session.problemDifficulty)}
                          </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-80">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-3 sm:size-4" />
                          <span className="font-medium">
                            {session.host?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-3 sm:size-4" />
                          <span>{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <>
                      <Badge variant="destructive">FULL</Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        Full
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="info">OPEN</Badge>
                      <Link to={`/session/${session.id}`}>
                        <Button
                          size="sm"
                          variant={
                            isUserInSession(session) ? "outline" : "default"
                          }
                          className="flex items-center gap-2"
                        >
                          {isUserInSession(session) ? "Rejoin" : "Join"}
                          <ArrowRightIcon className="size-3 sm:size-4" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary/50" />
              </div>
              <p className="text-base sm:text-lg font-semibold opacity-70 mb-1">
                No active sessions
              </p>
              <p className="text-xs sm:text-sm opacity-50">
                Be the first to create one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;
