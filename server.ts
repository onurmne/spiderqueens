import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Data Store (Emulating Supabase for instant local execution)
// Includes real Unsplash cosplay art photos with credit to creators
interface ContestantData {
  id: string;
  user_id: string;
  full_name: string;
  nickname: string;
  instagram_handle: string;
  character_name: string;
  photo_url: string;
  status: 'pending' | 'approved' | 'rejected';
  votes_count: number;
  created_at: string;
  bio?: string;
}

interface TransactionData {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  super_votes_amount: number;
  payment_method: 'credit_card' | 'crypto_manual';
  status: 'pending' | 'approved' | 'rejected';
  tx_hash_or_note?: string;
  crypto_asset?: string;
  created_at: string;
}

interface IpTrackerData {
  ip_address: string;
  free_votes_used: number;
  last_vote_date: string;
}

let contestants: ContestantData[] = [
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
  },
  {
    id: 'c6',
    user_id: 'user_pending_1',
    full_name: 'Sasha Petrova',
    nickname: 'ScarletArachnid',
    instagram_handle: '@scarlet_arachnid',
    character_name: 'Scarlet Spider Gwenom',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    status: 'pending',
    votes_count: 0,
    created_at: new Date().toISOString(),
    bio: 'Custom FX makeup and foam craftsmanship.'
  }
];

interface FingerprintTrackerData {
  fingerprint_hash: string;
  free_votes_used: number;
  last_vote_date: string;
}

let ipTrackers: Record<string, IpTrackerData> = {};
let fingerprintTrackers: Record<string, FingerprintTrackerData> = {};

interface SettingsData {
  pool_contribution_percentage: number;
  base_first_prize: number;
  base_second_prize: number;
  base_third_prize: number;
  accumulated_pool_usd: number;
}

let rewardSettings: SettingsData = {
  pool_contribution_percentage: 20,
  base_first_prize: 1000,
  base_second_prize: 250,
  base_third_prize: 50,
  accumulated_pool_usd: 185.50 // Initial dynamic pool built from completed transactions
};

interface RegisteredUser {
  id: string;
  email: string;
  full_name: string;
  role: 'voter' | 'contestant';
  is_admin: boolean;
  super_votes_credit: number;
  created_at: string;
}

let registeredUsers: RegisteredUser[] = [
  {
    id: 'admin_user_001',
    email: 'admin@spiderqueens.com',
    full_name: 'Admin Owner',
    role: 'voter',
    is_admin: true,
    super_votes_credit: 100,
    created_at: new Date().toISOString()
  }
];

let userProfile = {
  id: '',
  email: '',
  full_name: 'Guest Voter',
  role: 'voter' as 'voter' | 'contestant',
  is_admin: false,
  super_votes_credit: 0,
  created_at: ''
};

let transactions: TransactionData[] = [
  {
    id: 'tx_101',
    user_id: 'current_user_123',
    user_email: 'user@spiderqueens.com',
    amount: 19.99,
    super_votes_amount: 50,
    payment_method: 'crypto_manual',
    status: 'pending',
    tx_hash_or_note: '0x71a2bc84f93a1103984e723910c2837194881ad394',
    crypto_asset: 'USDT_TRC20',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

// Helper to get client IP
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || '127.0.0.1';
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'SpiderQueens' });
});

// GET /api/contestants
app.get('/api/contestants', (req: Request, res: Response) => {
  const statusFilter = req.query.status as string;
  let list = contestants;
  if (statusFilter) {
    list = contestants.filter(c => c.status === statusFilter);
  }
  // Sort by votes_count DESC
  list = [...list].sort((a, b) => b.votes_count - a.votes_count);
  res.json(list);
});

