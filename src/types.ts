export type Language = 'en' | 'tr' | 'ru' | 'th' | 'ja' | 'zh' | 'ko';

export type ContestantStatus = 'pending' | 'approved' | 'rejected';

export interface Contestant {
  id: string;
  user_id: string;
  full_name: string;
  nickname: string;
  instagram_handle: string;
  character_name?: string;
  photo_url: string;
  status: ContestantStatus;
  votes_count: number;
  created_at: string;
  bio?: string;
}

export interface Vote {
  id: string;
  voter_ip: string;
  user_id?: string;
  contestant_id: string;
  is_super_vote: boolean;
  created_at: string;
}

export interface IpTracker {
  id: string;
  ip_address: string;
  free_votes_used: number;
  last_vote_date: string;
}

export type PaymentMethod = 'credit_card' | 'crypto_manual';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type CryptoAsset = 'USDT_TRC20' | 'BTC' | 'ETH';

export interface Transaction {
  id: string;
  user_id: string;
  user_email: string;
  amount: number; // in USD
  super_votes_amount: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  tx_hash_or_note?: string;
  crypto_asset?: CryptoAsset;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  super_votes_credit: number;
  created_at: string;
}

export interface SuperVotePackage {
  id: string;
  name: string;
  votes: number;
  price: number;
  popular?: boolean;
  bonus?: string;
}
