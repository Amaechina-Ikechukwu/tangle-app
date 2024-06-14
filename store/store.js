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
  storyList: [],
  stories: null,
  recording: null,
  isRecording: false,
  totalUnread: 0,
  location: null,
  notifications: [],
  isprofilecomplete: true,
  isEmailVerified: true,
  settings: {},
  blockedUsers: [],
  storyLength: null,
  initializeEmailChange: false,
  initializePasswordChange: false,
  setMatches: (matches) => set((state) => ({ matches: matches })),
  setCurrentUser: (user) => set((state) => ({ currentUser: user })),
  setChattingWith: (chat) => set((state) => ({ chattingWith: chat })),
  setChatList: (chatlist) => set((state) => ({ chatList: chatlist })),
  setStoryList: (storylist) => set((state) => ({ storyList: storylist })),
  setStories: (stories) => set((state) => ({ stories: stories })),
  setPosts: (posts) => set((state) => ({ posts: posts })),
  setRecording: (recording) => set((state) => ({ recording: recording })),
  setIsRecording: (isRecording) =>
    set((state) => ({ isRecording: isRecording })),
  setLocation: (location) => set((state) => ({ location: location })),
  setisprofilecomplete: (complete) =>
    set((state) => ({ isprofilecomplete: complete })),
  setIsEmailVerified: (verified) =>
    set((state) => ({ isEmailVerified: verified })),

  setTotalUnread: (unread) => set(() => ({ totalUnread: unread })),
  setNotifications: (notifications) =>
    set(() => ({ notifications: notifications })),
  setBlockedUsers: (blockedUsers) =>
    set(() => ({ blockedUsers: blockedUsers })),
  setInitializeEmailChange: (initialize) =>
    set(() => ({ initializeEmailChange: initialize })),
  setInitializePasswordChange: (initialize) =>
    set(() => ({ initializePasswordChange: initialize })),
  setStoryLength: (storyLength) => set(() => ({ storyLength: storyLength })),
  setSettings: (key, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    })),

  setClearAll: () =>
    set((state) => ({
      matches: null,
      currentUser: null,
      chattingWith: null,
      chatList: [],
      posts: [],
      notifications: [],
    })),
}));

export { useStore };
