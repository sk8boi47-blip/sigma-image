# Legendary winner email setup

The roulette page and three-spins-per-24-hours-per-browser limit are already deployed. The email alert uses a Cloudflare Worker so the email API key is not exposed in the public page.

## One-time setup

1. Create a Resend account and verify a sending domain. For example, after verifying `oliworx.dev`, use `Sigma Roulette <alerts@oliworx.dev>` as the sender. Add only the DNS records Resend asks for; keep existing website and mail records.
2. In Resend, create an API key.
3. In Cloudflare, open **Workers & Pages** and create a Worker. Copy the code from [legendary-email.js](legendary-email.js), then deploy it.
4. In the Worker settings, add:
   - Secret `RESEND_API_KEY`: the key from Resend.
   - Secret `ALERT_TO_EMAIL`: `sk8boi47@gmail.com`.
   - Variable `EMAIL_FROM`: the verified sender address, such as `Sigma Roulette <alerts@oliworx.dev>`.
5. Create a Workers KV namespace and bind it to the Worker as `ALERT_LIMITS`.
6. Add the Worker route `sigma.oliworx.dev/api/*`. The `sigma.oliworx.dev` DNS record must be proxied through Cloudflare.

After setup, a Legendary result will send an email with subject **Winner** and the message: “Someone won the Gold Legendary prize on Sigma Meme Roulette.”

The Worker accepts requests only from `https://sigma.oliworx.dev` and limits alerts to three per IP address per 24 hours.
