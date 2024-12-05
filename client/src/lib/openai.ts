import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY as string,
  dangerouslyAllowBrowser: true
});

export async function generateChatResponse(
  message: string,
  context: any
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: JSON.stringify(context.character)
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Meow... seems like I got my tongue caught! Try again later 😺";
  }
}
