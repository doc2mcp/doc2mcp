import {
  type InferUIMessageChunk,
  type LanguageModel,
  type ModelMessage,
  streamText,
  type UIMessage,
} from "ai";

const TOOL_ANSWER_SYSTEM = `You already executed one or more tools (for example webSearch).
Write a complete, helpful answer for the user using those tool results.
- Synthesize the findings in clear markdown.
- Cite source URLs when web search results were used.
- Do not call any more tools.
- Do not say you lack internet access if search results were returned.`;

type MessageStreamWriter<UI_MESSAGE extends UIMessage> = {
  merge: (stream: ReadableStream<InferUIMessageChunk<UI_MESSAGE>>) => void;
};

type ToolAnswerStream = {
  toUIMessageStream: (options?: {
    sendReasoning?: boolean;
  }) => ReadableStream<InferUIMessageChunk<UIMessage>>;
  steps: PromiseLike<
    Array<{
      text: string;
      toolCalls?: readonly unknown[];
    }>
  >;
  response: PromiseLike<{
    messages?: ModelMessage[];
  }>;
  text: PromiseLike<string>;
};

function totalAssistantText(steps: Array<{ text: string }>): string {
  return steps
    .map((step) => step.text.trim())
    .filter((text) => text.length > 0)
    .join("\n\n")
    .trim();
}

function stepUsedTools(
  steps: Array<{ toolCalls?: readonly unknown[] }>
): boolean {
  for (const step of steps) {
    if ((step.toolCalls?.length ?? 0) > 0) {
      return true;
    }
  }
  return false;
}

export async function mergeStreamWithToolAnswerFallback<
  UI_MESSAGE extends UIMessage,
>({
  result,
  dataStream,
  model,
  baseMessages,
  baseSystem,
  sendReasoning = false,
}: {
  result: ToolAnswerStream;
  dataStream: MessageStreamWriter<UI_MESSAGE>;
  model: LanguageModel;
  baseMessages: ModelMessage[];
  baseSystem: string;
  sendReasoning?: boolean;
}): Promise<void> {
  dataStream.merge(
    result.toUIMessageStream({ sendReasoning }) as ReadableStream<
      InferUIMessageChunk<UI_MESSAGE>
    >
  );

  const [steps, response] = await Promise.all([result.steps, result.response]);
  const combinedText = totalAssistantText(steps);

  if (!stepUsedTools(steps) || combinedText.length > 0) {
    return;
  }

  const followUp = streamText({
    model,
    system: `${baseSystem}\n\n${TOOL_ANSWER_SYSTEM}`,
    messages: [...baseMessages, ...(response.messages ?? [])],
    providerOptions: {
      openai: {
        parallelToolCalls: false,
      },
    },
  });

  dataStream.merge(
    followUp.toUIMessageStream({ sendReasoning: false }) as ReadableStream<
      InferUIMessageChunk<UI_MESSAGE>
    >
  );
  await followUp.text;
}
