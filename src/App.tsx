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
import { 
  fetchContestantsApi, 
  fetchIpStatusApi, 
  fetchUserProfileApi, 
  castVoteApi, 
  submitApplicationApi, 
  createTransactionApi, 
  adminActionApi,
  fetchSettingsApi,
  DEFAULT_REWARD_SETTINGS,
  type RewardSettings,
} from './lib/api';
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
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null);
  const [paymentResultDetail, setPaymentResultDetail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rewardSettings, setRewardSettings] = useState<RewardSettings>(DEFAULT_REWARD_SETTINGS);

  const openStore = () => {
    const cardOn = rewardSettings.credit_card_sales_enabled === true;
    const cryptoOn = rewardSettings.crypto_sales_enabled !== false;
    if (!cardOn && !cryptoOn) {
      const msg =
        currentLang === 'tr'
          ? 'Super Vote satışları şu an kapalı. Şimdilik günlük ücretsiz oylarını kullanabilirsin!'
          : 'Super Vote sales are closed. Use your free daily votes for now!';
      alert(msg);
      return;
    }
    setIsStoreOpen(true);
  };

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
      
      const contestantsList = await fetchContestantsApi();
      if (Array.isArray(contestantsList) && contestantsList.length > 0) {
        setContestants(contestantsList);
      }

      try {
        const settingsData = await fetchSettingsApi();
        if (settingsData) setRewardSettings(settingsData);
      } catch (e) {}

      const profileData = await fetchUserProfileApi();
      if (profileData && profileData.email && profileData.email.trim() !== '') {
        setUserProfile(profileData);
      } else {
        setUserProfile(GUEST_PROFILE);
      }

      const ipData = await fetchIpStatusApi(fpHash);
      // onurmne@gmail.com — unlimited free votes for live testing
      const emailLower = (profileData?.email || '').toLowerCase();
      if (emailLower === 'onurmne@gmail.com') {
        setFreeVotesRemaining(9999);
      } else if (typeof ipData.free_votes_remaining === 'number') {
        setFreeVotesRemaining(ipData.free_votes_remaining);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // iyzico dönüş: ?payment=success|failed
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const payment = q.get('payment');
      if (payment === 'success') {
        setPaymentResult('success');
        setPaymentResultDetail(q.get('votes') || '');
        fetchData();
        window.history.replaceState({}, '', window.location.pathname);
      } else if (payment === 'failed') {
        setPaymentResult('failed');
        setPaymentResultDetail(q.get('reason') || '');
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (e) {}
  }, []);

  const isLoggedIn = Boolean(
    userProfile && 
    userProfile.email && 
    userProfile.email.trim() !== '' && 
    !userProfile.email.includes('guest') && 
    !userProfile.email.includes('voter@spiderqueens.com')
  );

  const handleVote = async (contestantId: string, isSuperVote: boolean) => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      throw new Error('Oy kullanabilmek için lütfen önce giriş yapın veya kayıt olun.');
    }

    // Immediately increment vote count in UI for instant real-time feedback
    setContestants((prev) =>
      prev.map((c) =>
        c.id === contestantId
          ? { ...c, votes_count: c.votes_count + (isSuperVote ? 5 : 1) }
          : c
      )
    );

    const fpHash = getBrowserFingerprint();
    const data = await castVoteApi(contestantId, isSuperVote, fpHash);

    if (data.is_super_vote) {
      setUserProfile((prev) => ({
        ...prev,
        super_votes_credit: data.super_votes_remaining,
      }));
    } else if (typeof data.free_votes_remaining === 'number') {
      setFreeVotesRemaining(data.free_votes_remaining);
    }

    // Refresh contestants from server
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
    await submitApplicationApi(data);
    await fetchData();
  };

  const handlePurchaseSuperVotes = async (params: {
    amount: number;
    super_votes_amount: number;
    payment_method: PaymentMethod;
    tx_hash_or_note?: string;
    crypto_asset?: CryptoAsset;
  }) => {
    const cardOn = rewardSettings.credit_card_sales_enabled === true;
    const cryptoOn = rewardSettings.crypto_sales_enabled !== false;
    if (params.payment_method === 'credit_card' && !cardOn) {
      throw new Error(
        currentLang === 'tr'
          ? 'Kredi kartı ile Super Vote henüz açık değil (Eylül). Kripto ile deneyebilirsin.'
          : 'Credit card Super Votes are not open yet (September). Try crypto.'
      );
    }
    if (params.payment_method === 'crypto_manual' && !cryptoOn) {
      throw new Error(
        currentLang === 'tr'
          ? 'Kripto ile Super Vote şu an kapalı.'
          : 'Crypto Super Vote sales are closed.'
      );
    }
    // Kredi kartı → iyzico Checkout (sandbox/production) — kod bozulmaz, kapalıysa yukarıda engellenir
    if (params.payment_method === 'credit_card') {
      if (!userProfile?.id || !userProfile?.email) {
        throw new Error('Ödeme için giriş yapmalısınız.');
      }
      const res = await fetch('/api/iyzico/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: params.amount,
          super_votes_amount: params.super_votes_amount,
          user_id: userProfile.id,
          user_email: userProfile.email,
          full_name: userProfile.full_name,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.paymentPageUrl) {
        throw new Error(data?.error || data?.detail || 'iyzico ödeme başlatılamadı');
      }
      // Kullanıcıyı iyzico ödeme sayfasına yönlendir
      window.location.href = data.paymentPageUrl;
      return { status: 'pending', redirect: true };
    }

    const result = await createTransactionApi(params);

    if (result?.status === 'approved' && result.super_votes_credit !== undefined) {
      setUserProfile((prev) => ({
        ...prev,
        super_votes_credit: result.super_votes_credit,
      }));
    }

    await fetchData();
    return result;
  };

  const handleAdminAction = async (params: {
    type: 'contestant' | 'transaction';
    id: string;
    action: 'approve' | 'reject';
  }) => {
    const result = await adminActionApi(params);

    if (result.super_votes_credit !== undefined) {
      setUserProfile((prev) => ({
        ...prev,
        super_votes_credit: result.super_votes_credit,
      }));
    }

    await fetchData();
  };

  // Admin: sadece profiles.is_admin === true (şifre kapısı kaldırıldı)

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
        onOpenStore={openStore}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        rewardSettings={rewardSettings}
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
                onOpenStore={openStore}
                rewardSettings={rewardSettings}
                lang={currentLang}
              />
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard t={t} contestants={contestants} rewardSettings={rewardSettings} />
            )}

            {activeTab === 'browse' && (
              <ContestantsGrid
                t={t}
                contestants={contestants}
                onVote={handleVote}
                onOpenStore={openStore}
              />
            )}

            {activeTab === 'join' && (
              <JoinTab t={t} onSubmitApplication={handleSubmitApplication} />
            )}

            {/* Hidden Admin Access Route (/admin) */}
            {activeTab === 'admin' && (
              userProfile.is_admin ? (
                <AdminPanel
                  t={t}
                  onAdminAction={handleAdminAction}
                  onSettingsSaved={(s) => setRewardSettings(s)}
                />
              ) : (
                <div className="max-w-md mx-auto px-4 py-20 text-center">
                  <div className="bg-[#0F0F12] border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-white italic tracking-tight uppercase mb-1">
                      Yönetici Paneli
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">
                      Bu alana yalnızca yetkili yönetici hesabı ile giriş yapılabilir.
                      Lütfen admin e-posta adresinizle oturum açın.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className="w-full py-3 rounded-xl bg-amber-500 text-black font-extrabold text-sm hover:brightness-110 cursor-pointer"
                    >
                      Giriş Yap
                    </button>
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
            localStorage.removeItem('sq_user_session');
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (e) {
            console.error('Logout error', e);
          }
          setUserProfile(GUEST_PROFILE);
          setIsProfileOpen(false);
        }}
        onOpenStore={openStore}
      />

      {/* Super Vote Purchase Store Modal */}
      <StoreModal
        t={t}
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        onPurchase={handlePurchaseSuperVotes}
        creditCardEnabled={rewardSettings.credit_card_sales_enabled === true}
        cryptoEnabled={rewardSettings.crypto_sales_enabled !== false}
      />

      {/* Info Modal for FAQ / Rules / Privacy */}
      
      {/* Payment result modal */}
      {paymentResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0F0F12] border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border ${
              paymentResult === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {paymentResult === 'success' ? '✓' : '!'}
            </div>
            <h3 className="text-xl font-black text-white italic uppercase mb-2">
              {paymentResult === 'success' ? 'Ödeme Başarılı' : 'Ödeme Tamamlanamadı'}
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              {paymentResult === 'success'
                ? (paymentResultDetail
                    ? `Super Vote krediniz hesabınıza tanımlandı. (+${paymentResultDetail})`
                    : 'Super Vote krediniz hesabınıza tanımlandı.')
                : (paymentResultDetail
                    ? `İşlem başarısız veya iptal edildi. (${paymentResultDetail})`
                    : 'İşlem başarısız veya iptal edildi. Lütfen tekrar deneyin.')}
            </p>
            <button
              type="button"
              onClick={() => { setPaymentResult(null); setPaymentResultDetail(''); fetchData(); }}
              className="w-full py-3 rounded-xl bg-pink-500 text-white font-extrabold text-sm hover:brightness-110 cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      <InfoModal
        t={t}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        rewardSettings={rewardSettings}
      />

      {/* Footer */}
      <footer className="bg-[#0F0F12] border-t border-white/10 py-5 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div 
            onClick={() => setActiveTab('clash')} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
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
