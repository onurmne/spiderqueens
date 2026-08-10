import type { VercelRequest, VercelResponse } from '@vercel/node';
import Iyzipay from 'iyzipay';
import { createClient } from '@supabase/supabase-js';

/**
 * Güncel USD/TRY — her ödeme anında canlı çekilir.
 * USD_TRY_RATE sadece tüm API'ler düşerse yedek olarak kullanılır.
 */
async function getUsdTryRate(): Promise<{ rate: number; source: string }> {
  // 1) open.er-api.com
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(t);
    if (r.ok) {
      const j = await r.json();
      const rate = Number(j?.rates?.TRY);
      if (rate > 1 && rate < 200) {
        return { rate, source: 'open.er-api.com' };
      }
    }
  } catch (e) {
    console.warn('fx open.er-api', e);
  }

  // 2) frankfurter.app
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=TRY', {
      headers: { Accept: 'application/json' },
    });
    if (r.ok) {
      const j = await r.json();
      const rate = Number(j?.rates?.TRY);
      if (rate > 1 && rate < 200) {
        return { rate, source: 'frankfurter.app' };
      }
    }
  } catch (e) {
    console.warn('fx frankfurter', e);
  }

  // 3) exchangerate.host
  try {
    const r = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=TRY');
    if (r.ok) {
      const j = await r.json();
      const rate = Number(j?.rates?.TRY);
      if (rate > 1 && rate < 200) {
        return { rate, source: 'exchangerate.host' };
      }
    }
  } catch (e) {
    console.warn('fx exchangerate.host', e);
  }

  // 4) Son çare: env veya sabit
  const envRate = Number(process.env.USD_TRY_RATE);
  if (envRate > 1 && envRate < 200) {
    return { rate: envRate, source: 'env_fallback' };
  }

  return { rate: 36, source: 'hardcoded_fallback' };
}

/**
 * POST /api/iyzico/init
 * amount = USD (site paket fiyatı)
 * iyzico'ya anlık kur ile TRY gönderilir
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount,
      super_votes_amount,
      user_id,
      user_email,
      full_name,
    } = req.body || {};

    if (!amount || !super_votes_amount || !user_id || !user_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const uri = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';
    const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://onurmne-spiderqueens.vercel.app';
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey || !secretKey) {
      return res.status(500).json({ error: 'iyzico keys not configured' });
    }
    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Supabase service role not configured' });
    }

    const amountUsd = Number(amount);
    const { rate, source: rateSource } = await getUsdTryRate();
    const amountTry = Math.round(amountUsd * rate * 100) / 100;
    if (amountTry < 1) {
      return res.status(400).json({ error: 'TRY amount too small', amountTry, rate });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: tx, error: txErr } = await supabase
      .from('transactions')
      .insert([
        {
          user_id,
          user_email,
          amount: amountUsd,
          super_votes_amount: Number(super_votes_amount),
          payment_method: 'credit_card',
          status: 'pending',
          tx_hash_or_note: `iyzico_checkout;usd=${amountUsd};try=${amountTry};rate=${rate};src=${rateSource}`,
        },
      ])
      .select('id')
      .single();

    if (txErr || !tx) {
      console.error('tx insert', txErr);
      return res.status(500).json({ error: 'Transaction create failed', detail: txErr?.message });
    }

    const conversationId = String(tx.id);
    const priceStr = amountTry.toFixed(2);

    const iyzipay = new Iyzipay({
      apiKey,
      secretKey,
      uri,
    });

    const buyerName = (full_name || user_email.split('@')[0] || 'User').slice(0, 50);
    const request: any = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: priceStr,
      paidPrice: priceStr,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: conversationId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${siteUrl.replace(/\/$/, '')}/api/iyzico/callback`,
      enabledInstallments: [1],
      buyer: {
        id: String(user_id).slice(0, 20),
        name: buyerName,
        surname: 'SQ',
        gsmNumber: '+905350000000',
        email: user_email,
        identityNumber: '11111111111',
        registrationAddress: 'Turkey',
        ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: buyerName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Turkey',
      },
      billingAddress: {
        contactName: buyerName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Turkey',
      },
      basketItems: [
        {
          id: `SV-${super_votes_amount}`,
          name: `${super_votes_amount} Super Vote ($${amountUsd})`,
          category1: 'Digital',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: priceStr,
        },
      ],
    };

    const result: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (result.status !== 'success') {
      console.error('iyzico init fail', result);
      return res.status(502).json({
        error: 'iyzico init failed',
        detail: result.errorMessage || result,
      });
    }

    await supabase
      .from('transactions')
      .update({
        tx_hash_or_note: `iyzico:${result.token || ''};usd=${amountUsd};try=${amountTry};rate=${rate};src=${rateSource}`,
      })
      .eq('id', tx.id);

    return res.status(200).json({
      success: true,
      transaction_id: tx.id,
      token: result.token,
      paymentPageUrl: result.paymentPageUrl,
      status: 'pending',
      amount_usd: amountUsd,
      amount_try: amountTry,
      fx_rate: rate,
      fx_source: rateSource,
    });
  } catch (e: any) {
    console.error('iyzico init error', e);
    return res.status(500).json({ error: e?.message || 'Internal error' });
  }
}
