import { GeneralGet } from "../../apis/Get/General";
import { GeneralPost } from "../../apis/Post/General";

const InitializeDm = async ({ token, body }) => {
  const result = await GeneralPost("chats/initializedm", token, body);
  return result;
};
const SendMessage = async ({ token, body }) => {
  const result = await GeneralPost("chats/senddm", token, body);
  return result;
};
const ChatList = async ({ token }) => {
  const result = await GeneralGet("chats/chatlist", token);
  return result;
};
export { InitializeDm, SendMessage, ChatList };
