import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY as string | undefined;

interface ClientState {
  client: StreamVideoClient;
  userId: string;
  token: string;
}

let clientState: ClientState | null = null;

export const initializeStreamClient = async (
  user: any,
  token: string
) => {
  // Reuse existing client if same user and token
  if (clientState?.userId === user.id && clientState?.token === token) {
    // console.log("✅ Reusing existing Stream client for user:", user.id);
    return clientState.client;
  }

  // Disconnect if different user
  if (clientState) {
    // console.log("⚠️ Disconnecting previous user:", clientState.userId);
    await disconnectStreamClient();
  }

  if (!apiKey) {
    throw new Error("Stream API Key not found");
  }

  // console.log("🔄 Initializing new Stream client for user:", user.id);
  
  const newClient = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  clientState = {
    client: newClient,
    userId: user.id,
    token,
  };

  // console.log("✅ Stream client initialized for user:", user.id);
  return newClient;
};

export const disconnectStreamClient = async (): Promise<void> => {
  if (!clientState) {
    // console.log("ℹ️ No client to disconnect");
    return;
  }

  const userId = clientState.userId;
  
  try {
    // console.log("🔄 Disconnecting Stream client for user:", userId);
    await clientState.client.disconnectUser();
    // console.log("✅ Successfully disconnected user:", userId);
  } catch (error) {
    // console.error("❌ Error disconnecting stream client:", error);
  } finally {
    // Always reset state, even if disconnect fails
    clientState = null;
    // console.log("✅ Client state reset");
  }
};

export const getStreamClient = (): StreamVideoClient | null => {
  return clientState?.client ?? null;
};

export const getCurrentUserId = (): string | null => {
  return clientState?.userId ?? null;
};