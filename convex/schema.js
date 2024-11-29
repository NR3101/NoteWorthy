import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the schema for the Convex database
export default defineSchema({
  // Define the users table
  users: defineTable({
    userName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    isPro: v.boolean(),
  }),

  // Define the files table
  files: defineTable({
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  }),

  // Define the documents table
  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),

  // Notes table
  notes: defineTable({
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  }),
});
