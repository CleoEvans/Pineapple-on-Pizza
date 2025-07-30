import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pizzas")
      .filter((q) => q.eq(q.field("available"), true))
      .collect();
  },
});

export const seedPizzas = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if pizzas already exist
    const existingPizzas = await ctx.db.query("pizzas").collect();
    if (existingPizzas.length > 0) {
      return "Pizzas already seeded";
    }

    const pizzas = [
      {
        name: "Margherita",
        description: "Fresh mozzarella, tomato sauce, and basil",
        basePrice: 12.99,
        image: "🍕",
        category: "Classic",
        available: true,
      },
      {
        name: "Pepperoni",
        description: "Pepperoni, mozzarella cheese, and tomato sauce",
        basePrice: 14.99,
        image: "🍕",
        category: "Classic",
        available: true,
      },
      {
        name: "Supreme",
        description: "Pepperoni, sausage, bell peppers, onions, and mushrooms",
        basePrice: 18.99,
        image: "🍕",
        category: "Specialty",
        available: true,
      },
      {
        name: "Hawaiian",
        description: "Ham, pineapple, and mozzarella cheese",
        basePrice: 16.99,
        image: "🍕",
        category: "Specialty",
        available: true,
      },
      {
        name: "Meat Lovers",
        description: "Pepperoni, sausage, ham, and bacon",
        basePrice: 19.99,
        image: "🍕",
        category: "Specialty",
        available: true,
      },
      {
        name: "Veggie Deluxe",
        description: "Bell peppers, onions, mushrooms, olives, and tomatoes",
        basePrice: 17.99,
        image: "🍕",
        category: "Vegetarian",
        available: true,
      },
    ];

    for (const pizza of pizzas) {
      await ctx.db.insert("pizzas", pizza);
    }

    return "Pizzas seeded successfully";
  },
});
