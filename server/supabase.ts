import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function downloadFile(file_key: string) {
  const { data } = await supabase.storage.from("chat_pdf").download(file_key);
  return data;
}
