import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// mutation to create user if not exists
export const createUser = mutation({
  args: {
    email: v.string(),
    userName: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // check if user exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // create user if not exists
    if (user?.length === 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageUrl: args.imageUrl,
        isPro: false,
      });

      return "User created successfully!!";
    }

    return "User already exists";
  },
});

// mutation to update user plan
export const updateUserPlan = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .collect();

    if (users?.length > 0) {
      await ctx.db.patch(users[0]._id, {
        isPro: true,
      });

      return "User upgraded to pro!!";
    }

    return "User not found!!";
  },
});

// query to get user info by email
export const getUserInfo = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return users[0];
  },
});
