import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import ReplySuggestions from "./ReplySuggestions";
import MessageBubble from "./MessageBubble";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [prefillText, setPrefillText] = useState("");

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-6 py-8 min-h-0">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isMine = msg.senderId?.toString() === authUser._id?.toString();
              return (
                <div key={msg._id} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                  <MessageBubble msg={msg} isMine={isMine} />
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <ReplySuggestions onSelectSuggestion={(text) => setPrefillText(text)} />
      <MessageInput prefillText={prefillText} onPrefillConsumed={() => setPrefillText("")} />
    </div>
  );
}

export default ChatContainer;