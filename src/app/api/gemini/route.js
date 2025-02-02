import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { initialMessage } from "@/lib/data";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const runtime = "edge";

const generatedId = () => Math.random().toString(36).slice(2, 15);

// Qodo Gen: Options | Test this function
const buildGoogleGenAIPrompt = (messages) => [
  {
    id: generatedId(),
    role: "user",
    content: initialMessage.content,
  },
  ...messages.map((message) => ({
    id: message.id || generatedId(),
    role: message.role,
    content: message.content,
  })),
];

// Qodo Gen: Options | Test this function
export async function POST(request) {
  const { messages } = await request.json();
  const stream = await streamText({
    model: google("gemini-pro"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 0.7,
  });
  return stream?.toDataStreamResponse();
}