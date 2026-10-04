const ALLOWED_ORIGIN = "https://sigma.oliworx.dev";
const EMAIL_API_URL = "https://api.resend.com/emails";
const MAX_ALERTS_PER_IP_PER_DAY = 3;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin !== ALLOWED_ORIGIN) {
      return json({ error: "Forbidden" }, 403);
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }
    if (request.method !== "POST" || new URL(request.url).pathname !== "/api/legendary-win") {
      return json({ error: "Not found" }, 404);
    }
    if (!env.RESEND_API_KEY || !env.ALERT_TO_EMAIL || !env.EMAIL_FROM || !env.ALERT_LIMITS) {
      return json({ error: "Email service is not configured" }, 503);
    }

    const ipAddress = request.headers.get("CF-Connecting-IP");
    if (!ipAddress) return json({ error: "Unable to apply rate limit" }, 503);

    const limitKey = "legendary-alert:" + ipAddress;
    const sentToday = Number(await env.ALERT_LIMITS.get(limitKey) || "0");
    if (sentToday >= MAX_ALERTS_PER_IP_PER_DAY) {
      return json({ error: "Daily alert limit reached" }, 429);
    }

    const emailResponse = await fetch(EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [env.ALERT_TO_EMAIL],
        subject: "Winner",
        text: "Someone won the Gold Legendary prize on Sigma Meme Roulette.\nhttps://sigma.oliworx.dev"
      })
    });

    if (!emailResponse.ok) {
      return json({ error: "Email provider rejected the alert" }, 502);
    }

    await env.ALERT_LIMITS.put(limitKey, String(sentToday + 1), { expirationTtl: 86400 });
    return json({ sent: true });
  }
};
