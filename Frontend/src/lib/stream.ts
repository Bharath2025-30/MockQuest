import { StreamVideoClient } from "@stream-io/video-react-sdk";

const apiKey = import.meta.env.VITE_STREAM_API_KEY as string | undefined;

let client: StreamVideoClient | null = null;


export const initializeStreamClient = async (
  user: any,
  token: string
) => {
  // Reuse existing client if it's already initialized for the same user
  if (client && (client as any)?.user?.id === user.id) {
    return client;
  }

  if (!apiKey) {
    throw new Error("Stream API Key not found");
  }

  // Create new client
  client = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  return client;
};


export const disconnectStreamClient = async (): Promise<void> => {
  if (!client) return;

  try {
    await client.disconnectUser();
    client = null;
  } catch (error) {
    console.error("Error disconnecting stream client:", error);
  }
};
