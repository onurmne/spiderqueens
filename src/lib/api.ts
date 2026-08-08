import { Contestant, UserProfile, Transaction, PaymentMethod, CryptoAsset } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

/** Test / owner email: unlimited free votes, auto admin, smooth registration testing */
export const UNLIMITED_TEST_EMAIL = 'onurmne@gmail.com';

export function isUnlimitedTestEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === UNLIMITED_TEST_EMAIL.toLowerCase();
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return e === 'admin@spiderqueens.com' || e === UNLIMITED_TEST_EMAIL.toLowerCase();
}

export const INITIAL_FALLBACK_CONTESTANTS: Contestant[] = [
  {
    id: 'c1',
    user_id: 'user_valkyrie',
    full_name: 'Elena Rostova',
    nickname: 'ValkyrieCosplay',
    instagram_handle: '@valkyrie_cosplay',
    character_name: 'Cyberpunk Spider-Gwen',
    photo_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    status: 'approved',
    votes_count: 342,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    bio: 'Crafting LED suit armor and glowing webbing since 2021.'
  },
  {
    id: 'c2',
    user_id: 'user_kitsune',
    full_name: 'Sakura Tanaka',
    nickname: 'KitsuneQueen',
    instagram_handle: '@kitsune_queen',
    character_name: 'Neon Spider-Woman Jessica Drew',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    status: 'approved',
    votes_count: 289,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    bio: 'Tokyo-based prop designer & wig artist.'
  },
  {
    id: 'c3',
    user_id: 'user_shadow',
    full_name: 'Aria Thorne',
    nickname: 'ShadowSpider',
    instagram_handle: '@shadow_spider_official',
    character_name: 'Symbiote Silk / Black Cat Mashup',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    status: 'approved',
    votes_count: 215,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    bio: 'Cosplay tailor specializing in latex & vinyl catsuits.'
  },
  {
    id: 'c4',
    user_id: 'user_blade',
    full_name: 'Chloe Bennett',
    nickname: 'BladeVixen',
    instagram_handle: '@bladevixen',
    character_name: 'Cyber Blade Spider-Man 2099 Female',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
    status: 'approved',
    votes_count: 178,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    bio: '3D printing enthusiast and acrobatic performer.'
  },
  {
    id: 'c5',
    user_id: 'user_nebula',
    full_name: 'Mayumi Sato',
    nickname: 'NebulaCos',
    instagram_handle: '@nebula_cosplays',
    character_name: 'Gothic Lolita Spider-Queen',
    photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop',
    status: 'approved',
    votes_count: 142,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    bio: 'Handmade Victorian embroidery meets arachnid sci-fi.'
  }
];

// Helper to safely fetch JSON without throwing on HTML 404 pages
async function safeJsonFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      return { ok: true, data: await res.json(), res };
    }
    return { ok: false, data: null, res };
  } catch (err) {
    return { ok: false, data: null, error: err };
  }
}

// Fetch Contestants
export async function fetchContestantsApi(): Promise<Contestant[]> {
  // 1. Try Express backend endpoint
  const result = await safeJsonFetch('/api/contestants');
  if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
    return result.data;
  }

  // 2. Try Supabase direct if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('status', 'approved')
        .order('votes_count', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Contestant[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to default data:', e);
    }
  }

  // 3. Fallback to default demo contestants
  return INITIAL_FALLBACK_CONTESTANTS;
}

// Fetch IP & Fingerprint Status
export async function fetchIpStatusApi(fingerprintHash: string) {
  // Unlimited test account — never rate-limit
  try {
    const raw = localStorage.getItem('sq_user_session');
    if (raw) {
      const sess = JSON.parse(raw);
      if (isUnlimitedTestEmail(sess?.email)) {
        return { free_votes_remaining: 9999, free_votes_used: 0 };
      }
    }
  } catch (e) {}

  const result = await safeJsonFetch(`/api/ip-status?fingerprint=${encodeURIComponent(fingerprintHash)}`);
  if (result.ok && result.data) {
    return result.data;
  }

  return { free_votes_remaining: 5, free_votes_used: 0 };
}

