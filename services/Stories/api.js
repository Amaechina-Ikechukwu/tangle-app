import { GeneralGet } from "../../apis/Get/General";
import { GeneralPost } from "../../apis/Post/General";

const GetProfile = async ({ token, body }) => {
  const profile = await GeneralPost("profile/user", token, body);
  return profile;
};
const GetStoryList = async ({ token }) => {
  const result = await GeneralGet("stories/getstorylists", token);
  return result;
};
const GetStories = async ({ token }) => {
  const result = await GeneralGet("stories/getstories", token);
  return result;
};
export { GetProfile, GetStoryList, GetStories };
