export const getBucketUrl = async (file_key: string) => {
  const client = useSupabaseClient();

  return await client.storage.from("chat_pdf").getPublicUrl(file_key);
};
