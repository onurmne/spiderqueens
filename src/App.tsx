import React, { useState, useEffect } from 'react';
import { Language, Contestant, UserProfile, PaymentMethod, CryptoAsset } from './types';
import { translations } from './i18n/translations';
import { Header } from './components/Header';
import { VersusClash } from './components/VersusClash';
import { Leaderboard } from './components/Leaderboard';
import { ContestantsGrid } from './components/ContestantsGrid';
import { JoinTab } from './components/JoinTab';
import { StoreModal } from './components/StoreModal';
import { AuthModal } from './components/AuthModal';
import { InfoModal } from './components/InfoModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { getBrowserFingerprint } from './lib/fingerprint';
import { Heart, Trophy, Crown, Sparkles, Shield, Lock, ArrowRight } from 'lucide-react';

const GUEST_PROFILE: UserProfile = {
  id: '',
  email: '',
  full_name: 'Misafir Kullanıcı',
  role: 'voter',
  is_admin: false,
  super_votes_credit: 0,
  created_at: '',
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('tr');
  const [activeTab, setActiveTab] = useState<string>('clash');
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [freeVotesRemaining, setFreeVotesRemaining] = useState<number>(5);
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_PROFILE);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<'faq' | 'rules' | 'privacy' | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const t = translations[currentLang] || translations.tr;

  // Listen for /admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setActiveTab('admin');
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  const fetchData = async () => {
    try {
      const fpHash = getBrowserFingerprint();
      const contestantsRes = await fetch('/api/contestants');
      const contestantsData = await contestantsRes.json();
      if (Array.isArray(contestantsData)) {
        setContestants(contestantsData);
      }

      const ipRes = await fetch(`/api/ip-status?fingerprint=${encodeURIComponent(fpHash)}`);
      const ipData = await ipRes.json();
      if (typeof ipData.free_votes_remaining === 'number') {
        setFreeVotesRemaining(ipData.free_votes_remaining);
      }

      const profileRes = await fetch('/api/user/profile');
      const profileData = await profileRes.json();
      if (profileData && profileData.email && profileData.email.trim() !== '') {
        setUserProfile(profileData);
      } else {
        setUserProfile(GUEST_PROFILE);
      }
    } catch (err) {
      console.error('Error fetching data from API server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVote = async (contestantId: string, isSuperVote: boolean) => {
    const fpHash = getBrowserFingerprint();
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contestant_id: contestantId, 
        is_super_vote: isSuperVote,
        fingerprint_hash: fpHash
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Voting failed');
    }

    if (data.is_super_vote) {
      setUserProfile((prev) => ({
        ...prev,
        super_votes_credit: data.super_votes_remaining,
      }));
    } else {
      setFreeVotesRemaining(data.free_votes_remaining);
    }

    // Refresh contestants
    await fetchData();
  };

  const handleSubmitApplication = async (data: {
    full_name: string;
    nickname: string;
    instagram_handle: string;
    character_name: string;
    photo_url: string;
    bio?: string;
  }) => {
    const res = await fetch('/api/contestants/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit application');
    }

    await fetchData();
  };

  const handlePurchaseSuperVotes = async (params: {
    amount: number;
    super_votes_amount: number;
    payment_method: PaymentMethod;
    tx_hash_or_note?: string;
    crypto_asset?: CryptoAsset;
  }) => {
    const res = await fetch('/api/transactions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Transaction failed');
    }

    if (result.super_votes_credit !== undefined) {
      setUserProfile((prev) => ({
        ...prev,
        super_votes_credit: result.super_votes_credit,
      }));
    }

    await fetchData();
  };

  const handleAdminAction = async (params: {
    type: 'contestant' | 'transaction';
    id: string;
    action: 'approve' | 'reject';
  }) => {
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Admin action failed');
    }

    if (result.super_votes_credit !== undefined) {
      setUserProfile((prev) => ({
        ...prev,
        super_votes_credit: result.super_votes_credit,
      }));
    }

    await fetchData();
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === 'spider2026' || adminPassword === '123456') {
      setIsAdminUnlocked(true);
      setUserProfile((prev) => ({ ...prev, is_admin: true }));
      setAdminError('');
    } else {
      setAdminError('Yönetici şifresi hatalı.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-200 font-sans selection:bg-pink-500 selection:text-white flex flex-col justify-between bg-grid-pattern overflow-x-hidden">
      {/* App Header */}
      <Header
        t={t}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-pink-500">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'clash' && (
              <VersusClash
                t={t}
                contestants={contestants}
                freeVotesRemaining={freeVotesRemaining}
                userProfile={userProfile}
                onVote={handleVote}
                onOpenStore={() => setIsStoreOpen(true)}
              />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard t={t} contestants={contestants} />
            )}

            {activeTab === 'browse' && (
              <ContestantsGrid
                t={t}
                contestants={contestants}
                onVote={handleVote}
                onOpenStore={() => setIsStoreOpen(true)}
              />
            )}

            {activeTab === 'join' && (
              <JoinTab t={t} onSubmitApplication={handleSubmitApplication} />
            )}

            {/* Hidden Admin Access Route (/admin) */}
            {activeTab === 'admin' && (
              isAdminUnlocked || userProfile.is_admin ? (
                <AdminPanel t={t} onAdminAction={handleAdminAction} />
              ) : (
                <div className="max-w-md mx-auto px-4 py-20 text-center">
                  <div className="bg-[#0F0F12] border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-white italic tracking-tight uppercase mb-1">
                      Yönetici Girişi (Admin Portal)
                    </h2>
                    <p className="text-xs text-gray-400 mb-6">
                      Lütfen devam etmek için yönetici güvenlik şifrenizi giriniz.
                    </p>

                    {adminError && (
                      <div className="mb-4 p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold">
                        {adminError}
                      </div>
                    )}

                    <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Yönetici Şifresi"
                        className="w-full px-4 py-3 rounded-xl bg-[#151518] border border-white/10 focus:border-amber-500 text-white text-xs outline-none text-center"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Panele Giriş Yap</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* User Auth Modal */}
      <AuthModal
        t={t}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setUserProfile(user);
        }}
        onRegisterSuccess={(user, role) => {
          setUserProfile(user);
          if (role === 'contestant') {
            setActiveTab('join');
          }
        }}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        t={t}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onLogout={async () => {
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (e) {
            console.error('Logout error', e);
          }
          setUserProfile(GUEST_PROFILE);
          setIsProfileOpen(false);
        }}
        onOpenStore={() => setIsStoreOpen(true)}
      />

      {/* Super Vote Purchase Store Modal */}
      <StoreModal
        t={t}
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        onPurchase={handlePurchaseSuperVotes}
      />

      {/* Info Modal for FAQ / Rules / Privacy */}
      <InfoModal
        t={t}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Footer */}
      <footer className="bg-[#0F0F12] border-t border-white/10 py-5 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-pink-500" />
            <span className="font-black text-gray-200 tracking-tight">SpiderQueens Championship</span>
            <span>© 2026</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400 font-semibold text-[11px] uppercase tracking-wider">
            <button
              onClick={() => setInfoModalType('faq')}
              className="hover:text-pink-400 transition-colors cursor-pointer"
            >
              {t.faqNav}
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => setInfoModalType('rules')}
              className="hover:text-pink-400 transition-colors cursor-pointer"
            >
              {t.rulesNav}
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => setInfoModalType('privacy')}
              className="hover:text-pink-400 transition-colors cursor-pointer"
            >
              {t.privacyNav}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
