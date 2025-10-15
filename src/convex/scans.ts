import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    medicineCode: v.string(),
    status: v.string(),
    medicineName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scans", {
      medicineCode: args.medicineCode,
      status: args.status,
      medicineName: args.medicineName,
      timestamp: Date.now(),
    });
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("scans")
      .order("desc")
      .take(limit);
  },
});
