import { GeneralGet } from "../../apis/Get/General";
import { GeneralPost } from "../../apis/Post/General";

const InitializeDm = async ({ token, body }) => {
  const result = await GeneralPost("chats/initializedm", token, body);
  return result;
};
const UnLikePost = async ({ token, body }) => {
  const result = await GeneralPost("posts/unlikepost", token, body);
  return result;
};
const LikePost = async ({ token, body }) => {
  const result = await GeneralPost("posts/likepost", token, body);
  return result;
};
const GetPosts = async ({ token }) => {
  const result = await GeneralGet("posts/getposts", token);
  return result;
};
const GetLikeCount = async ({ token, postid }) => {
  const result = await GeneralGet(`posts/likecount?postid=${postid}`, token);
  return result;
};
export { InitializeDm, LikePost, GetPosts, UnLikePost, GetLikeCount };
