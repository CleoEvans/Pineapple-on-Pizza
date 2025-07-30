import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCart = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addToCart = mutation({
  args: {
    pizzaId: v.id("pizzas"),
    pizzaName: v.string(),
    size: v.string(),
    toppings: v.array(v.string()),
    quantity: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add to cart");
    }

    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.and(
          q.eq(q.field("pizzaId"), args.pizzaId),
          q.eq(q.field("size"), args.size),
          q.eq(q.field("toppings"), args.toppings)
        )
      )
      .first();

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
        price: existingItem.price + args.price,
      });
    } else {
      // Add new item
      await ctx.db.insert("cartItems", {
        userId,
        ...args,
      });
    }
  },
});

export const updateCartItem = mutation({
  args: {
    itemId: v.id("cartItems"),
    quantity: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.itemId);
    } else {
      await ctx.db.patch(args.itemId, {
        quantity: args.quantity,
        price: args.price,
      });
    }
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});
