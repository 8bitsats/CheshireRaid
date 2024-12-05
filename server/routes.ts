import { Express } from "express";
import { db } from "../db";
import { users, verifications, chats, payouts, raidEarnings } from "@db/schema";
import { eq, sql, desc } from "drizzle-orm";

import axios from 'axios';

export function registerRoutes(app: Express) {
  
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
      if (!process.env.TWITTER_BEARER_TOKEN) {
        return res.json({ tweets: [] });
      }

      const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        },
        params: {
          query: '#solana OR @cheshiregpt',
          'tweet.fields': 'created_at,author_id,public_metrics',
          'expansions': 'author_id',
          'user.fields': 'profile_image_url,username',
          max_results: 10
        }
      });

      if (!response.data.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response format from Twitter API');
      }

      const tweets = response.data.data.map((tweet: any) => {
        const author = response.data.includes?.users?.find(
          (user: any) => user.id === tweet.author_id
        ) || { username: 'unknown', profile_image_url: null };

        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          author: {
            username: author.username,
            profile_image_url: author.profile_image_url
          },
          metrics: tweet.public_metrics || {
            retweet_count: 0,
            reply_count: 0,
            like_count: 0
          }
        };
      });

      res.json({ tweets });
    } catch (error) {
      console.error('Error fetching tweets:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch tweets";
      res.status(500).json({ error: errorMessage });
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

  app.get("/api/payout-stats", async (req, res) => {
    try {
      // Get total paid out
      const [totalPaidOutResult] = await db
        .select({
          total: sql<number>`sum(${payouts.amount})`
        })
        .from(payouts);

      // Get remaining to earn
      const [raidEarningsResult] = await db
        .select()
        .from(raidEarnings)
        .orderBy(desc(raidEarnings.lastUpdated))
        .limit(1);

      res.json({
        totalPaidOut: totalPaidOutResult?.total || 0,
        remainingToEarn: raidEarningsResult?.remainingAmount || 0
      });
    } catch (error) {
      console.error('Error fetching payout stats:', error);
      res.status(500).json({ error: "Failed to fetch payout stats" });
    }
  });
}
