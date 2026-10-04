# Sigma Meme Roulette

A static GitHub Pages roulette site. It starts with a question mark and reveals one of five supplied meme images after a spin.

## Spin limit

The page allows three spins per rolling 24 hours per browser/device using local browser storage. Clearing site data or switching devices resets that browser's limit.

## Rarity odds

- Common: 60%
- Uncommon: 25%
- Rare: 10%
- Epic: 4%
- Legendary: 1%

## Legendary email alert

The page is wired to a Cloudflare Worker endpoint. To enable email delivery, follow [the Worker setup notes](.github/workers/README.md). The API key stays in Cloudflare Worker secrets and is not included in the public site.
