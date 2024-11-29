import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get("pdfUrl");

  // 1. Load the PDF from the URL
  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = "";
  docs.forEach((doc) => {
    pdfTextContent += doc.pageContent;
  });

  // 2. Split the text from the PDF into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const chunks = await textSplitter.createDocuments([pdfTextContent]);

  let splittedList = [];
  chunks.forEach((chunk) => {
    splittedList.push(chunk.pageContent);
  });

  return NextResponse.json({ result: splittedList });
}
