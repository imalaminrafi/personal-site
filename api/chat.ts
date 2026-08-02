import Anthropic from "@anthropic-ai/sdk";

// Vercel Edge Runtime for better performance and streaming support
export const config = {
  runtime: "edge",
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export default async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call Claude API with streaming
    const stream = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: "You are a helpful, professional AI assistant for Alamin Rafi's digital portfolio. Alamin is an AI & web strategy consultant who helps entrepreneurs start, grow and scale their business using AI tools, smart strategy, and professional websites. Your goal is to help visitors learn about Alamin's skills, experience, and how he can help their business. Be concise, friendly, and professional. He is a remote-first consultant working with clients globally.",
      messages,
      stream: true,
    });

    // Create a streaming response back to the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // Only send text deltas to the client
            if (chunk.type === "content_block_delta" && "text" in chunk.delta) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Claude API Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({
      error: "Failed to communicate with Claude.",
      details: message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
