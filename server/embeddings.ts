import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

export async function getEmbeddings(text: string) {
  try {
    const output = await hf.featureExtraction({
      model: "BAAI/bge-base-en-v1.5",
      inputs: text.replace(/\n/g, ""),
    });

    return output as number[];
  } catch (error) {
    console.log(error);
    throw new Error("Could not get embeddings");
  }
}
