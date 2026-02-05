import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat"
import toast from "react-hot-toast"
import { initializeStreamClient, disconnectStreamClient } from "@/lib/stream";
import { sessionApi } from "@/api/sessions";
import { SessionStatus } from "@/lib/utils";

function useStreamClient(session:any, loadingSession: boolean, isHost:boolean, isPartcipant:boolean) {
  const [streamClient, setStreamClient] = useState<any | null>(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall: any = null;
    let chatClientInstance: any = null;
    const initCall = async () => {
        if(!session?.callId) return;
        if(!isHost && !isPartcipant) return;
        if(session.status === SessionStatus.Completed) return;

        try {
            const clerkId = sessionStorage.getItem("clerkId") ?? "";
            const {token,userId,userName,userImage} = await sessionApi.getStreamToken(clerkId);
            
            const client = await initializeStreamClient({
                id:userId,
                name:userName,
                image:userImage
            }, token);

            setStreamClient(client);
            videoCall = client.call("default", session.callId);
            await videoCall.join({create:true});
            setCall(videoCall);

            const apiKey =import.meta.env.VITE_STREAM_API_KEY;
            chatClientInstance = StreamChat.getInstance(apiKey);
            
            await chatClientInstance.connectUser(
                {
                    id:userId,
                    name:userName,
                    image:userImage
                },
                token
            )

            setChatClient(chatClientInstance);

            const chatChannel = chatClientInstance.channel("messaging", session.callId);
            await chatChannel.watch();
            setChannel(chatChannel);



        } catch (error) {
            console.error("Failed to join video call: ", error );
            toast.error("Failed to join video call");
        }
        finally{
            setIsInitializingCall(false);
        }
    }

    if(session && !loadingSession) initCall();

    // IIFE function which calls once on its own
    return () => {
        (async () =>{
            try{
                if(videoCall) await videoCall.leave();
                if(chatClientInstance) await chatClientInstance.disconnectUser();
                await disconnectStreamClient();
            }
            catch(error){
                console.error("Cleaup Error: ", error);
            }
        })();
    };

  },[session, loadingSession, isHost, isPartcipant])

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall
  }
}

export default useStreamClient
