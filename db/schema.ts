import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  walletAddress: text("wallet_address").unique().notNull(),
  twitterUsername: text("twitter_username").unique(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'wallet' or 'twitter'
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payouts = pgTable("payouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  amount: integer("amount").notNull(), // Amount in lamports
  recipientAddress: text("recipient_address").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const raidEarnings = pgTable("raid_earnings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  totalAmount: integer("total_amount").notNull(), // Total amount in lamports
  remainingAmount: integer("remaining_amount").notNull(), // Remaining amount in lamports
  pointValue: integer("point_value").notNull().default(1000000), // Value per point in lamports (default 0.001 SOL)
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const userTweets = pgTable("user_tweets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  tweetId: text("tweet_id").notNull(),
  text: text("tweet_text").notNull(),
  points: integer("points").notNull().default(0),
  hashTags: text("hash_tags").array(),
  mentions: text("mentions").array(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pointRules = pgTable("point_rules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: text("type").notNull(), // 'hashtag' or 'mention'
  value: text("value").notNull(), // the actual hashtag or mention
  points: integer("points").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
