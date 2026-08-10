import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Gerçek istemci IP (Vercel / proxy headers) */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const xf = (req.headers['x-forwarded-for'] as string) || '';
  const ip =
    xf.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket?.remoteAddress ||
    'unknown';
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ip });
}
