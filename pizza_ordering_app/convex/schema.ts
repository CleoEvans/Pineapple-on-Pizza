import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  pizzas: defineTable({
    name: v.string(),
    description: v.string(),
    basePrice: v.number(),
    image: v.string(),
    category: v.string(),
    available: v.boolean(),
  }),
  
  orders: defineTable({
    userId: v.id("users"),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    customerAddress: v.string(),
    status: v.string(), // "pending", "preparing", "ready", "delivered", "cancelled"
    totalAmount: v.number(),
    orderDate: v.number(),
  }).index("by_user", ["userId"]),
  
  orderItems: defineTable({
    orderId: v.id("orders"),
    pizzaId: v.id("pizzas"),
    pizzaName: v.string(),
    size: v.string(), // "small", "medium", "large"
    toppings: v.array(v.string()),
    quantity: v.number(),
    price: v.number(),
  }).index("by_order", ["orderId"]),
  
  cartItems: defineTable({
    userId: v.id("users"),
    pizzaId: v.id("pizzas"),
    pizzaName: v.string(),
    size: v.string(),
    toppings: v.array(v.string()),
    quantity: v.number(),
    price: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
