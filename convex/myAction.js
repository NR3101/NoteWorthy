import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

// Action to ingest text into Convex Vector Store
export const ingest = action({
  args: {
    splittedText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GOOGLE_API_KEY environment variable is not set in Convex"
        );
      }

      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      });

      await ConvexVectorStore.fromTexts(
        args.splittedText,
        { fileId: args.fileId },
        embeddings,
        { ctx }
      );

      return "Completed";
    } catch (error) {
      console.error("Error in ingest action:", error);
      throw new Error(`Failed to ingest text: ${error.message}`);
    }
  },
});

// Action to search the vector store
export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GOOGLE_API_KEY environment variable is not set in Convex"
        );
      }

      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      });

      const vectorStore = new ConvexVectorStore(embeddings, { ctx });

      const results = await vectorStore.similaritySearch(args.query, 20);

      const filteredResults = results.filter(
        (result) => result.metadata?.fileId === args.fileId
      );

      const topResults = filteredResults.slice(0, 5);

      return JSON.stringify(topResults);
    } catch (error) {
      console.error("Error in search action:", error);
      throw new Error(`Failed to perform search: ${error.message}`);
    }
  },
});
