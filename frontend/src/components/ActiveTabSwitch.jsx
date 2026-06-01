import useChatStore from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <div className="flex-auto border-2 border-slate-700/50">
        <button
          onClick={() => setActiveTab("chats")}
          className= {`tab ${
            activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
          }`}
        >
          Chats
        </button>
      </div>
      
      <div className="flex-auto border-2 border-slate-700/50">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`tab ${
            activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
          }`}
        >
          Contacts
        </button>
      </div>
      
    </div>
  );
}
export default ActiveTabSwitch;