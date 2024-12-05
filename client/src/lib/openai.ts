const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function formatMessage(content: string, role: 'user' | 'system' = 'user'): string {
  if (role === 'system') {
    return `You are acting as a character with the following traits:\n${content}\nRespond to all messages maintaining this character's personality.`;
  }
  return content;
}

export async function generateChatResponse(
  message: string,
  context: any
): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Cheshire Terminal"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: formatMessage(JSON.stringify(context.character, null, 2), 'system')
          },
          {
            role: "user",
            content: formatMessage(message)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Meow... seems like I got my tongue caught! Try again later 😺";
  }
}
