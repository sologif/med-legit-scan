import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("medicines").collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("medicines")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    manufacturer: v.string(),
    batchNo: v.string(),
    mfgDate: v.string(),
    expDate: v.string(),
    licenseNo: v.string(),
    status: v.union(
      v.literal("legal"),
      v.literal("expired"),
      v.literal("counterfeit"),
      v.literal("recalled")
    ),
    country: v.string(),
    composition: v.string(),
    warnings: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("medicines", args);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const medicines = await ctx.db.query("medicines").collect();
    const scans = await ctx.db.query("scans").collect();
    const legalCount = medicines.filter((m) => m.status === "legal").length;
    
    return {
      totalMedicines: medicines.length,
      totalScans: scans.length,
      legalProducts: legalCount,
    };
  },
});
