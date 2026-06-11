import { NextResponse } from "next/server";
import { buildChatSystemPrompt } from "@/lib/chat-context";
import type { ChatMessage, ChatRequest } from "@/lib/chat-types";
import { savePreorder } from "@/lib/preorders";

type OpenAIMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string;
  tool_call_id?: string;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
};

const PREORDER_TOOL = {
  type: "function" as const,
  function: {
    name: "submit_preorder",
    description:
      "Submit a customer preorder once name, phone, product, and delivery location are collected.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer full name" },
        phone: { type: "string", description: "Customer phone number" },
        product: {
          type: "string",
          description: "Product name or description they want to preorder",
        },
        deliveryLocation: {
          type: "string",
          description: "Where the order should be delivered",
        },
        notes: {
          type: "string",
          description: "Optional extra details such as quantity or timing",
        },
      },
      required: ["name", "phone", "product", "deliveryLocation"],
    },
  },
};

function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        message.content.trim(),
    )
    .slice(-12);
}

async function callOpenAI(messages: OpenAIMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      tools: [PREORDER_TOOL],
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "AI request failed.");
  }

  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const messages = sanitizeMessages(body.messages ?? []);

    if (messages.length === 0) {
      return NextResponse.json(
        { message: "Send a message to start the conversation." },
        { status: 400 },
      );
    }

    const openAIMessages: OpenAIMessage[] = [
      { role: "system", content: buildChatSystemPrompt() },
      ...messages,
    ];

    let completion = await callOpenAI(openAIMessages);
    let choice = completion.choices?.[0]?.message;
    let preorderId: string | undefined;

    if (choice?.tool_calls?.length) {
      const toolMessages: OpenAIMessage[] = [
        ...openAIMessages,
        {
          role: "assistant",
          content: choice.content ?? "",
          tool_calls: choice.tool_calls,
        },
      ];

      for (const toolCall of choice.tool_calls) {
        if (toolCall.function.name !== "submit_preorder") continue;

        const args = JSON.parse(toolCall.function.arguments) as {
          name: string;
          phone: string;
          product: string;
          deliveryLocation: string;
          notes?: string;
        };

        const record = await savePreorder({
          name: args.name.trim(),
          phone: args.phone.trim(),
          product: args.product.trim(),
          deliveryLocation: args.deliveryLocation.trim(),
          notes: args.notes?.trim(),
        });

        preorderId = record.id;

        toolMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            success: true,
            preorderId: record.id,
            message: "Preorder saved. Team will follow up shortly.",
          }),
        });
      }

      completion = await callOpenAI(toolMessages);
      choice = completion.choices?.[0]?.message;
    }

    const reply =
      choice?.content?.trim() ||
      "Sorry, I couldn't generate a reply. Please try again.";

    return NextResponse.json({ message: reply, preorderId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    if (message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        {
          message:
            "The shop assistant is not configured yet. Add OPENAI_API_KEY to your environment and restart the server.",
        },
        { status: 503 },
      );
    }

    console.error("[CueSync chat]", error);
    return NextResponse.json(
      { message: "The assistant is temporarily unavailable. Try again soon." },
      { status: 500 },
    );
  }
}
