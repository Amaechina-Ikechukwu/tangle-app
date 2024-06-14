import { GeneralGet } from "../../apis/Get/General";
import { GeneralPatch } from "../../apis/Patch/General";

const GetNotifications = async ({ token }) => {
  const result = await GeneralGet("notifications/getnotifications", token);
  return result;
};
const SeenNotifications = async ({ token, notificationid }) => {
  const result = await GeneralPatch(
    `notifications/seennotifications?notificationid=${notificationid}`,
    token
  );
  return result;
};
export { GetNotifications, SeenNotifications };
