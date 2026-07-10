import { getGeminiModel } from "@/lib/asi1/provider";

export function getLanguageModel(modelId: string) {
  return getGeminiModel(modelId);
}

export function getTitleModel() {
  return getGeminiModel("title-model");
}
