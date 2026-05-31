import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  replySuggestions: [],
  isLoadingSuggestions: false,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser, replySuggestions: [] }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // replace optimistic message with real one from server
      set({
        messages: get().messages.map((m) => (m._id === tempId ? res.data : m)),
      });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // remove existing listener before adding to avoid stacking duplicates
    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // uses the free Anthropic Claude API baked into this chat interface for suggestions
  getReplySuggestions: async () => {
    const { messages, selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (messages.length === 0) {
      toast.error("No messages to analyse yet");
      return;
    }

    set({ isLoadingSuggestions: true, replySuggestions: [] });

    try {
      // build a readable transcript of the last 20 messages for the AI to analyse
      const transcript = messages
        .slice(-20)
        .map((msg) => {
          const senderName =
            msg.senderId?.toString() === authUser._id?.toString() ? "Me" : selectedUser.fullName;
          return `${senderName}: ${msg.text || "[image]"}`;
        })
        .join("\n");

      const res = await axiosInstance.post("/messages/reply-suggestions", { transcript });
      set({ replySuggestions: res.data.suggestions });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not get suggestions");
    } finally {
      set({ isLoadingSuggestions: false });
    }
  },

  clearReplySuggestions: () => set({ replySuggestions: [] }),
}));

export default useChatStore;