// Fetch User Profile
export async function fetchUserProfileApi(): Promise<UserProfile | null> {
  const result = await safeJsonFetch('/api/user/profile');
  if (result.ok && result.data && result.data.email && result.data.email.trim() !== '') {
    return result.data;
  }

  try {
    const saved = localStorage.getItem('sq_user_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) {
        return parsed;
      }
    }
  } catch (e) {}

  return null;
}

// Auth Register
export async function registerUserApi(params: {
  full_name: string;
  email: string;
  password?: string;
  role: 'voter' | 'contestant';
}): Promise<{ user: UserProfile; requiresConfirmation?: boolean }> {
  const password = params.password || 'SpiderQueens2026!';

  // 1. Prefer Supabase Auth when configured (real UUID required for live)
  if (isSupabaseConfigured && supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: params.full_name,
            role: params.role,
          },
        },
      });

      if (authError) {
        // Already registered → try login instead
        if (
          authError.message.includes('already registered') ||
          authError.message.includes('User already exists') ||
          authError.message.toLowerCase().includes('already been registered')
        ) {
          return loginUserApi({ email: params.email, password });
        }
        throw new Error(authError.message);
      }

      // If no session (email confirm required), try immediate password sign-in (works when confirm is off)
      let sessionUser = authData.user;
      let session = authData.session;
      if (sessionUser && !session) {
        const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
          email: params.email,
          password,
        });
        if (!loginErr && loginData.user) {
          sessionUser = loginData.user;
          session = loginData.session;
        }
      }

      const requiresConfirmation = Boolean(sessionUser && !session);
      const realId = sessionUser?.id;
      if (!realId) {
        throw new Error('Kayıt tamamlanamadı. E-posta onayını kontrol edin veya giriş yapmayı deneyin.');
      }

      const starterCredit = isUnlimitedTestEmail(params.email) ? 999 : 0;

      await supabase.from('profiles').upsert([
        {
          id: realId,
          email: params.email,
          full_name: params.full_name,
          role: params.role,
          is_admin: isAdminEmail(params.email),
          super_votes_credit: starterCredit,
        },
      ]);

      const userProfile: UserProfile = {
        id: realId,
        email: params.email,
        full_name: params.full_name,
        role: params.role,
        is_admin: isAdminEmail(params.email),
        super_votes_credit: starterCredit,
        created_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem('sq_user_session', JSON.stringify(userProfile));
      } catch (e) {}

      return { user: userProfile, requiresConfirmation };
    } catch (e: any) {
      console.warn('Supabase Auth error:', e);
      if (e.message) throw e;
    }
  }

  // 2. Express backend (local dev only)
  const result = await safeJsonFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (result.ok && result.data && result.data.user) {
    try {
      localStorage.setItem('sq_user_session', JSON.stringify(result.data.user));
    } catch (e) {}
    return { user: result.data.user };
  }

  if (result.res && !result.ok && result.data && result.data.error) {
    throw new Error(result.data.error);
  }

  // 3. Fallback ONLY when Supabase is not configured (local demo)
  if (isSupabaseConfigured) {
    throw new Error('Supabase oturumu kurulamadı. Lütfen şifre ile tekrar kayıt/giriş deneyin.');
  }

  const newUserProfile: UserProfile = {
    id: 'user_' + Date.now(),
    email: params.email,
    full_name: params.full_name,
    role: params.role,
    is_admin: isAdminEmail(params.email),
    super_votes_credit: 0,
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem('sq_user_session', JSON.stringify(newUserProfile));
  } catch (e) {}

  return { user: newUserProfile };
}

// Auth Login
export async function loginUserApi(params: {
  email: string;
  password?: string;
}): Promise<{ user: UserProfile }> {
  const password = params.password || '';

  // 1. Prefer Supabase Auth (real UUID) when configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: params.email,
        password,
      });

      if (authError) {
        throw new Error('E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.');
      }

      if (authData.user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        // Ensure profile row exists
        if (!prof) {
          const starterCredit = isUnlimitedTestEmail(params.email) ? 999 : 0;
          await supabase.from('profiles').upsert([
            {
              id: authData.user.id,
              email: params.email,
              full_name: authData.user.user_metadata?.full_name || params.email.split('@')[0],
              role: authData.user.user_metadata?.role || 'voter',
              is_admin: isAdminEmail(params.email),
              super_votes_credit: starterCredit,
            },
          ]);
        } else if (isUnlimitedTestEmail(params.email) && (prof.super_votes_credit || 0) < 50) {
          await supabase
            .from('profiles')
            .update({ is_admin: true, super_votes_credit: 999 })
            .eq('id', authData.user.id);
        }

        const { data: prof2 } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        const loggedInUser: UserProfile = {
          id: authData.user.id,
          email: authData.user.email || params.email,
          full_name: prof2?.full_name || authData.user.user_metadata?.full_name || params.email.split('@')[0],
          role: prof2?.role || authData.user.user_metadata?.role || 'voter',
          is_admin: prof2?.is_admin ?? isAdminEmail(params.email),
          super_votes_credit: prof2?.super_votes_credit ?? (isUnlimitedTestEmail(params.email) ? 999 : 0),
          created_at: prof2?.created_at || new Date().toISOString(),
        };

        try {
          localStorage.setItem('sq_user_session', JSON.stringify(loggedInUser));
        } catch (e) {}

        return { user: loggedInUser };
      }
    } catch (e: any) {
      if (e.message) throw e;
    }
  }

  // 2. Express (local dev)
  const result = await safeJsonFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (result.ok && result.data && result.data.user) {
    try {
      localStorage.setItem('sq_user_session', JSON.stringify(result.data.user));
    } catch (e) {}
    return { user: result.data.user };
  }

  if (result.res && !result.ok && result.data && result.data.error) {
    throw new Error(result.data.error);
  }

  if (isSupabaseConfigured) {
    throw new Error('Giriş başarısız. Gerçek Supabase hesabı ile şifre kullanarak giriş yapın.');
  }

  // 3. Demo fallback only without Supabase
  const loggedUser: UserProfile = {
    id: 'user_' + Date.now(),
    email: params.email,
    full_name: params.email.split('@')[0],
    role: 'voter',
    is_admin: isAdminEmail(params.email),
    super_votes_credit: 0,
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem('sq_user_session', JSON.stringify(loggedUser));
  } catch (e) {}

  return { user: loggedUser };
}

// Cast Vote
function isValidUuid(value?: string | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function castVoteApi(contestantId: string, isSuperVote: boolean, fingerprintHash: string) {
  // Resolve current user (session) early for test-email bypass + user_id on vote row
  let currentUserId: string | null = null;
  let currentEmail: string | null = null;
  let currentSuperCredit = 0;

  try {
    const raw = localStorage.getItem('sq_user_session');
    if (raw) {
      const sess = JSON.parse(raw);
      currentUserId = sess?.id || null;
      currentEmail = sess?.email || null;
      currentSuperCredit = typeof sess?.super_votes_credit === 'number' ? sess.super_votes_credit : 0;
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (authUser) {
        currentUserId = authUser.id;
        currentEmail = authUser.email || currentEmail;
        const { data: prof } = await supabase
          .from('profiles')
          .select('super_votes_credit, email')
          .eq('id', authUser.id)
          .maybeSingle();
        if (prof) {
          currentSuperCredit = prof.super_votes_credit ?? currentSuperCredit;
          currentEmail = prof.email || currentEmail;
        }
      }
    } catch (e) {}
  }

  const unlimited = isUnlimitedTestEmail(currentEmail);
  const voteVal = isSuperVote ? 5 : 1;

  // Prefer Supabase on live (Vercel has no /api/vote → 404/405 noise)
  if (isSupabaseConfigured && supabase) {
    try {
      if (isSuperVote && !unlimited && currentSuperCredit < 1) {
        throw new Error('insufficient_super_votes');
      }

      // Only attach user_id when it is a real UUID (local fallback ids like "user_123" cause 400)
      const insertPayload: Record<string, unknown> = {
        contestant_id: contestantId,
        is_super_vote: isSuperVote,
        voter_ip: unlimited ? 'test_unlimited' : 'client_app',
        fingerprint_hash: fingerprintHash || 'sqfp_default',
      };
      if (isValidUuid(currentUserId)) {
        insertPayload.user_id = currentUserId;
      }

      // 1) Audit row (non-fatal if fails — e.g. invalid contestant uuid in demo data)
      const { error: insertErr } = await supabase.from('votes').insert([insertPayload]);
      if (insertErr) {
        console.warn('votes insert:', insertErr.message || insertErr);
      }

      // 2) Increment votes_count — try RPC first, always fall back to direct UPDATE
      let countUpdated = false;
      const { error: rpcErr } = await supabase.rpc('increment_vote_count', {
        contestant_id: contestantId,
        is_super: isSuperVote,
      });

      if (rpcErr) {
        console.warn('increment_vote_count RPC:', rpcErr.message || rpcErr);
        const { data: currentContestant, error: selErr } = await supabase
          .from('contestants')
          .select('votes_count')
          .eq('id', contestantId)
          .maybeSingle();

        if (!selErr && currentContestant) {
          const { error: updErr } = await supabase
            .from('contestants')
            .update({ votes_count: (currentContestant.votes_count || 0) + voteVal })
            .eq('id', contestantId);
          if (updErr) {
            console.warn('votes_count direct update:', updErr.message || updErr);
          } else {
            countUpdated = true;
          }
        }
      } else {
        countUpdated = true;
      }

      let newSuperRemaining = currentSuperCredit;
      if (isSuperVote && isValidUuid(currentUserId)) {
        newSuperRemaining = Math.max(0, currentSuperCredit - 1);
        const { error: credErr } = await supabase
          .from('profiles')
          .update({ super_votes_credit: newSuperRemaining })
          .eq('id', currentUserId);
        if (credErr) {
          console.warn('super_votes credit update:', credErr.message || credErr);
        }
        try {
          const raw = localStorage.getItem('sq_user_session');
          if (raw) {
            const sess = JSON.parse(raw);
            sess.super_votes_credit = newSuperRemaining;
            localStorage.setItem('sq_user_session', JSON.stringify(sess));
          }
        } catch (e) {}
      } else if (isSuperVote && unlimited) {
        newSuperRemaining = Math.max(currentSuperCredit, 999);
      }

      return {
        success: true,
        is_super_vote: isSuperVote,
        votes_added: voteVal,
        count_updated: countUpdated,
        free_votes_remaining: unlimited ? 9999 : 4,
        super_votes_remaining: isSuperVote ? newSuperRemaining : currentSuperCredit,
      };
    } catch (e: any) {
      console.warn('Supabase vote recording error:', e);
      if (e?.message === 'insufficient_super_votes') throw e;
    }
  }

  // Local Express path (dev only)
  const result = await safeJsonFetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contestant_id: contestantId,
      is_super_vote: isSuperVote,
      fingerprint_hash: fingerprintHash,
      voter_email: currentEmail,
      unlimited_test: unlimited,
    }),
  });

  if (result.ok && result.data) {
    return result.data;
  }

  return {
    success: true,
    is_super_vote: isSuperVote,
    free_votes_remaining: unlimited ? 9999 : 4,
    super_votes_remaining: isSuperVote ? Math.max(0, currentSuperCredit - 1) : currentSuperCredit,
  };
}

// Submit Application
export async function submitApplicationApi(data: any) {
  // Supabase first (Vercel has no /api/contestants/apply)
  if (isSupabaseConfigured && supabase) {
    let currentUserId: string | null = null;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (authUser?.id && isValidUuid(authUser.id)) currentUserId = authUser.id;
    } catch (e) {}

    // Never send fake "user_123" into UUID column
    if (!currentUserId) {
      try {
        const raw = localStorage.getItem('sq_user_session');
        if (raw) {
          const sess = JSON.parse(raw);
          if (isValidUuid(sess?.id)) currentUserId = sess.id;
        }
      } catch (e) {}
    }

    const insertPayload: Record<string, unknown> = {
      full_name: data.full_name,
      nickname: data.nickname,
      instagram_handle: data.instagram_handle,
      character_name: data.character_name || null,
      photo_url: data.photo_url,
      bio: data.bio || '',
      status: 'pending', // admin onay kuyrugu
      votes_count: 0,
    };

    if (currentUserId) {
      insertPayload.user_id = currentUserId;
    }

    let { data: inserted, error } = await supabase
      .from('contestants')
      .insert([insertPayload])
      .select();

    // Retry without bio if column missing
    if (error && String(error.message || '').toLowerCase().includes('bio')) {
      delete insertPayload.bio;
      const retry = await supabase.from('contestants').insert([insertPayload]).select();
      inserted = retry.data;
      error = retry.error;
    }

    // Retry without user_id if FK/RLS issue
    if (error && currentUserId) {
      delete insertPayload.user_id;
      const retry2 = await supabase.from('contestants').insert([insertPayload]).select();
      if (!retry2.error) {
        inserted = retry2.data;
        error = null;
      } else {
        error = retry2.error;
      }
    }

    if (error) {
      console.error('Contestant insert error:', error);
      throw new Error(
        'Yarışma başvurusu kaydedilemedi: ' +
          error.message +
          ' (Supabase RLS: contestants INSERT policy gerekli. FIX SQL çalıştırın.)'
      );
    }

    return { success: true, contestant: inserted ? inserted[0] : null };
  }

  const result = await safeJsonFetch('/api/contestants/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (result.ok && result.data) {
    return result.data;
  }

  return { success: true };
}

// Create Super Vote Purchase Transaction
export async function createTransactionApi(params: {
  amount: number;
  super_votes_amount: number;
  payment_method: PaymentMethod;
  tx_hash_or_note?: string;
  crypto_asset?: CryptoAsset;
}) {
  // Supabase first on live (Vercel /api → 405)
  if (isSupabaseConfigured && supabase) {
    try {
      let userId: string | null = null;
      let userEmail = '';
      let currentCredit = 0;

      try {
        const authUser = (await supabase.auth.getUser()).data.user;
        if (authUser) {
          userId = authUser.id;
          userEmail = authUser.email || '';
        }
      } catch (e) {}

      // localStorage may hold fake "user_123" ids — only trust real UUIDs
      try {
        const raw = localStorage.getItem('sq_user_session');
        if (raw) {
          const sess = JSON.parse(raw);
          userEmail = userEmail || sess?.email || '';
          if (!userId && isValidUuid(sess?.id)) userId = sess.id;
          currentCredit = typeof sess?.super_votes_credit === 'number' ? sess.super_votes_credit : 0;
        }
      } catch (e) {}

      // Resolve profile by real UUID or by email
      if (isValidUuid(userId)) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, super_votes_credit, email')
          .eq('id', userId)
          .maybeSingle();
        if (prof) {
          userId = prof.id;
          currentCredit = prof.super_votes_credit ?? currentCredit;
          userEmail = prof.email || userEmail;
        }
      } else if (userEmail) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, super_votes_credit, email')
          .eq('email', userEmail)
          .maybeSingle();
        if (prof) {
          userId = prof.id;
          currentCredit = prof.super_votes_credit ?? currentCredit;
          userEmail = prof.email || userEmail;
        } else {
          userId = null; // cannot insert FK without real profile
        }
      } else {
        userId = null;
      }

      if (!isValidUuid(userId)) {
        throw new Error(
          'Super Vote satın almak için gerçek hesapla giriş yapmalısınız. Çıkış yapıp onurmne@gmail.com ile tekrar giriş edin.'
        );
      }

      const isCreditCard = params.payment_method === 'credit_card';
      const status = isCreditCard ? 'approved' : 'pending';
      const newCredit = isCreditCard
        ? currentCredit + params.super_votes_amount
        : currentCredit;

      const txRow: Record<string, unknown> = {
        user_id: userId,
        user_email: userEmail || UNLIMITED_TEST_EMAIL,
        amount: params.amount,
        super_votes_amount: params.super_votes_amount,
        payment_method: params.payment_method,
        status,
        tx_hash_or_note: params.tx_hash_or_note || null,
        crypto_asset: params.crypto_asset || null,
      };

      const { error: txErr } = await supabase.from('transactions').insert([txRow]);
      if (txErr) {
        console.warn('Transaction insert error:', txErr);
        throw new Error('İşlem kaydedilemedi: ' + txErr.message);
      }

      if (isCreditCard) {
        const { error: credErr } = await supabase
          .from('profiles')
          .update({ super_votes_credit: newCredit })
          .eq('id', userId);
        if (credErr) {
          console.warn('Credit update error:', credErr);
        }

        try {
          const raw = localStorage.getItem('sq_user_session');
          if (raw) {
            const sess = JSON.parse(raw);
            sess.id = userId;
            sess.super_votes_credit = newCredit;
            localStorage.setItem('sq_user_session', JSON.stringify(sess));
          }
        } catch (e) {}
      }

      return {
        success: true,
        super_votes_credit: newCredit,
        status,
      };
    } catch (e: any) {
      console.warn('Supabase transaction error:', e);
      if (e?.message) throw e;
    }
  }

  const result = await safeJsonFetch('/api/transactions/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (result.ok && result.data) {
    return result.data;
  }

  return {
    success: true,
    super_votes_credit: params.super_votes_amount,
  };
}

// Admin Action
export async function adminActionApi(params: {
  type: 'contestant' | 'transaction';
  id: string;
  action: 'approve' | 'reject';
}) {
  // Supabase first (Vercel has no /api/admin/action)
  if (isSupabaseConfigured && supabase) {
    try {
      if (params.type === 'contestant') {
        const newStatus = params.action === 'approve' ? 'approved' : 'rejected';
        const { error } = await supabase
          .from('contestants')
          .update({ status: newStatus })
          .eq('id', params.id);
        if (error) throw new Error(error.message);
        return { success: true, status: newStatus };
      }

      if (params.type === 'transaction') {
        if (params.action === 'approve') {
          // Prefer RPC if exists; else manual update + credit
          const { error: rpcErr } = await supabase.rpc('approve_transaction_and_credit', {
            target_transaction_id: params.id,
          });
          if (rpcErr) {
            const { data: tx, error: txErr } = await supabase
              .from('transactions')
              .select('*')
              .eq('id', params.id)
              .maybeSingle();
            if (txErr || !tx) throw new Error(txErr?.message || 'Transaction not found');

            await supabase
              .from('transactions')
              .update({ status: 'approved' })
              .eq('id', params.id);

            if (tx.user_id && isValidUuid(tx.user_id)) {
              const { data: prof } = await supabase
                .from('profiles')
                .select('super_votes_credit')
                .eq('id', tx.user_id)
                .maybeSingle();
              const next = (prof?.super_votes_credit || 0) + (tx.super_votes_amount || 0);
              await supabase
                .from('profiles')
                .update({ super_votes_credit: next })
                .eq('id', tx.user_id);
              return { success: true, super_votes_credit: next };
            }
          }
          return { success: true };
        }

        const { error } = await supabase
          .from('transactions')
          .update({ status: 'rejected' })
          .eq('id', params.id);
        if (error) throw new Error(error.message);
        return { success: true };
      }
    } catch (e: any) {
      console.warn('adminAction Supabase error:', e);
      throw e;
    }
  }

  const result = await safeJsonFetch('/api/admin/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (result.ok && result.data) {
    return result.data;
  }

  return { success: true };
}

/** Admin: pending applicants + transactions from Supabase (live) */
export async function fetchAdminPendingApi(): Promise<{
  pendingApplicants: Contestant[];
  pendingTransactions: Transaction[];
  totalContestants: number;
  totalVotes: number;
}> {
  if (isSupabaseConfigured && supabase) {
    const [apps, txs, allApproved] = await Promise.all([
      supabase.from('contestants').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('contestants').select('id, votes_count').eq('status', 'approved'),
    ]);

    const approved = allApproved.data || [];
    return {
      pendingApplicants: (apps.data || []) as Contestant[],
      pendingTransactions: (txs.data || []) as Transaction[],
      totalContestants: approved.length,
      totalVotes: approved.reduce((sum, c: any) => sum + (c.votes_count || 0), 0),
    };
  }

  const result = await safeJsonFetch('/api/admin/pending');
  if (result.ok && result.data) {
    return {
      pendingApplicants: result.data.pendingApplicants || [],
      pendingTransactions: result.data.pendingTransactions || [],
      totalContestants: result.data.totalContestants || 0,
      totalVotes: result.data.totalVotes || 0,
    };
  }

  return { pendingApplicants: [], pendingTransactions: [], totalContestants: 0, totalVotes: 0 };
}

// ---------- Reward Settings (live prize pool) ----------
export type RewardSettings = {
  pool_contribution_percentage: number;
  base_first_prize: number;
  base_second_prize: number;
  base_third_prize: number;
  accumulated_pool_usd: number;
  first_place_prize_usd: number;
};

export const DEFAULT_REWARD_SETTINGS: RewardSettings = {
  pool_contribution_percentage: 20,
  base_first_prize: 1000,
  base_second_prize: 250,
  base_third_prize: 50,
  accumulated_pool_usd: 0,
  first_place_prize_usd: 1000,
};

export function formatPrizeUsd(amount: number): string {
  const n = Number(amount) || 0;
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export async function fetchSettingsApi(): Promise<RewardSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (!error && data) {
        const base1 = Number(data.base_first_prize) || 1000;
        const pool = Number(data.accumulated_pool_usd) || 0;
        return {
          pool_contribution_percentage: Number(data.pool_contribution_percentage) || 20,
          base_first_prize: base1,
          base_second_prize: Number(data.base_second_prize) || 250,
          base_third_prize: Number(data.base_third_prize) || 50,
          accumulated_pool_usd: pool,
          first_place_prize_usd: base1 + pool,
        };
      }
    } catch (e) {
      console.warn('fetchSettingsApi:', e);
    }
  }

  const result = await safeJsonFetch('/api/settings');
  if (result.ok && result.data) {
    const d = result.data;
    const base1 = Number(d.base_first_prize) || 1000;
    const pool = Number(d.accumulated_pool_usd) || 0;
    return {
      pool_contribution_percentage: Number(d.pool_contribution_percentage) || 20,
      base_first_prize: base1,
      base_second_prize: Number(d.base_second_prize) || 250,
      base_third_prize: Number(d.base_third_prize) || 50,
      accumulated_pool_usd: pool,
      first_place_prize_usd: Number(d.first_place_prize_usd) || base1 + pool,
    };
  }

  return { ...DEFAULT_REWARD_SETTINGS };
}

export async function saveSettingsApi(input: {
  pool_contribution_percentage: number;
  base_first_prize: number;
  base_second_prize: number;
  base_third_prize: number;
}): Promise<RewardSettings> {
  if (isSupabaseConfigured && supabase) {
    const payload = {
      id: 1,
      pool_contribution_percentage: input.pool_contribution_percentage,
      base_first_prize: input.base_first_prize,
      base_second_prize: input.base_second_prize,
      base_third_prize: input.base_third_prize,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('settings')
      .upsert([payload])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('saveSettingsApi:', error);
      throw new Error('Ödül ayarları kaydedilemedi: ' + error.message);
    }

    const base1 = Number(data?.base_first_prize ?? input.base_first_prize);
    const pool = Number(data?.accumulated_pool_usd ?? 0);
    return {
      pool_contribution_percentage: Number(data?.pool_contribution_percentage ?? input.pool_contribution_percentage),
      base_first_prize: base1,
      base_second_prize: Number(data?.base_second_prize ?? input.base_second_prize),
      base_third_prize: Number(data?.base_third_prize ?? input.base_third_prize),
      accumulated_pool_usd: pool,
      first_place_prize_usd: base1 + pool,
    };
  }

  const result = await safeJsonFetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (result.ok && result.data?.settings) {
    return result.data.settings as RewardSettings;
  }

  return {
    ...DEFAULT_REWARD_SETTINGS,
    ...input,
    accumulated_pool_usd: 0,
    first_place_prize_usd: input.base_first_prize,
  };
}
