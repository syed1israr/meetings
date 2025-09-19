import "server-only"
import { StreamChat } from "stream-chat"

const { NEXT_PUBLIC_STREAM_CHAT_API_KEY, STREAM_CHAT_SECRET_KEY } = process.env;
if (!NEXT_PUBLIC_STREAM_CHAT_API_KEY || !STREAM_CHAT_SECRET_KEY) {
  throw new Error("Stream Chat env vars are missing – check .env.* files");
}

export const streamChat = StreamChat.getInstance(
  NEXT_PUBLIC_STREAM_CHAT_API_KEY,
  STREAM_CHAT_SECRET_KEY,
);