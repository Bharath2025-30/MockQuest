import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass, getDifficutyName } from "../../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const RecentSessions = ({ sessions, isLoading }: any) => {
  return (
    <div className="card bg-base-100 mt-6 sm:mt-8 p-5">
      <div className="card-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-accent to-secondary rounded-lg sm:rounded-xl">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-2 sm:mt-0">Your Past Sessions</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12 sm:py-20">
              <Loader className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
            </div>
          ) : sessions?.length > 0 ? (
            sessions.map((session: any) => (
              <div
                key={session.id}
                className={`card relative transition hover:shadow-md ${
                  session.status === "active"
                    ? "bg-success/10 border-success/30 hover:border-success/60"
                    : "bg-base-200 border-base-300 hover:border-primary/30"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <div className="badge badge-success gap-1 text-xs sm:text-sm">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-success rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="card-body p-4 sm:p-5">
                  {/* Top section */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${
                        session.status === "active"
                          ? "bg-gradient-to-br from-success to-success/70"
                          : "bg-gradient-to-br from-primary to-secondary"
                      }`}
                    >
                      <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base mb-1 truncate">
                        {session.problemTitle}
                      </h3>
                      <Badge
                          variant={getDifficultyBadgeClass(
                            getDifficutyName(session.problemDifficulty),
                          )}
                        >
                          {getDifficutyName(session.problemDifficulty)}
                        </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-base-300">
                    <span className="text-[10px] sm:text-xs font-semibold opacity-80 uppercase">
                      Completed
                    </span>
                    <span className="text-[10px] sm:text-xs opacity-40">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-accent/50" />
              </div>
              <p className="text-base sm:text-lg font-semibold opacity-70 mb-1">No sessions yet</p>
              <p className="text-xs sm:text-sm opacity-50">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentSessions;
