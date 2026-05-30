import { useState } from "react";
import { BotIcon, XIcon, SaveIcon } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

function AutoReplySettings() {
  const { authUser, updateAutoReply } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState(
    authUser?.autoReply?.message || "Hey! I'm currently unavailable. I'll get back to you soon."
  );

  const isEnabled = authUser?.autoReply?.isEnabled || false;

  const handleToggle = () => {
    updateAutoReply({ isEnabled: !isEnabled, message: draftMessage });
  };

  const handleSaveMessage = () => {
    if (!draftMessage.trim()) return;
    updateAutoReply({ isEnabled, message: draftMessage.trim() });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* trigger button - matches ProfileHeader button style */}
      <button
        className={`text-slate-400 hover:text-slate-200 transition-colors ${
          isEnabled ? "text-cyan-400 hover:text-cyan-300" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="Auto-reply settings"
      >
        <BotIcon className="size-5" />
      </button>

      {/* dropdown panel */}
      {isOpen && (
        <div className="absolute top-8 right-0 z-50 w-72 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl p-4">
          {/* header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BotIcon className="size-4 text-cyan-400" />
              <span className="text-slate-200 text-sm font-medium">Auto-Reply</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          {/* toggle row */}
          <div className="flex items-center justify-between mb-4 p-3 bg-slate-700/40 rounded-lg">
            <div>
              <p className="text-slate-200 text-sm">
                {isEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-slate-500 text-xs">
                {isEnabled ? "Auto-replies when you're offline" : "Won't auto-reply"}
              </p>
            </div>
            {/* toggle switch */}
            <button
              onClick={handleToggle}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isEnabled ? "bg-cyan-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* message editor */}
          <p className="text-slate-400 text-xs mb-2">Auto-reply message:</p>
          <textarea
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-cyan-500/50 placeholder-slate-500"
            placeholder="Type your away message..."
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-slate-500 text-xs">{draftMessage.length}/300</span>
            <button
              onClick={handleSaveMessage}
              disabled={!draftMessage.trim()}
              className="flex items-center gap-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SaveIcon className="size-3" />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoReplySettings;