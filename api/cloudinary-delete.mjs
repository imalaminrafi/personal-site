/**
 * Serverless function (Vercel / Netlify / Cloudflare) that deletes a
 * Cloudinary asset using the API secret — keeping it out of the browser.
 *
 * Deploy notes:
 *  - Set env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *  - Set VITE_CLOUDINARY_DELETE_URL on the frontend to this endpoint's URL.
 *
 * Example request: POST { "publicId": "alaminrafi/image_123" }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { publicId } = req.body || {};
  if (!publicId) {
    res.status(400).json({ error: "publicId is required" });
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server credentials not configured" });
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const crypto = await import("node:crypto");
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  try {
    const body = new URLSearchParams({
      public_id: publicId,
      timestamp,
      api_key: apiKey,
      signature,
    });

    const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await resp.json();
    res.status(resp.ok ? 200 : 400).json(data);
  } catch (err) {
    res.status(500).json({ error: "Delete request failed" });
  }
}
