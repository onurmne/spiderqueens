import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Mağaza UI için anlık USD/TRY — her istekte canlı */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const trySources: Array<() => Promise<{ rate: number; source: string } | null>> = [
    async () => {
      const r = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!r.ok) return null;
      const j = await r.json();
      const rate = Number(j?.rates?.TRY);
      return rate > 1 && rate < 200 ? { rate, source: 'open.er-api.com' } : null;
    },
    async () => {
      const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY');
      if (!r.ok) return null;
      const j = await r.json();
      const rate = Number(j?.rates?.TRY);
      return rate > 1 && rate < 200 ? { rate, source: 'frankfurter.app' } : null;
    },
    async () => {
      const r = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=TRY');
      if (!r.ok) return null;
      const j = await r.json();
      const rate = Number(j?.rates?.TRY);
      return rate > 1 && rate < 200 ? { rate, source: 'exchangerate.host' } : null;
    },
  ];

  for (const fn of trySources) {
    try {
      const out = await fn();
      if (out) return res.status(200).json(out);
    } catch (_) {}
  }

  const envRate = Number(process.env.USD_TRY_RATE);
  if (envRate > 1) {
    return res.status(200).json({ rate: envRate, source: 'env_fallback' });
  }
  return res.status(200).json({ rate: 36, source: 'hardcoded_fallback' });
}
