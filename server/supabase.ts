import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function downloadFileIntoTemp(file_key: string): Promise<string> {
  const { data } = await supabase.storage.from("chat_pdf").download(file_key);

  if (!data) throw new Error("File not found");

  const tmpFilePath = path.join(os.tmpdir(), `chatpdf-${Date.now()}.pdf`);

  const arrayBuffer = await data.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  try {
    fs.writeFileSync(tmpFilePath, buffer, { flag: "wx" }); // 'w' flag for writing, creates a new file or truncates an existing one
    console.log("File written successfully.");
  } catch (err) {
    console.error("Error writing file:", err);
  }
  return tmpFilePath;
}

export const getBucketUrl = async (file_key: string): Promise<string> => {
  const { data } = await supabase.storage
    .from("chat_pdf")
    .getPublicUrl(file_key);

  return data?.publicUrl;
};
