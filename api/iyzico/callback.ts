import type { VercelRequest, VercelResponse } from '@vercel/node';
import Iyzipay from 'iyzipay';
import { createClient } from '@supabase/supabase-js';

/**
 * POST/GET /api/iyzico/callback
 * iyzico redirects here after 3D Secure with token.
 * Verifies payment → approves transaction → credits Super Votes + pool.
 */
async function handleCallback(req: VercelRequest, res: VercelResponse) {
  const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://onurmne-spiderqueens.vercel.app';
  const token =
    (req.body && (req.body.token || req.body.paymentId)) ||
    (req.query && (req.query.token as string));

  const redirectFail = () =>
    res.redirect(302, `${siteUrl.replace(/\/$/, '')}/?payment=failed`);
  const redirectOk = (votes: number) =>
    res.redirect(302, `${siteUrl.replace(/\/$/, '')}/?payment=success&votes=${votes}`);

  if (!token) {
    return redirectFail();
  }

  try {
    const apiKey = process.env.IYZICO_API_KEY!;
    const secretKey = process.env.IYZICO_SECRET_KEY!;
    const uri = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const iyzipay = new Iyzipay({ apiKey, secretKey, uri });

    const result: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ locale: Iyzipay.LOCALE.TR, token }, (err: any, r: any) => {
        if (err) reject(err);
        else resolve(r);
      });
    });

    if (result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
      console.error('iyzico payment not success', result);
      return redirectFail();
    }

    const conversationId = result.conversationId; // our transaction UUID
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: tx, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle();

    if (txErr || !tx) {
      console.error('tx not found', conversationId, txErr);
      return redirectFail();
    }

    if (tx.status === 'approved' || tx.status === 'completed') {
      return redirectOk(tx.super_votes_amount);
    }

    // Approve transaction
    await supabase
      .from('transactions')
      .update({
        status: 'approved',
        tx_hash_or_note: `iyzico_paid:${result.paymentId || token}`,
      })
      .eq('id', tx.id);

    // Credit Super Votes via SECURITY DEFINER RPC (profile guard bypass)
    const { error: creditErr } = await supabase.rpc('add_super_votes_credit', {
      target_user: tx.user_id,
      amount: tx.super_votes_amount || 0,
    });
    if (creditErr) {
      console.error('credit rpc', creditErr);
      // fallback direct update (service role)
      const { data: prof } = await supabase
        .from('profiles')
        .select('super_votes_credit')
        .eq('id', tx.user_id)
        .maybeSingle();
      const nextCredit = (prof?.super_votes_credit || 0) + (tx.super_votes_amount || 0);
      await supabase
        .from('profiles')
        .update({ super_votes_credit: nextCredit })
        .eq('id', tx.user_id);
    }

    // Reward pool: % from settings
    const { data: st } = await supabase
      .from('settings')
      .select('pool_contribution_percentage, accumulated_pool_usd')
      .eq('id', 1)
      .maybeSingle();

    const pct = Number(st?.pool_contribution_percentage ?? 20);
    const prevPool = Number(st?.accumulated_pool_usd ?? 0);
    const addition = Number(tx.amount) * (pct / 100);
    await supabase
      .from('settings')
      .update({
        accumulated_pool_usd: Number((prevPool + addition).toFixed(2)),
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    return redirectOk(tx.super_votes_amount);
  } catch (e) {
    console.error('callback error', e);
    return redirectFail();
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // iyzico may POST form body
  if (req.method === 'GET' || req.method === 'POST') {
    return handleCallback(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
