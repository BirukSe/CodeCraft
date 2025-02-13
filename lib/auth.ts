import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

// Replace with your actual Neon database connection URL
const neonDbUrl = process.env.DATABASE_URL;

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.CONNECTION_STRING, // Your Neon connection string directly here
    ssl: {
      rejectUnauthorized: false // Ensure SSL is enabled
    }
  }),
  socialProviders: {
    github: { 
        clientId: process.env.GITHUB_CLIENT_ID!, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET!, 
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
});
