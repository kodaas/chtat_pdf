import { PineconeClient } from "@pinecone-database/pinecone";
import { downloadFile } from "./supabase";

let pinecone: PineconeClient | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

export async function loadPdfIntoPinecone(file_key: string) {
  // 1. Obtain PDF
  return await downloadFile(file_key);
}
