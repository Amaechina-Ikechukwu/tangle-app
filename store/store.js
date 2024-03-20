import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { GetLocalData } from "../services/Storage";
const user = GetLocalData({ key: "user" });
const useStore = create((set) => ({
  matches: [],
  currentUser: null,
  chattingWith: null,
  chatList: [],
  posts: [],
  setMatches: (matches) => set((state) => ({ matches: matches })),
  setCurrentUser: (user) => set((state) => ({ currentUser: user })),
  setChattingWith: (chat) => set((state) => ({ chattingWith: chat })),
  setChatList: (chatlist) => set((state) => ({ chatList: chatlist })),
  setPosts: (posts) => set((state) => ({ posts: posts })),
  setClearAll: () =>
    set((state) => ({
      matches: null,
      currentUser: null,
      chattingWith: null,
      chatList: [],
      posts: [],
    })),
}));

export { useStore };