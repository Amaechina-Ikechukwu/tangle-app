import { GeneralGet } from "../../apis/Get/General";
import { GeneralPost } from "../../apis/Post/General";

const FeedbackAndSuggestion = async ({ token, body }) => {
  const profile = await GeneralPost(
    "accounts/feedbackandsuggestion",
    token,
    body
  );
  return profile;
};

const GetBlockedUsers = async ({ token }) => {
  const result = await GeneralGet("accounts/getblockedusers", token);
  return result;
};
export { FeedbackAndSuggestion, GetBlockedUsers };
