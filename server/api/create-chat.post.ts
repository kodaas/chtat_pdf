import { db } from "../db";
import { chats } from "../db/schema";
import { LoadPDfIntoPinecone } from "../pinecone";
import { getBucketUrl } from "../supabase";
// @ts-ignore
import md5 from "md5";

export default defineEventHandler(async (event) => {
  const { file_key, file_name, user_id } = await readBody<{
    file_key: string;
    file_name: string;
    user_id: string;
  }>(event);

  if (!user_id)
    throw createError({ statusCode: 401, statusMessage: "UnAuthorized User" });

  const pdf_url: string = await getBucketUrl(file_key);

  await LoadPDfIntoPinecone(file_key);

  const chat_id = await db
    .insert(chats)
    .values({
      id: md5(file_key),
      fileKey: file_key,
      pdfName: file_name,
      pdfUrl: pdf_url,
      useId: user_id,
    })
    .returning({
      insertedId: chats.id,
    });

  setResponseStatus(event, 201);
  return { chat_id: chat_id[0].insertedId, pdf_url };
});
