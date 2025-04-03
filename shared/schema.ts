import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Calculations table
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  length: doublePrecision("length").notNull(),
  width: doublePrecision("width").notNull(),
  thickness: doublePrecision("thickness").notNull(),
  volume: doublePrecision("volume").notNull(),
  cost: doublePrecision("cost").notNull(),
  price: doublePrecision("price").notNull(),
  unitType: text("unit_type").notNull(),
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  length: true,
  width: true,
  thickness: true,
  volume: true, 
  cost: true,
  price: true,
  unitType: true,
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
