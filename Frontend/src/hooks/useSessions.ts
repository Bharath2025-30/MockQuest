import { useQuery, useMutation,  } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { sessionApi } from "../api/sessions"

export const useCreateSession = () =>{
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: sessionApi.CreateSession,
        onSuccess: () => toast.success("Session created successfully"),
        onError: (error) => {toast.error(error.message || "Failed tp create room")}
    });

    return result;
}

export const useActiveSessions = () => {
    const result = useQuery({
        queryKey: ["activeSessions"],
        queryFn: sessionApi.getActiveSessions
    });

    return result;
};


export const useMyRecentSessions = (userId:string) => {
    const result = useQuery({
        queryKey: ["myRecentSession", userId],
        queryFn: () => sessionApi.getMyRecentSessions(userId),
        enabled: !!userId,
    });

    return result;
};

export const useSessionById = (id: string) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => toast.error(error.message || "Failed to end session"),
  });

  return result;
};

export const useUserDetails = (clerkId: string) => {
    const result = useQuery({
    queryKey: ["userDetails", clerkId],
    queryFn: () => sessionApi.getUserDetails(clerkId),
    enabled: !!clerkId && clerkId !== "",  // ✅ Only run when clerkId exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

    return result;
};