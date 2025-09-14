import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customers: defineTable({
    name: v.string(),
    email: v.string(),
    salary: v.number(),
    assets: v.number(),
    firstTimeBuyer: v.boolean(),
    loyaltyRating: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.string(),
  }),

  offers: defineTable({
    customerId: v.id("customers"),
    offerType: v.string(),
    discountPercent: v.number(),
    accepted: v.boolean(),
    createdAt: v.string(),
  }),

  negotiations: defineTable({
    customerId: v.id("customers"),
    round: v.number(),
    initialRate: v.number(),
    proposedRate: v.number(),
    accepted: v.boolean(),
    agentType: v.string(),
    createdAt: v.string(),
  }),

  mortgages: defineTable({
    customerId: v.id("customers"),
    finalRate: v.number(),
    loanAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"), 
      v.literal("completed"),
      v.literal("rejected")
    ),
    signedAt: v.optional(v.string()),
  }),

  funnelEvents: defineTable({
    customerId: v.id("customers"),
    step: v.string(),
    status: v.union(v.literal("started"), v.literal("completed"), v.literal("dropped")),
    createdAt: v.string(),
  }),
});
