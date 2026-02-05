import { useActiveSessions, useCreateSession, useMyRecentSessions } from "@/hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router"
import WelcomeSection from "../sections/sessions/WelcomeSection";
import CreateSessionModal from "../sections/sessions/CreateSessionModal";
import StatsCards from "../sections/sessions/StatsCards";
import ActiveSessions from "../sections/sessions/ActiveSessions";
import RecentSessions from "../sections/sessions/RecentSessions";


const Dashboard = () => {

  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const {isSignedIn , user} = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({problem: "", difficulty: ""});

  const createSessionMutation = useCreateSession();
  const {data: activeSessionsData,isLoading: loadingActiveSessions} = useActiveSessions();
  const {data: recentSessionData, isLoading: loadingRecentSessions} = useMyRecentSessions(userId ?? "");

  console.log(activeSessionsData)
  console.log(recentSessionData)  
  const activeSessions = activeSessionsData || [];
  const recentSessions = recentSessionData || [];

  // Functions

  const handleCreateSession = () => {
    if(!isSignedIn || !roomConfig.problem) return;

    createSessionMutation.mutate({
      problemTitle: roomConfig.problem,
      problemdDifficulty: roomConfig.difficulty,
      userId: userId,
      clerkId: user?.id
    },
    {
      onSuccess: (data) => {
        setShowCreateModal(false);  // Close only on success
        navigate(`session/${data.session.id}`);
      },
      onError: (error) => {
        // Modal stays open, optionally show error toast
        console.error(error);
      }
    });
  }

    const isUserInSession = (session: any) => {
    if (!user?.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)}/>

          {/* Grid Layout */}
          <div className="container mx-auto px-6 pb-16 mt-7">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <StatsCards 
                activeSessionsCount = {activeSessions.length}
                recentSessionsCount = {recentSessions.length}
              />
              <ActiveSessions
                sessions={activeSessions}
                isLoading={loadingActiveSessions}
                isUserInSession={isUserInSession}
              />
            </div>

            <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
          </div>
      </div>

      <CreateSessionModal
        isOpen = {showCreateModal}
        onClose = {() => setShowCreateModal(false)}
        roomConfig = {roomConfig}
        setRoomConfig = {setRoomConfig}
        onCreateSession = {handleCreateSession}
        isCreating = {createSessionMutation.isPending}
      />
    </>
  )
}

export default Dashboard
