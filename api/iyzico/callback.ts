import type { VercelRequest, VercelResponse } from '@vercel/node';
import Iyzipay from 'iyzipay';
import { createClient } from '@supabase/supabase-js';

function pickToken(req: VercelRequest): string | null {
  const b = req.body;
  if (b && typeof b === 'object') {
    if (b.token) return String(b.token);
    if (b.paymentId) return String(b.paymentId);
  }
  if (typeof b === 'string' && b.includes('token=')) {
    try {
      const params = new URLSearchParams(b);
      const t = params.get('token');
      if (t) return t;
    } catch (_) {}
  }
  const q = req.query;
  if (q?.token) return String(q.token);
  return null;
}

function isPaymentOk(result: any): boolean {
  if (!result) return false;
  const status = String(result.status || '').toLowerCase();
  const pay = String(result.paymentStatus || result.payment_status || '').toUpperCase();
  // SUCCESS / success / COMPLETED
  if (status === 'success' && (pay === 'SUCCESS' || pay === 'COMPLETED' || pay === '')) {
    // Bazı sandbox cevaplarında paymentStatus boş ama paymentId var
    if (pay === '' && !result.paymentId && !result.paymentIdList) return false;
    return true;
  }
  if (pay === 'SUCCESS' || pay === 'COMPLETED') return true;
  return false;
}

async function handleCallback(req: VercelRequest, res: VercelResponse) {
  const siteUrl = (
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    'https://onurmne-spiderqueens.vercel.app'
  ).replace(/\/$/, '');

  const fail = (reason: string) => {
    console.error('iyzico callback fail:', reason);
    return res.redirect(302, `${siteUrl}/?payment=failed&reason=${encodeURIComponent(reason)}`);
  };
  const ok = (votes: number) =>
    res.redirect(302, `${siteUrl}/?payment=success&votes=${votes}`);

  const token = pickToken(req);
  if (!token) {
    return fail('no_token');
  }

  try {
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const uri = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey || !secretKey || !supabaseUrl || !serviceKey) {
      return fail('config_missing');
    }

    const iyzipay = new Iyzipay({ apiKey, secretKey, uri });

    const result: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve(
        { locale: Iyzipay.LOCALE.TR, token: String(token) },
        (err: any, r: any) => {
          if (err) reject(err);
          else resolve(r);
        }
      );
    });

    console.log('iyzico retrieve', {
      status: result?.status,
      paymentStatus: result?.paymentStatus,
      conversationId: result?.conversationId,
      errorCode: result?.errorCode,
      errorMessage: result?.errorMessage,
      paymentId: result?.paymentId,
    });

    if (!isPaymentOk(result)) {
      const why =
        result?.errorMessage ||
        result?.paymentStatus ||
        result?.status ||
        'not_success';
      return fail(String(why).slice(0, 80));
    }

    const conversationId = result.conversationId;
    const supabase = createClient(supabaseUrl, serviceKey);

    let tx: any = null;
    if (conversationId) {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', conversationId)
        .maybeSingle();
      tx = data;
    }

    // Yedek: token ile bul
    if (!tx) {
      const { data: list } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .ilike('tx_hash_or_note', `%${token}%`)
        .limit(1);
      tx = list?.[0] || null;
    }

    if (!tx) {
      return fail('tx_not_found');
    }

    if (tx.status === 'approved' || tx.status === 'completed') {
      return ok(tx.super_votes_amount);
    }

    await supabase
      .from('transactions')
      .update({
        status: 'approved',
        tx_hash_or_note: `iyzico_paid:${result.paymentId || token};status=${result.paymentStatus}`,
      })
      .eq('id', tx.id);

    const { error: creditErr } = await supabase.rpc('add_super_votes_credit', {
      target_user: tx.user_id,
      amount: tx.super_votes_amount || 0,
    });
    if (creditErr) {
      console.error('credit rpc', creditErr);
      const { data: prof } = await supabase
        .from('profiles')
        .select('super_votes_credit')
        .eq('id', tx.user_id)
        .maybeSingle();
      const nextCredit = (prof?.super_votes_credit || 0) + (tx.super_votes_amount || 0);
      // service role — trigger engellerse SQL tarafında bypass gerekir
      await supabase
        .from('profiles')
        .update({ super_votes_credit: nextCredit })
        .eq('id', tx.user_id);
    }

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

    return ok(tx.super_votes_amount);
  } catch (e: any) {
    console.error('callback error', e);
    return fail(String(e?.message || 'exception').slice(0, 80));
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET' || req.method === 'POST') {
    return handleCallback(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