// GET /api/ip-status
app.get('/api/ip-status', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const fp = (req.query.fingerprint as string) || '';
  const today = getTodayString();
  
  const ipTracker = ipTrackers[ip];
  const fpTracker = fp ? fingerprintTrackers[fp] : null;

  const ipUsed = (ipTracker && ipTracker.last_vote_date === today) ? ipTracker.free_votes_used : 0;
  const fpUsed = (fpTracker && fpTracker.last_vote_date === today) ? fpTracker.free_votes_used : 0;

  const maxUsed = Math.max(ipUsed, fpUsed);
  const remaining = Math.max(0, 5 - maxUsed);

  res.json({ ip, fingerprint: fp, free_votes_used: maxUsed, free_votes_remaining: remaining });
});

// GET /api/settings
app.get('/api/settings', (req: Request, res: Response) => {
  const first_place_prize_usd = Number((rewardSettings.base_first_prize + rewardSettings.accumulated_pool_usd).toFixed(2));
  res.json({
    ...rewardSettings,
    first_place_prize_usd
  });
});

// POST /api/admin/settings
app.post('/api/admin/settings', (req: Request, res: Response) => {
  const { pool_contribution_percentage, base_first_prize, base_second_prize, base_third_prize } = req.body;

  if (typeof pool_contribution_percentage === 'number') {
    rewardSettings.pool_contribution_percentage = Math.max(0, Math.min(100, pool_contribution_percentage));
  }
  if (typeof base_first_prize === 'number') {
    rewardSettings.base_first_prize = Math.max(0, base_first_prize);
  }
  if (typeof base_second_prize === 'number') {
    rewardSettings.base_second_prize = Math.max(0, base_second_prize);
  }
  if (typeof base_third_prize === 'number') {
    rewardSettings.base_third_prize = Math.max(0, base_third_prize);
  }

  const first_place_prize_usd = Number((rewardSettings.base_first_prize + rewardSettings.accumulated_pool_usd).toFixed(2));
  res.json({
    success: true,
    settings: {
      ...rewardSettings,
      first_place_prize_usd
    }
  });
});

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, full_name, role } = req.body;

  if (!email || !full_name) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurunuz.' });
  }

  const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.' });
  }

  const newUser: RegisteredUser = {
    id: 'user_' + Date.now(),
    email,
    full_name,
    role: role === 'contestant' ? 'contestant' : 'voter',
    is_admin: email.toLowerCase() === 'admin@spiderqueens.com' || email.toLowerCase() === 'onurmne@gmail.com',
    super_votes_credit: email.toLowerCase() === 'onurmne@gmail.com' ? 999 : 0,
    created_at: new Date().toISOString()
  };

  registeredUsers.push(newUser);
  userProfile = { ...newUser };

  res.json({ success: true, user: newUser });
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-posta adresi gereklidir.' });
  }

  const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    userProfile = { ...user };
    return res.json({ success: true, user });
  }

  // Create or auto-authenticate
  const newUser: RegisteredUser = {
    id: 'user_' + Date.now(),
    email,
    full_name: email.split('@')[0],
    role: 'voter',
    is_admin: email.toLowerCase() === 'admin@spiderqueens.com' || email.toLowerCase() === 'onurmne@gmail.com',
    super_votes_credit: email.toLowerCase() === 'onurmne@gmail.com' ? 999 : 0,
    created_at: new Date().toISOString()
  };

  registeredUsers.push(newUser);
  userProfile = { ...newUser };

  res.json({ success: true, user: newUser });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  userProfile = {
    id: '',
    email: '',
    full_name: 'Guest Voter',
    role: 'voter',
    is_admin: false,
    super_votes_credit: 0,
    created_at: ''
  };
  res.json({ success: true });
});

// GET /api/user/profile
app.get('/api/user/profile', (req: Request, res: Response) => {
  res.json(userProfile);
});

// POST /api/user/login-admin (Toggle admin status for testing)
app.post('/api/user/login-admin', (req: Request, res: Response) => {
  userProfile.is_admin = !userProfile.is_admin;
  res.json({ success: true, is_admin: userProfile.is_admin });
});

