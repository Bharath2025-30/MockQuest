import { useActiveSessions, useCreateSession, useMyRecentSessions } from "@/hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import WelcomeSection from "../sections/sessions/WelcomeSection";
import CreateSessionModal from "../sections/sessions/CreateSessionModal";
import StatsCards from "../sections/sessions/StatsCards";
import ActiveSessions from "../sections/sessions/ActiveSessions";
import RecentSessions from "../sections/sessions/RecentSessions";


const Dashboard = () => {

  const navigate = useNavigate();
  const {isSignedIn , user} = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({problem: "", difficulty: ""});

  // State to track userId from sessionStorage
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("userId"));
  const [isUserIdReady, setIsUserIdReady] = useState(false);

  // Poll sessionStorage until userId is available
  useEffect(() => {
    const checkUserId = () => {
      const storedUserId = sessionStorage.getItem("userId");
      
      if (storedUserId) {
        setUserId(storedUserId);
        setIsUserIdReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkUserId()) return;

    // If not found, poll every 100ms for up to 10 seconds
    const pollInterval = setInterval(() => {
      if (checkUserId()) {
        clearInterval(pollInterval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if(!isUserIdReady) console.error("userId not found in sessionStorage after 10 seconds");
      setIsUserIdReady(true); // Set to true anyway to prevent infinite loading
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, []);


  const createSessionMutation = useCreateSession();
  const {data: activeSessionsData,isLoading: loadingActiveSessions} = useActiveSessions();
  const {data: recentSessionData, isLoading: loadingRecentSessions} = useMyRecentSessions(userId ?? "");

  // console.log("Dashboard - userId:", userId);
  // console.log("Dashboard - isUserIdReady:", isUserIdReady);
  // console.log("Dashboard - activeSessionsData:", activeSessionsData);
  // console.log("Dashboard - recentSessionData:", recentSessionData);

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
        navigate(`/session/${data.session.id}`);
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

    // Show loading state while waiting for userId
    if (!isUserIdReady) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

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
