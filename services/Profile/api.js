import { GeneralGet } from "../../apis/Get/General";
import { GeneralPost } from "../../apis/Post/General";

const GetProfile = async ({ token, body }) => {
  const profile = await GeneralPost("profile/user", token, body);
  return profile;
};
const IsProfileComplete = async ({ token }) => {
  const result = await GeneralGet("profile/iscomplete", token);
};
export { GetProfile, IsProfileComplete };
