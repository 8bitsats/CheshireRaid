import { Express } from "express";
import { db } from "../db";
import { users, verifications, chats } from "@db/schema";
import { eq } from "drizzle-orm";

import axios from 'axios';

export function registerRoutes(app: Express) {
  // Token price endpoint
  app.get('/api/token-price/:tokenAddress', async (req, res) => {
    try {
      const { tokenAddress } = req.params;
      const response = await axios.get(`https://data.solanatracker.io/tokens/${tokenAddress}`, {
        headers: {
          'x-api-base-url': 'https://data.solanatracker.io'
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching token price:', error);
      res.status(500).json({ error: 'Failed to fetch token price' });
    }
  });
  // Twitter verification endpoints
  app.get("/api/verify-tweet", async (req, res) => {
    const { username } = req.query;
    
    try {
      // Implement Twitter API call to verify tweet
      // This is a placeholder implementation
      const verified = Math.random() > 0.5;
      
      if (verified) {
        await db.insert(verifications).values({
          userId: 1, // Replace with actual user ID
          type: 'twitter',
          status: 'completed'
        });
      }

      res.json({ verified });
    } catch (error) {
      res.status(500).json({ error: "Tweet verification failed" });
    }
  });

  app.get("/api/latest-tweets", async (req, res) => {
    try {
      // Implement Twitter API call to fetch latest tweets
      // This is a placeholder implementation
      const tweets = [
        {
          text: "Purring at these $SOL gains while other chains are stuck in a catnap 😺",
          created_at: new Date().toISOString()
        },
        {
          text: "Just pounced on some fresh alpha in the Solana jungle... meow you see it, meow you don't 🐱",
          created_at: new Date().toISOString()
        }
      ];

      res.json({ tweets });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tweets" });
    }
  });

  // Chat history endpoints
  app.post("/api/chats", async (req, res) => {
    const { userId, message, response } = req.body;
    
    try {
      const [chat] = await db.insert(chats)
        .values({ userId, message, response })
        .returning();
      
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to save chat" });
    }
  });

  app.get("/api/chats/:userId", async (req, res) => {
    const { userId } = req.params;
    
    try {
      const userChats = await db.select()
        .from(chats)
        .where(eq(chats.userId, parseInt(userId)));
      
      res.json(userChats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });
}
