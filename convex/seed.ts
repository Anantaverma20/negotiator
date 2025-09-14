import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const existingCustomers = await ctx.db.query("customers").collect();
    const existingOffers = await ctx.db.query("offers").collect();
    const existingNegotiations = await ctx.db.query("negotiations").collect();
    const existingMortgages = await ctx.db.query("mortgages").collect();
    const existingFunnelEvents = await ctx.db.query("funnelEvents").collect();

    for (const customer of existingCustomers) {
      await ctx.db.delete(customer._id);
    }
    for (const offer of existingOffers) {
      await ctx.db.delete(offer._id);
    }
    for (const negotiation of existingNegotiations) {
      await ctx.db.delete(negotiation._id);
    }
    for (const mortgage of existingMortgages) {
      await ctx.db.delete(mortgage._id);
    }
    for (const event of existingFunnelEvents) {
      await ctx.db.delete(event._id);
    }

    // Create customers (mapping from your mock data)
    const customer1Id = await ctx.db.insert("customers", {
      name: "John Doe",
      email: "john@example.com",
      salary: 75000,
      assets: 0,
      firstTimeBuyer: true,
      loyaltyRating: "low",
      createdAt: "2024-01-15T10:00:00Z"
    });

    const customer2Id = await ctx.db.insert("customers", {
      name: "Jane Smith",
      email: "jane@example.com",
      salary: 95000,
      assets: 2,
      firstTimeBuyer: false,
      loyaltyRating: "high",
      createdAt: "2024-01-20T14:30:00Z"
    });

    const customer3Id = await ctx.db.insert("customers", {
      name: "Bob Johnson",
      email: "bob@example.com",
      salary: 65000,
      assets: 1,
      firstTimeBuyer: false,
      loyaltyRating: "medium",
      createdAt: "2024-02-01T09:15:00Z"
    });

    // Create offers (mapping from your mock data)
    const offer1Id = await ctx.db.insert("offers", {
      customerId: customer1Id,
      offerType: "First-time buyer discount",
      discountPercent: 0.5, // 0.5% discount
      accepted: true,
      createdAt: "2024-01-16T10:00:00Z"
    });

    const offer2Id = await ctx.db.insert("offers", {
      customerId: customer2Id,
      offerType: "Loyalty customer rate",
      discountPercent: 0.7, // 0.7% discount
      accepted: true,
      createdAt: "2024-01-21T11:00:00Z"
    });

    const offer3Id = await ctx.db.insert("offers", {
      customerId: customer3Id,
      offerType: "Standard rate",
      discountPercent: 0,
      accepted: false,
      createdAt: "2024-02-02T13:20:00Z"
    });

    // Create negotiations (mapping from your mock data)
    await ctx.db.insert("negotiations", {
      customerId: customer1Id,
      round: 1,
      initialRate: 6.5,
      proposedRate: 6.3,
      accepted: true,
      agentType: "human",
      createdAt: "2024-01-16T12:00:00Z"
    });

    await ctx.db.insert("negotiations", {
      customerId: customer2Id,
      round: 2,
      initialRate: 5.8,
      proposedRate: 5.5,
      accepted: true,
      agentType: "ai",
      createdAt: "2024-01-21T13:30:00Z"
    });

    await ctx.db.insert("negotiations", {
      customerId: customer3Id,
      round: 1,
      initialRate: 7.2,
      proposedRate: 7.0,
      accepted: false,
      agentType: "human",
      createdAt: "2024-02-02T14:00:00Z"
    });

    // Create mortgages (mapping from your mock data)
    await ctx.db.insert("mortgages", {
      customerId: customer1Id,
      finalRate: 6.3,
      loanAmount: 350000,
      status: "completed",
      signedAt: "2024-01-25T16:00:00Z"
    });

    await ctx.db.insert("mortgages", {
      customerId: customer2Id,
      finalRate: 5.5,
      loanAmount: 450000,
      status: "completed",
      signedAt: "2024-01-30T14:30:00Z"
    });

    await ctx.db.insert("mortgages", {
      customerId: customer3Id,
      finalRate: 7.2,
      loanAmount: 280000,
      status: "pending"
    });

    // Create funnel events
    const funnelSteps = ["inquiry", "application", "approval", "signing", "completion"];
    
    // Customer 1 - completed funnel
    for (let i = 0; i < funnelSteps.length; i++) {
      await ctx.db.insert("funnelEvents", {
        customerId: customer1Id,
        step: funnelSteps[i],
        status: "completed",
        createdAt: new Date(2024, 0, 15 + i).toISOString()
      });
    }

    // Customer 2 - completed funnel
    for (let i = 0; i < funnelSteps.length; i++) {
      await ctx.db.insert("funnelEvents", {
        customerId: customer2Id,
        step: funnelSteps[i],
        status: "completed",
        createdAt: new Date(2024, 0, 20 + i).toISOString()
      });
    }

    // Customer 3 - dropped at approval stage
    for (let i = 0; i < 3; i++) {
      await ctx.db.insert("funnelEvents", {
        customerId: customer3Id,
        step: funnelSteps[i],
        status: i < 2 ? "completed" : "dropped",
        createdAt: new Date(2024, 1, 1 + i).toISOString()
      });
    }

    return "Database seeded successfully with mock data!";
  },
});
