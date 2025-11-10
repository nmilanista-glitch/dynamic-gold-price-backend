import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.METALS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "METALS_API_KEY not found" });
    }

    const response = await axios.get(
      `https://metals-api.com/api/latest?base=USD&symbols=XAU&access_key=${apiKey}`
    );

    return res.json({
      goldRate: response.data.rates.XAU,
      updatedAt: response.data.timestamp,
    });

  } catch (error) {
    console.error("ERROR IN GOLD API:", error);
    return res.status(500).json({ error: "Error fetching gold price" });
  }
}
