import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// mutation to generate a short-lived upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// mutation to add a file to the database
export const addFileToDB = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("files", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      createdBy: args.createdBy,
      fileUrl: args.fileUrl,
    });

    return "File added to database";
  },
});

// mutation to get a file URL
export const getFileUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

// query to get file info
export const getFileInfo = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const fileInfo = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .first();

    return fileInfo;
  },
});

// query to get all files for a user
export const getAllFiles = query({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("createdBy"), args.userEmail))
      .order("desc")
      .collect();

    return files;
  },
});
