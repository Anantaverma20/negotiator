import { query } from "./_generated/server";

// Query to get all customers (matches your mock data shape)
export const getCustomers = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    return customers.map(customer => ({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      isFirstTimeBuyer: customer.firstTimeBuyer,
      assetsOwned: customer.assets,
      loyaltyRating: customer.loyaltyRating,
      creditScore: 720, // Default for compatibility
      createdAt: customer.createdAt
    }));
  },
});

// Query to get all offers (matches your mock data shape)
export const getOffers = query({
  args: {},
  handler: async (ctx) => {
    const offers = await ctx.db.query("offers").collect();
    return offers.map(offer => ({
      _id: offer._id,
      customerId: offer.customerId,
      mortgageRate: 6.5, // Default base rate for compatibility
      promotionalOffer: offer.offerType,
      isAccepted: offer.accepted,
      createdAt: offer.createdAt,
      acceptedAt: offer.accepted ? offer.createdAt : undefined
    }));
  },
});

// Query to get all negotiations (matches your mock data shape)
export const getNegotiations = query({
  args: {},
  handler: async (ctx) => {
    const negotiations = await ctx.db.query("negotiations").collect();
    return negotiations.map(negotiation => ({
      _id: negotiation._id,
      customerId: negotiation.customerId,
      offerId: negotiation.customerId, // Using customerId as fallback
      round: negotiation.round,
      discountPercentage: (negotiation.initialRate - negotiation.proposedRate) / negotiation.initialRate,
      status: negotiation.accepted ? "accepted" : "rejected",
      createdAt: negotiation.createdAt
    }));
  },
});

// Query to get all mortgages (matches your mock data shape)
export const getMortgages = query({
  args: {},
  handler: async (ctx) => {
    const mortgages = await ctx.db.query("mortgages").collect();
    return mortgages.map(mortgage => ({
      _id: mortgage._id,
      customerId: mortgage.customerId,
      offerId: mortgage.customerId, // Using customerId as fallback
      finalRate: mortgage.finalRate,
      originalRate: mortgage.finalRate + 0.2, // Estimated original rate
      discountGiven: 0.2, // Default discount
      status: mortgage.status === "completed" ? "completed" : "rate_proposal",
      createdAt: mortgage.signedAt || new Date().toISOString(),
      completedAt: mortgage.status === "completed" ? mortgage.signedAt : undefined
    }));
  },
});

// Query for mortgage rate performance data
export const getMortgageRatePerformance = query({
  args: {},
  handler: async (ctx) => {
    const offers = await ctx.db.query("offers").collect();
    const negotiations = await ctx.db.query("negotiations").collect();
    
    const rateRanges = [
      { min: 5, max: 6, label: "5-6%" },
      { min: 6, max: 7, label: "6-7%" },
      { min: 7, max: 8, label: "7-8%" }
    ];

    return rateRanges.map(range => {
      const negotiationsInRange = negotiations.filter(neg => 
        neg.proposedRate >= range.min && neg.proposedRate < range.max
      );
      const acceptedInRange = negotiationsInRange.filter(neg => neg.accepted);
      
      return {
        rateRange: range.label,
        offeredCount: negotiationsInRange.length,
        acceptedCount: acceptedInRange.length,
        acceptanceRate: negotiationsInRange.length > 0 ? (acceptedInRange.length / negotiationsInRange.length) * 100 : 0
      };
    });
  },
});

// Query for promotional effectiveness data
export const getPromotionalEffectiveness = query({
  args: {},
  handler: async (ctx) => {
    const offers = await ctx.db.query("offers").collect();
    const customers = await ctx.db.query("customers").collect();
    
    const promotionTypes = [...new Set(offers.map(o => o.offerType))];
    
    return promotionTypes.map(promotionType => {
      const promotionOffers = offers.filter(o => o.offerType === promotionType);
      const acceptedOffers = promotionOffers.filter(o => o.accepted);
      
      const highLoyaltyOffers = promotionOffers.filter(o => {
        const customer = customers.find(c => c._id === o.customerId);
        return customer?.loyaltyRating === 'high';
      });
      
      const lowLoyaltyOffers = promotionOffers.filter(o => {
        const customer = customers.find(c => c._id === o.customerId);
        return customer?.loyaltyRating === 'low';
      });

      return {
        promotionType,
        totalOffers: promotionOffers.length,
        acceptedOffers: acceptedOffers.length,
        acceptanceRate: promotionOffers.length > 0 ? (acceptedOffers.length / promotionOffers.length) * 100 : 0,
        highLoyaltyAcceptance: highLoyaltyOffers.filter(o => o.accepted).length,
        lowLoyaltyAcceptance: lowLoyaltyOffers.filter(o => o.accepted).length
      };
    });
  },
});

