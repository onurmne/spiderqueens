import type { VercelRequest, VercelResponse } from '@vercel/node';
import Iyzipay from 'iyzipay';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/iyzico/init
 * Body: { amount, super_votes_amount, user_id, user_email, full_name? }
 * Creates pending transaction + iyzico Checkout Form session.
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

    const supabase = createClient(supabaseUrl, serviceKey);

    // 1) Pending transaction
    const { data: tx, error: txErr } = await supabase
      .from('transactions')
      .insert([
        {
          user_id,
          user_email,
          amount: Number(amount),
          super_votes_amount: Number(super_votes_amount),
          payment_method: 'credit_card',
          status: 'pending',
          tx_hash_or_note: 'iyzico_checkout',
        },
      ])
      .select('id')
      .single();

    if (txErr || !tx) {
      console.error('tx insert', txErr);
      return res.status(500).json({ error: 'Transaction create failed', detail: txErr?.message });
    }

    const conversationId = String(tx.id);
    const priceStr = Number(amount).toFixed(2);

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
          name: `${super_votes_amount} Super Vote`,
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

    // Store token on transaction note for callback matching
    await supabase
      .from('transactions')
      .update({
        tx_hash_or_note: `iyzico:${result.token || ''}`,
      })
      .eq('id', tx.id);

    return res.status(200).json({
      success: true,
      transaction_id: tx.id,
      token: result.token,
      paymentPageUrl: result.paymentPageUrl,
      status: 'pending',
    });
  } catch (e: any) {
    console.error('iyzico init error', e);
    return res.status(500).json({ error: e?.message || 'Internal error' });
  }
}
