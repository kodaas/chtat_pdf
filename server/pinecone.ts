import {
  Pinecone,
  Vector,
  utils as PineconeUtils,
} from "@pinecone-database/pinecone";
import { downloadFileIntoTemp } from "./supabase";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getEmbeddings } from "./embeddings";
import { convertToASCII } from "./utils";
// @ts-ignore
import md5 from "md5";

import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

let pinecone: Pinecone | null = null;

export const getPineconeClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function LoadPDfIntoPinecone(file_key: string) {
  // 1. Download PDf
  console.log("Downloading File from Supabase Storage");
  const tempFilePath = await downloadFileIntoTemp(file_key);

  if (!tempFilePath) throw new Error("could not download file");

  const loader = new PDFLoader(tempFilePath);

  const pages = (await loader.load()) as PDFPage[];

  // 2. Split and Segment pdf
  const documents = await Promise.all(pages.map(preparePdf));

  // 3. Generate Embeddings and Vector
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. Upload to Pinecone
  const client = getPineconeClient();
  const pineconeIndex = client.Index("chat-pdf");

  console.log("Inserting Documents into Pinecone");
  pineconeIndex.upsert(
    // @ts-ignore
    vectors.map((v) => ({ id: v.id, values: v.values, metadata: v.metadata }))
  );

  console.log("Completed");

  return documents[0];
}

export async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);

    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("Error Embeddings Documents: ", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function preparePdf(page: PDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, "");

  // split doc
  const splitter = new RecursiveCharacterTextSplitter();

  const _docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return _docs;
}