// Query for funnel analysis data
export const getFunnelAnalysis = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    const funnelEvents = await ctx.db.query("funnelEvents").collect();
    
    const funnelSteps = ["inquiry", "application", "approval", "signing", "completion"];
    
    return funnelSteps.map(step => {
      const eventsAtStep = funnelEvents.filter(e => e.step === step);
      const completedAtStep = eventsAtStep.filter(e => e.status === "completed");
      
      return {
        stage: step.charAt(0).toUpperCase() + step.slice(1),
        count: completedAtStep.length,
        percentage: customers.length > 0 ? (completedAtStep.length / customers.length) * 100 : 0
      };
    });
  },
});

// Query for negotiation impact data
export const getNegotiationImpact = query({
  args: {},
  handler: async (ctx) => {
    const negotiations = await ctx.db.query("negotiations").collect();
    
    const negotiationRounds = [1, 2, 3, 4, 5];
    
    return negotiationRounds.map(round => {
      const roundNegotiations = negotiations.filter(n => n.round === round);
      const acceptedNegotiations = roundNegotiations.filter(n => n.accepted);
      const avgDiscount = roundNegotiations.length > 0 
        ? roundNegotiations.reduce((sum, n) => sum + ((n.initialRate - n.proposedRate) / n.initialRate), 0) / roundNegotiations.length 
        : 0;

      return {
        round: `Round ${round}`,
        negotiations: roundNegotiations.length,
        accepted: acceptedNegotiations.length,
        acceptanceRate: roundNegotiations.length > 0 ? (acceptedNegotiations.length / roundNegotiations.length) * 100 : 0,
        avgDiscount: avgDiscount * 100 // Convert to percentage
      };
    });
  },
});

// Query for customer segmentation data
export const getCustomerSegmentation = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    const offers = await ctx.db.query("offers").collect();
    
    const segments = [
      { 
        key: 'firstTime', 
        label: 'First-time Buyers', 
        filter: (c: any) => c.firstTimeBuyer 
      },
      { 
        key: 'lowAssets', 
        label: 'Low Assets (0-1)', 
        filter: (c: any) => c.assets >= 0 && c.assets <= 1 
      },
      { 
        key: 'mediumAssets', 
        label: 'Medium Assets (2-3)', 
        filter: (c: any) => c.assets >= 2 && c.assets <= 3 
      },
      { 
        key: 'highAssets', 
        label: 'High Assets (4+)', 
        filter: (c: any) => c.assets >= 4 
      },
      { 
        key: 'highLoyalty', 
        label: 'High Loyalty', 
        filter: (c: any) => c.loyaltyRating === 'high' 
      },
      { 
        key: 'mediumLoyalty', 
        label: 'Medium Loyalty', 
        filter: (c: any) => c.loyaltyRating === 'medium' 
      },
      { 
        key: 'lowLoyalty', 
        label: 'Low Loyalty', 
        filter: (c: any) => c.loyaltyRating === 'low' 
      }
    ];

    return segments.map(segment => {
      const segmentCustomers = customers.filter(segment.filter);
      const segmentOffers = offers.filter(offer => 
        segmentCustomers.some(customer => customer._id === offer.customerId)
      );
      const acceptedOffers = segmentOffers.filter(offer => offer.accepted);
      
      // Calculate average rate (using a base rate + discount)
      const baseRate = 6.5;
      const avgDiscount = segmentOffers.length > 0 
        ? segmentOffers.reduce((sum, offer) => sum + offer.discountPercent, 0) / segmentOffers.length 
        : 0;
      const averageRate = baseRate - (avgDiscount / 100);

      return {
        segment: segment.label,
        totalCustomers: segmentCustomers.length,
        dealsAccepted: acceptedOffers.length,
        acceptanceRate: segmentOffers.length > 0 
          ? Math.round((acceptedOffers.length / segmentOffers.length) * 100 * 10) / 10 
          : 0,
        averageRate: Math.round(averageRate * 10) / 10
      };
    });
  },
});
