import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "@/lib/stream";
import { sessionApi } from "@/api/sessions";
import { SessionStatus } from "@/lib/utils";

function useStreamClient(
  session: any,
  loadingSession: boolean,
  isHost: boolean,
  isParticipant: boolean
) {
  const [streamClient, setStreamClient] = useState<any | null>(null);
  const [call, setCall] = useState<any>(null);
  const [chatClient, setChatClient] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // Use refs to track current instances for cleanup
  const videoCallRef = useRef<any>(null);
  const chatClientRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const streamClientRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const initializedSessionIdRef = useRef<string | null>(null);
  const isCleaningUpRef = useRef(false);
  const hasLeftCallRef = useRef(false);
  const cleanupPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    let abortInit = false;

    const initCall = async () => {
      // Prevent initialization if conditions aren't met
      if (!session?.callId) {
        setIsInitializingCall(false);
        return;
      }

      if (!isHost && !isParticipant) {
        setIsInitializingCall(false);
        return;
      }

      if (session.status === SessionStatus.Completed) {
        setIsInitializingCall(false);
        return;
      }

      // Prevent re-initialization for the same session
      if (initializedSessionIdRef.current === session.id) {
        console.info("⚠️ Session already initialized, skipping...");
        setIsInitializingCall(false);
        return;
      }

      // Wait for any ongoing cleanup to complete
      if (cleanupPromiseRef.current) {
        console.info("⏳ Waiting for previous cleanup to complete...");
        try {
          await cleanupPromiseRef.current;
        } catch (error) {
          console.error("Error waiting for cleanup:", error);
        }
      }

      // Cleanup previous session if switching sessions
      if (initializedSessionIdRef.current && initializedSessionIdRef.current !== session.id) {
        console.info("🔄 Switching sessions, cleaning up previous session...");
        await cleanupResources();
      }

      // Check if we should abort (component unmounted during wait)
      if (!isMountedRef.current || abortInit) {
        console.info("⚠️ Aborting initialization...");
        return;
      }

      try {
        setIsInitializingCall(true);
        console.info("🔄 Initializing call for session:", session.id);

        const clerkId = sessionStorage.getItem("clerkId") ?? "";
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken(clerkId);

        if (!isMountedRef.current || abortInit) {
          console.info("⚠️ Component unmounted during token fetch, aborting...");
          return;
        }

        // Initialize Stream Video Client
        console.info("🔄 Initializing stream client for user:", userId);
        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (!isMountedRef.current || abortInit) {
          console.info("⚠️ Aborting after client init");
          await disconnectStreamClient();
          return;
        }

        streamClientRef.current = client;
        setStreamClient(client);
        console.info("✅ Stream video client initialized");

        // Join video call
        console.info("🔄 Joining call:", session.callId);
        const videoCall = client.call("default", session.callId);
        await videoCall.join({ create: isHost });
        
        if (!isMountedRef.current || abortInit) {
          console.info("⚠️ Aborting after call join");
          await safeLeaveCall(videoCall);
          await disconnectStreamClient();
          return;
        }

        videoCallRef.current = videoCall;
        hasLeftCallRef.current = false;
        setCall(videoCall);
        console.info("✅ Joined video call:", session.callId);

        // Initialize Stream Chat
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        console.info("🔄 Connecting chat client for user:", userId);
        const chatInstance = StreamChat.getInstance(apiKey);

        await chatInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (!isMountedRef.current || abortInit) {
          console.info("⚠️ Aborting after chat connect");
          await safeDisconnectChat(chatInstance);
          await safeLeaveCall(videoCall);
          await disconnectStreamClient();
          return;
        }

        chatClientRef.current = chatInstance;
        setChatClient(chatInstance);
        console.info("✅ Chat client connected");

        // Create/watch chat channel
        console.info("🔄 Setting up chat channel:", session.callId);
        const chatChannel = chatInstance.channel("messaging", session.callId);
        await chatChannel.watch();

        if (!isMountedRef.current || abortInit) {
          console.info("⚠️ Aborting after channel watch");
          await safeStopWatching(chatChannel);
          await safeDisconnectChat(chatInstance);
          await safeLeaveCall(videoCall);
          await disconnectStreamClient();
          return;
        }

        channelRef.current = chatChannel;
        setChannel(chatChannel);
        console.info("✅ Chat channel initialized");

        // Mark this session as initialized
        initializedSessionIdRef.current = session.id;
        console.info("✅ Session fully initialized:", session.id);
      } catch (error) {
        console.error("❌ Failed to initialize call:", error);
        toast.error("Failed to join video call");
        
        // Cleanup on error
        await cleanupResources();
      } finally {
        if (isMountedRef.current) {
          setIsInitializingCall(false);
        }
      }
    };

    // Safe leave call helper
    const safeLeaveCall = async (callInstance: any) => {
      if (!callInstance) return;
      
      // Use the ref if available, otherwise use the passed instance
      const callToLeave = callInstance === videoCallRef.current ? videoCallRef.current : callInstance;
      
      if (hasLeftCallRef.current && callInstance === videoCallRef.current) {
        console.info("ℹ️ Call already left (via ref), skipping...");
        return;
      }
      
      try {
        console.info("🔄 Leaving video call...");
        await callToLeave.leave();
        if (callInstance === videoCallRef.current) {
          hasLeftCallRef.current = true;
        }
        console.info("✅ Video call left");
      } catch (error: any) {
        if (error?.message?.includes("already been left") || error?.message?.includes("already left")) {
          console.info("ℹ️ Call already left, skipping...");
          if (callInstance === videoCallRef.current) {
            hasLeftCallRef.current = true;
          }
        } else {
          console.error("❌ Error leaving call:", error);
        }
      }
    };

    // Safe stop watching channel helper
    const safeStopWatching = async (channelInstance: any) => {
      if (!channelInstance) return;
      
      try {
        console.info("🔄 Stopping channel watch...");
        await channelInstance.stopWatching();
        console.info("✅ Channel stopped");
      } catch (error) {
        console.error("❌ Error stopping channel:", error);
      }
    };

    // Safe disconnect chat helper
    const safeDisconnectChat = async (chatInstance: any) => {
      if (!chatInstance) return;
      
      try {
        console.info("🔄 Disconnecting chat client...");
        await chatInstance.disconnectUser();
        console.info("✅ Chat client disconnected");
      } catch (error) {
        console.error("❌ Error disconnecting chat:", error);
      }
    };

    const cleanupResources = async () => {
      if (isCleaningUpRef.current) {
        console.info("⚠️ Cleanup already in progress, returning existing promise...");
        return cleanupPromiseRef.current;
      }

      isCleaningUpRef.current = true;
      console.info("🧹 Starting cleanup for session:", initializedSessionIdRef.current);

      const cleanupPromise = (async () => {
        try {
          // Leave video call first
          if (videoCallRef.current) {
            await safeLeaveCall(videoCallRef.current);
            videoCallRef.current = null;
          }

          // Stop watching channel
          if (channelRef.current) {
            await safeStopWatching(channelRef.current);
            channelRef.current = null;
          }

          // Disconnect chat client
          if (chatClientRef.current) {
            await safeDisconnectChat(chatClientRef.current);
            chatClientRef.current = null;
          }

          // Disconnect stream client
          if (streamClientRef.current) {
            console.info("🔄 Disconnecting stream client...");
            await disconnectStreamClient();
            streamClientRef.current = null;
            console.info("✅ Stream client disconnected");
          }

          // Reset all state
          if (isMountedRef.current) {
            setStreamClient(null);
            setCall(null);
            setChatClient(null);
            setChannel(null);
          }

          // Reset tracking variables
          initializedSessionIdRef.current = null;
          hasLeftCallRef.current = false;
          console.info("✅ Cleanup completed");
        } catch (error) {
          console.error("❌ Error during cleanup:", error);
        } finally {
          isCleaningUpRef.current = false;
          cleanupPromiseRef.current = null;
        }
      })();

      cleanupPromiseRef.current = cleanupPromise;
      return cleanupPromise;
    };

    if (session && !loadingSession) {
      initCall();
    }

    // Cleanup function
    return () => {
      console.info("🔴 Component unmounting, cleaning up...");
      isMountedRef.current = false;
      abortInit = true;
      cleanupResources();
    };
  }, [session?.id, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;