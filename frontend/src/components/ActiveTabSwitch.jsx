import useChatStore from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-3 p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 px-4 rounded-lg border-2 border-slate-700/50 transition-colors ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:bg-slate-700/30"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 px-4 rounded-lg border-2 border-slate-700/50 transition-colors ${
          activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:bg-slate-700/30"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