// POST /api/vote
app.post('/api/vote', (req: Request, res: Response) => {
  const { contestant_id, is_super_vote, fingerprint_hash, voter_email, unlimited_test } = req.body;
  const ip = getClientIp(req);
  const fp = fingerprint_hash || 'sqfp_default';
  const today = getTodayString();

  const contestant = contestants.find(c => c.id === contestant_id);
  if (!contestant) {
    return res.status(404).json({ error: 'Contestant not found' });
  }

  // Security Rule: Self-voting prohibition
  if (contestant.user_id === userProfile.id) {
    return res.status(403).json({ 
      error: 'self_vote_forbidden',
      message: 'Rule Violation: You cannot vote for your own cosplay entry!' 
    });
  }

  const emailLower = String(voter_email || userProfile.email || '').toLowerCase();
  const isUnlimited =
    unlimited_test === true ||
    emailLower === 'onurmne@gmail.com' ||
    userProfile.email?.toLowerCase() === 'onurmne@gmail.com';

  if (is_super_vote) {
    // Check user super votes credit (unlimited test email bypasses)
    if (!isUnlimited && userProfile.super_votes_credit < 1) {
      return res.status(400).json({ 
        error: 'insufficient_super_votes',
        message: 'No Super Votes remaining! Please purchase a Super Vote package in the store.' 
      });
    }

    // Deduct 1 credit & add +5 votes to contestant
    if (!isUnlimited) {
      userProfile.super_votes_credit -= 1;
    }
    contestant.votes_count += 5;

    return res.json({
      success: true,
      is_super_vote: true,
      votes_added: 5,
      new_total: contestant.votes_count,
      super_votes_remaining: isUnlimited ? 9999 : userProfile.super_votes_credit
    });
  } else {
    // Normal Free Vote: IP + Browser Fingerprint Dual Rate Limiting Check (Max 5/day)
    // onurmne@gmail.com is NEVER limited (live testing account)
    if (!isUnlimited) {
      let ipTracker = ipTrackers[ip];
      if (!ipTracker || ipTracker.last_vote_date !== today) {
        ipTracker = { ip_address: ip, free_votes_used: 0, last_vote_date: today };
        ipTrackers[ip] = ipTracker;
      }

      let fpTracker = fingerprintTrackers[fp];
      if (!fpTracker || fpTracker.last_vote_date !== today) {
        fpTracker = { fingerprint_hash: fp, free_votes_used: 0, last_vote_date: today };
        fingerprintTrackers[fp] = fpTracker;
      }

      if (ipTracker.free_votes_used >= 5 || fpTracker.free_votes_used >= 5) {
        return res.status(429).json({ 
          error: 'limit_reached',
          message: 'Daily limit reached! You have used all 5 free votes today for your IP address or browser device fingerprint. Get Super Votes to keep supporting!' 
        });
      }

      ipTracker.free_votes_used += 1;
      fpTracker.free_votes_used += 1;
    }

    contestant.votes_count += 1;

    const remaining = isUnlimited
      ? 9999
      : Math.max(0, 5 - Math.max(
          (ipTrackers[ip]?.last_vote_date === today ? ipTrackers[ip].free_votes_used : 0),
          (fingerprintTrackers[fp]?.last_vote_date === today ? fingerprintTrackers[fp].free_votes_used : 0)
        ));

    return res.json({
      success: true,
      is_super_vote: false,
      votes_added: 1,
      new_total: contestant.votes_count,
      free_votes_remaining: remaining
    });
  }
});

// POST /api/contestants/apply
app.post('/api/contestants/apply', (req: Request, res: Response) => {
  const { full_name, nickname, instagram_handle, character_name, photo_url, bio } = req.body;

  if (!full_name || !nickname || !instagram_handle || !photo_url) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const newContestant: ContestantData = {
    id: 'c_' + Date.now(),
    user_id: userProfile.id,
    full_name,
    nickname,
    instagram_handle,
    character_name: character_name || 'Spider Cosplayer',
    photo_url,
    status: 'pending',
    votes_count: 0,
    created_at: new Date().toISOString(),
    bio
  };

  contestants.push(newContestant);
  res.json({ success: true, contestant: newContestant });
});

// POST /api/transactions/create
app.post('/api/transactions/create', (req: Request, res: Response) => {
  const { amount, super_votes_amount, payment_method, tx_hash_or_note, crypto_asset } = req.body;

  if (!amount || !super_votes_amount || !payment_method) {
    return res.status(400).json({ error: 'Invalid transaction parameters.' });
  }

  const isCreditCard = payment_method === 'credit_card';
  const newTx: TransactionData = {
    id: 'tx_' + Date.now(),
    user_id: userProfile.id,
    user_email: userProfile.email,
    amount,
    super_votes_amount,
    payment_method,
    status: isCreditCard ? 'approved' : 'pending',
    tx_hash_or_note,
    crypto_asset,
    created_at: new Date().toISOString()
  };

  transactions.push(newTx);

  if (isCreditCard) {
    // Instantly credit super votes
    userProfile.super_votes_credit += super_votes_amount;
    
    // Automatically feed 20% (or rewardSettings.pool_contribution_percentage) to the dynamic reward pool
    const poolContribution = amount * (rewardSettings.pool_contribution_percentage / 100);
    rewardSettings.accumulated_pool_usd = Number((rewardSettings.accumulated_pool_usd + poolContribution).toFixed(2));
  }

  res.json({ 
    success: true, 
    transaction: newTx, 
    super_votes_credit: userProfile.super_votes_credit,
    accumulated_pool_usd: rewardSettings.accumulated_pool_usd
  });
});

// GET /api/admin/pending
app.get('/api/admin/pending', (req: Request, res: Response) => {
  const pendingApplicants = contestants.filter(c => c.status === 'pending');
  const pendingTxs = transactions.filter(t => t.status === 'pending');
  res.json({
    pendingApplicants,
    pendingTransactions: pendingTxs,
    totalContestants: contestants.filter(c => c.status === 'approved').length,
    totalVotes: contestants.reduce((acc, c) => acc + c.votes_count, 0)
  });
});

// POST /api/admin/action
app.post('/api/admin/action', (req: Request, res: Response) => {
  const { type, id, action } = req.body; // type: 'contestant' | 'transaction', action: 'approve' | 'reject'

  if (type === 'contestant') {
    const item = contestants.find(c => c.id === id);
    if (!item) return res.status(404).json({ error: 'Contestant not found' });
    item.status = action === 'approve' ? 'approved' : 'rejected';
    return res.json({ success: true, item });
  }

  if (type === 'transaction') {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    if (action === 'approve' && tx.status !== 'approved') {
      tx.status = 'approved';
      userProfile.super_votes_credit += tx.super_votes_amount;

      // Automatically feed percentage to the dynamic reward pool
      const poolContribution = tx.amount * (rewardSettings.pool_contribution_percentage / 100);
      rewardSettings.accumulated_pool_usd = Number((rewardSettings.accumulated_pool_usd + poolContribution).toFixed(2));
    } else if (action === 'reject') {
      tx.status = 'rejected';
    }
    return res.json({ success: true, tx, super_votes_credit: userProfile.super_votes_credit, accumulated_pool_usd: rewardSettings.accumulated_pool_usd });
  }

  res.status(400).json({ error: 'Invalid admin action' });
});

// GET /api/schema.sql
app.get('/api/schema.sql', (req: Request, res: Response) => {
  try {
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const content = fs.readFileSync(schemaPath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      return res.send(content);
    }
    res.status(404).send('-- Schema file not found');
  } catch (err) {
    res.status(500).send('-- Error reading schema file');
  }
});

async function startServer() {
  // Vite integration in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SpiderQueens server listening at http://localhost:${PORT}`);
  });
}

startServer();
