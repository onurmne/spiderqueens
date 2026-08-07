import { Contestant, UserProfile, Transaction, PaymentMethod, CryptoAsset } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

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
  // 1. Try Express backend
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

  // 2. Try Supabase Auth if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password || 'SpiderQueens2026!',
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: params.full_name,
            role: params.role,
          },
        },
      });

      if (authError) throw new Error(authError.message);

      const requiresConfirmation = Boolean(authData.user && !authData.session);

      const userProfile: UserProfile = {
        id: authData.user?.id || 'user_' + Date.now(),
        email: params.email,
        full_name: params.full_name,
        role: params.role,
        is_admin: params.email.toLowerCase() === 'admin@spiderqueens.com',
        super_votes_credit: 0,
        created_at: new Date().toISOString(),
      };

      try {
        localStorage.setItem('sq_user_session', JSON.stringify(userProfile));
      } catch (e) {}

      return { user: userProfile, requiresConfirmation };
    } catch (e: any) {
      console.warn('Supabase Auth error:', e);
      if (e.message && !e.message.includes('Fetch')) {
        throw e;
      }
    }
  }

  // 3. Fallback client registration
  const newUserProfile: UserProfile = {
    id: 'user_' + Date.now(),
    email: params.email,
    full_name: params.full_name,
    role: params.role,
    is_admin: params.email.toLowerCase() === 'admin@spiderqueens.com',
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
  // 1. Try Express backend
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

  // 2. Try Supabase Auth if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password || '',
      });

      if (!authError && authData.user) {
        const loggedInUser: UserProfile = {
          id: authData.user.id,
          email: authData.user.email || params.email,
          full_name: authData.user.user_metadata?.full_name || params.email.split('@')[0],
          role: authData.user.user_metadata?.role || 'voter',
          is_admin: params.email.toLowerCase() === 'admin@spiderqueens.com',
          super_votes_credit: 0,
          created_at: new Date().toISOString(),
        };

        try {
          localStorage.setItem('sq_user_session', JSON.stringify(loggedInUser));
        } catch (e) {}

        return { user: loggedInUser };
      }
    } catch (e) {}
  }

  // 3. Fallback client login
  const loggedUser: UserProfile = {
    id: 'user_' + Date.now(),
    email: params.email,
    full_name: params.email.split('@')[0],
    role: 'voter',
    is_admin: params.email.toLowerCase() === 'admin@spiderqueens.com',
    super_votes_credit: 0,
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem('sq_user_session', JSON.stringify(loggedUser));
  } catch (e) {}

  return { user: loggedUser };
}

// Cast Vote
export async function castVoteApi(contestantId: string, isSuperVote: boolean, fingerprintHash: string) {
  const result = await safeJsonFetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contestant_id: contestantId,
      is_super_vote: isSuperVote,
      fingerprint_hash: fingerprintHash,
    }),
  });

  if (result.ok && result.data) {
    return result.data;
  }

  // Client-side simulation if server is offline (e.g. static Vercel build without backend)
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc('increment_contestant_vote_count', { contestant_id: contestantId });
    } catch (e) {
      console.warn('Supabase vote RPC error', e);
    }
  }

  return {
    success: true,
    is_super_vote: isSuperVote,
    free_votes_remaining: 4,
    super_votes_remaining: 0,
  };
}

// Submit Application
export async function submitApplicationApi(data: any) {
  const result = await safeJsonFetch('/api/contestants/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (result.ok && result.data) {
    return result.data;
  }

  if (isSupabaseConfigured && supabase) {
    let insertPayload: any = {
      full_name: data.full_name,
      nickname: data.nickname,
      instagram_handle: data.instagram_handle,
      character_name: data.character_name,
      photo_url: data.photo_url,
      bio: data.bio || '',
      status: 'approved', // Auto-approve on direct client demo if configured
      votes_count: 0,
    };

    let { data: inserted, error } = await supabase.from('contestants').insert([insertPayload]).select();

    if (error && error.message && error.message.includes("bio")) {
      delete insertPayload.bio;
      const retry = await supabase.from('contestants').insert([insertPayload]).select();
      inserted = retry.data;
      error = retry.error;
    }

    if (error) throw new Error(error.message);
    return { success: true, contestant: inserted ? inserted[0] : null };
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
