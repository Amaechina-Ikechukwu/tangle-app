import { auth } from "../firebase";

const currentUser = auth?.currentUser?.uid;
export { currentUser };
