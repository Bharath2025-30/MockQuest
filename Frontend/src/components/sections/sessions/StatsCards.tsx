import { TrophyIcon, UsersIcon } from 'lucide-react'

const StatsCards = ({
  activeSessionsCount,
  recentSessionsCount
}: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:col-span-1">
      {/* Active Count */}
      <div className="card bg-base-100 p-4 sm:p-5">
        <div className="card-body">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl">
              <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="badge badge-primary text-xs sm:text-sm">Live</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mb-1">{activeSessionsCount}</div>
          <div className="text-xs sm:text-sm opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card bg-base-100 p-4 sm:p-5">
        <div className="card-body">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-secondary/10 rounded-xl sm:rounded-2xl">
              <TrophyIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mb-1">{recentSessionsCount}</div>
          <div className="text-xs sm:text-sm opacity-60">Total Sessions</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCards
