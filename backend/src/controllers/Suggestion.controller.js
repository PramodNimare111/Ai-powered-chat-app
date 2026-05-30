// Reply Suggestion Controller
// Uses the Anthropic Claude API to generate 3 contextual reply suggestions
// based on the last messages in the conversation

export const getReplySuggestions = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ message: "Transcript is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",   // free & fast
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: "You are a chat assistant. Based on the conversation transcript provided, suggest exactly 3 short, natural reply options for 'Me'. Keep each suggestion under 15 words. Return ONLY a JSON array of 3 strings, nothing else. Example: [\"Sure, sounds good!\", \"Can we do it tomorrow?\", \"I'll think about it.\"]",
          },
          {
            role: "user",
            content: `Here is the conversation:\n\n${transcript}\n\nSuggest 3 reply options for Me.`,
          },
        ],
      }),
    });

// then parse response like this:

    if (!response.ok) {
      const errData = await response.json();
      console.log("Anthropic API error:", errData);
      return res.status(500).json({ message: "Failed to get suggestions from AI" });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "[]";

    // safely parse the JSON array from the response
    let suggestions = [];
    try {
      suggestions = JSON.parse(rawText);
      if (!Array.isArray(suggestions)) suggestions = [];
    } catch {
      suggestions = [];
    }

    res.status(200).json({ suggestions });
  } catch (error) {
    console.log("Error in getReplySuggestions:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};