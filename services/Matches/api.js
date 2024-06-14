import { GeneralGet } from "../../apis/Get/General";

const GetMatches = async ({ token }) => {
  const result = await GeneralGet("matches/getmatches", token);
  return result;
};
export { GetMatches };
