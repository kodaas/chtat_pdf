import { loadPdfIntoPinecone } from "../pinecone";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = await loadPdfIntoPinecone(body.file_key);

  console.log(data);
  return { data, status: 200 };
});
