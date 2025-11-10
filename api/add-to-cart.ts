import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { price, variantId, quantity = 1 } = req.body;

    const storeUrl = process.env.SHOPIFY_STORE_URL!;
    const token = process.env.SHOPIFY_ADMIN_API_TOKEN!;
    const apiVersion = process.env.SHOPIFY_API_VERSION!;

    const response = await fetch(
      `https://${storeUrl}/admin/api/${apiVersion}/draft_orders.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draft_order: {
            line_items: [
              {
                variant_id: variantId,
                quantity,
                custom: true,
                price: price
              }
            ]
          }
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      checkoutUrl: data.draft_order.invoice_url,
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to create custom price order" });
  }
}
