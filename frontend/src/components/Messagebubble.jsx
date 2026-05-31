import { useState } from "react";
import { Languages, Loader2Icon, XIcon, ChevronDownIcon } from "lucide-react";

// free translation api — no key needed, no backend needed
const LANGUAGES = [
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "ko", label: "Korean" },
  { code: "en", label: "English" },
];

function MessageBubble({ msg, isMine }) {
  const [translated, setTranslated] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState("hi"); // default: Hindi
  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleTranslate = async () => {
    // if already showing translation, toggle it off
    if (translated) {
      setTranslated(null);
      return;
    }

    if (!msg.text) return;

    setIsTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(msg.text)}&langpair=en|${targetLang}`
      );
      const data = await res.json();
      const result = data?.responseData?.translatedText;

      if (result && data.responseStatus === 200) {
        setTranslated(result);
      } else {
        setTranslated("Translation failed. Try again.");
      }
    } catch {
      setTranslated("Could not connect to translation service.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLangChange = (code) => {
    setTargetLang(code);
    setShowLangPicker(false);
    // if already translated, re-translate in new language
    if (translated) {
      setTranslated(null);
    }
  };

  const currentLangLabel = LANGUAGES.find((l) => l.code === targetLang)?.label || "Hindi";

  // only show translate button for text messages
  const canTranslate = !!msg.text;

  return (
    <div className={`chat-bubble relative group ${isMine ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}>
      {/* image */}
      {msg.image && (
        <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
      )}

      {/* original text */}
      {msg.text && <p className={msg.image ? "mt-2" : ""}>{msg.text}</p>}

      {/* translated text — shown below original */}
      {translated && (
        <div className={`mt-2 pt-2 border-t ${isMine ? "border-white/20" : "border-slate-600"}`}>
          <p className={`text-xs mb-1 flex items-center gap-1 ${isMine ? "text-white/60" : "text-slate-400"}`}>
            <Languages className="size-3" />
            Translated to {currentLangLabel}
          </p>
          <p className="text-sm">{translated}</p>
        </div>
      )}

      {/* timestamp */}
      <p className={`text-xs mt-1 opacity-75 ${canTranslate ? "pr-16" : ""}`}>
        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* translate controls — visible on hover, only for text messages */}
      {canTranslate && (
        <div className={`absolute bottom-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}>

          {/* language picker dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded transition-colors
                ${isMine
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                }`}
              title="Select language"
            >
              {currentLangLabel}
              <ChevronDownIcon className="size-3" />
            </button>

            {showLangPicker && (
              <div className={`absolute bottom-7 right-0 z-50 w-36 rounded-xl shadow-xl border overflow-hidden
                ${isMine ? "bg-slate-800 border-slate-600" : "bg-slate-700 border-slate-600"}`}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`w-full text-left text-xs px-3 py-2 transition-colors
                      ${lang.code === targetLang
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-slate-200 hover:bg-slate-600"
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* translate / untranslate button */}
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            title={translated ? "Hide translation" : `Translate to ${currentLangLabel}`}
            className={`p-1 rounded transition-colors disabled:opacity-50
              ${translated
                ? isMine
                  ? "text-white/80 hover:bg-white/10"
                  : "text-cyan-400 hover:bg-slate-700"
                : isMine
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
          >
            {isTranslating ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : translated ? (
              <XIcon className="size-3.5" />
            ) : (
              <Languages className="size-3.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;