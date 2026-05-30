import { SparklesIcon, XIcon, Loader2Icon } from "lucide-react";
import useChatStore from "../store/useChatStore";

function ReplySuggestions({ onSelectSuggestion }) {
  const { replySuggestions, isLoadingSuggestions, getReplySuggestions, clearReplySuggestions } =
    useChatStore();

  const hasSuggestions = replySuggestions.length > 0;

  return (
    <div className="absolute bottom-24 right-8 z-40 flex flex-col items-end gap-2">
      {/* suggestion chips - shown above the button */}
      {hasSuggestions && (
        <div className="flex flex-col gap-2 items-end">
          {/* dismiss button */}
          <button
            onClick={clearReplySuggestions}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors text-xs"
          >
            <XIcon className="size-3" />
            dismiss
          </button>

          {replySuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectSuggestion(suggestion);
                clearReplySuggestions();
              }}
              className="max-w-xs text-left bg-slate-800/90 border border-cyan-500/30 text-slate-200 hover:bg-slate-700/90 hover:border-cyan-500/60 transition-all rounded-2xl px-4 py-2 text-sm shadow-lg backdrop-blur-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* floating sparkle button */}
      <button
        onClick={getReplySuggestions}
        disabled={isLoadingSuggestions}
        title="Get reply suggestions"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all text-sm font-medium
          ${
            isLoadingSuggestions
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : hasSuggestions
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
              : "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700"
          }`}
      >
        {isLoadingSuggestions ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Thinking...
          </>
        ) : (
          <>
            <SparklesIcon className="size-4" />
            Suggest reply
          </>
        )}
      </button>
    </div>
  );
}

export default ReplySuggestions;