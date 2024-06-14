import { GeneralGet } from "../../apis/Get/General";
import { GeneralPost } from "../../apis/Post/General";
import { ChatList } from "../Chats/api";

///////////////////////////Get////////////////////////////////
const IsProfileComplete = async ({ token }) => {
  const result = await GeneralGet("profile/iscomplete", token);
  return result;
};
const IsProfileLikedByMe = async ({ token, matchid }) => {
  const { result } = await GeneralGet(
    `profile/isprofileliked?matchid=${matchid}`,
    token
  );
  return result;
};
const BlockedByMe = async ({ token, matchid }) => {
  const { result } = await GeneralGet(
    `profile/isuserblocked?matchid=${matchid}`,
    token
  );
  return result;
};
const GetProfileLikeCount = async ({ token, matchid }) => {
  const { result } = await GeneralGet(
    `profile/profilelikecount?matchid=${matchid}`,
    token
  );
  return result;
};

/////////Post////////////////////////
const GetProfile = async ({ token, body }) => {
  const profile = await GeneralPost("profile/user", token, body);
  return profile;
};
const BlockAction = async ({ token, body }) => {
  const { result } = await GeneralPost("profile/blockaction", token, body);
  if (result == "blocked") {
    return true;
  } else {
    return false;
  }
};
const LikeProfile = async ({ token, body }) => {
  const profile = await GeneralPost("profile/likeprofile", token, body);
  return profile;
};

const UpdateLocation = async ({ token, body }) => {
  const result = await GeneralPost("profile/updateL", token, body);
};

export {
  GetProfile,
  IsProfileComplete,
  UpdateLocation,
  LikeProfile,
  IsProfileLikedByMe,
  BlockAction,
  BlockedByMe,
  GetProfileLikeCount,
};
