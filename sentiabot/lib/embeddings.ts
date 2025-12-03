import { embeddingModel } from './gemini';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embeddingModel.embedContent(text);
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding.");
  }
}
