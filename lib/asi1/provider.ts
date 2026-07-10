import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { customProvider } from "ai";
import { isTestEnvironment } from "@/lib/constants";
import { GEMINI_TEXT_MODEL } from "./client";

const gemini = createOpenAICompatible({
  name: "gemini",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  apiKey: process.env.GEMINI_API_KEY ?? process.env.ASI_ONE_API_KEY ?? "",
});

export const geminiProvider = customProvider({
  languageModels: {
    gemini: gemini(GEMINI_TEXT_MODEL),
    "chat-model": gemini(GEMINI_TEXT_MODEL),
    "title-model": gemini(GEMINI_TEXT_MODEL),
    // Legacy alias
    asi1: gemini(GEMINI_TEXT_MODEL),
  },
});

export function getGeminiModel(modelId = "gemini") {
  if (isTestEnvironment) {
    const { chatModel, titleModel } = require("@/lib/ai/models.mock");
    const { customProvider: cp } = require("ai");
    return cp({
      languageModels: {
        gemini: chatModel,
        "chat-model": chatModel,
        "title-model": titleModel,
        asi1: chatModel,
      },
    }).languageModel(modelId === "title-model" ? "title-model" : "chat-model");
  }

  const resolved =
    modelId === "title-model"
      ? "title-model"
      : modelId === "asi1"
        ? "asi1"
        : "gemini";

  return geminiProvider.languageModel(resolved);
}

/** @deprecated Use getGeminiModel */
export const getAsi1Model = getGeminiModel;
