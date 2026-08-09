import React, { useState } from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { SuperVotePackage, CryptoAsset, PaymentMethod } from '../types';
import { Zap, CreditCard, Wallet, Copy, Check, ShieldCheck, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface StoreModalProps {
  t: TranslationDictionary;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (params: {
    amount: number;
    super_votes_amount: number;
    payment_method: PaymentMethod;
    tx_hash_or_note?: string;
    crypto_asset?: CryptoAsset;
  }) => Promise<{ status?: string; super_votes_credit?: number } | void>;
}

const PACKAGES: SuperVotePackage[] = [
  { id: 'pkg_1', name: 'Starter Pack', votes: 10, price: 4.99 },
  { id: 'pkg_2', name: 'Champion Pack', votes: 50, price: 19.99, popular: true, bonus: '+10 Bonus' },
  { id: 'pkg_3', name: 'Queen Maker', votes: 150, price: 49.99, bonus: '+30 Bonus' },
];

const WALLETS: Record<CryptoAsset, string> = {
  USDT_TRC20: 'TKZnN4u5L11Da5W8svvV1SnVuQRe6bKaqt',
  BTC: '1Sp1derQu33nsBTC2026S3cur3W4ll3tAdr3ss',
  ETH: '0xSp1derQu33nsETH2026S3cur3W4ll3tAdr3ss',
};

export const StoreModal: React.FC<StoreModalProps> = ({
  t,
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<SuperVotePackage>(PACKAGES[1]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cryptoAsset, setCryptoAsset] = useState<CryptoAsset>('USDT_TRC20');
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '888',
    name: 'Cosplay Supporter',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(WALLETS[cryptoAsset]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessPayment = async () => {
    if (paymentMethod === 'crypto_manual' && !txHash) {
      alert('Please enter your Transaction Hash or note.');
      return;
    }

    setLoading(true);
    try {
      const result = await onPurchase({
        amount: selectedPkg.price,
        super_votes_amount: selectedPkg.votes,
        payment_method: paymentMethod,
        tx_hash_or_note: txHash,
        crypto_asset: paymentMethod === 'crypto_manual' ? cryptoAsset : undefined,
      });

      const status = (result && (result as any).status) || 'pending';
      if (status === 'approved') {
        setSuccessMsg('Payment Successful! Super Votes added to your account.');
      } else {
        // Canlı güvenli mod: anında kredi yok, admin/ödeme onayı beklenir
        setSuccessMsg(
          paymentMethod === 'credit_card'
            ? 'Ödeme kaydınız alındı. Super Vote kredisi admin onayından sonra hesabınıza yüklenecektir. (Durum: Beklemede)'
            : (t.paymentSubmittedMsg || 'Ödeme bildiriminiz alındı. Onay sonrası krediniz yüklenecektir.')
        );
      }

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#151518] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{t.storeTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase">
            Get <span className="text-pink-500">Super Votes</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            {t.storeSubtitle}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-sm font-bold flex items-center gap-2 shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Package Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {PACKAGES.map((pkg) => {
            const isSelected = selectedPkg.id === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg)}
                className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-pink-500/10 to-[#151518] border-pink-500 shadow-xl scale-105'
                    : 'bg-[#151518] border-white/10 hover:border-white/20'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    POPULAR
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{pkg.name}</h4>
                  <div className="text-2xl font-black text-white mt-1 flex items-center gap-1 font-mono">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>{pkg.votes}</span>
                  </div>
                  <span className="text-[11px] text-pink-400 font-semibold">{pkg.bonus}</span>
                </div>
                <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-lg font-black text-white font-mono">${pkg.price}</span>
                  {isSelected && <Check className="w-4 h-4 text-pink-500" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('credit_card')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                paymentMethod === 'credit_card'
                  ? 'bg-pink-500/20 border-pink-500 text-white'
                  : 'bg-[#151518] border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>{t.payCreditCard}</span>
            </button>

            <button
              onClick={() => setPaymentMethod('crypto_manual')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                paymentMethod === 'crypto_manual'
                  ? 'bg-purple-500/20 border-purple-500 text-white'
                  : 'bg-[#151518] border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4 text-purple-400" />
              <span>{t.payCrypto}</span>
            </button>
          </div>
        </div>

        {/* Payment Form Fields */}
        {paymentMethod === 'credit_card' ? (
          <div className="bg-[#151518] p-4 rounded-2xl border border-white/10 space-y-3 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                {t.cardNumber}
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0F12] border border-white/10 text-white font-mono text-xs outline-none focus:border-pink-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  {t.cardExpiry}
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0F12] border border-white/10 text-white text-xs outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                  {t.cardCvc}
                </label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0F0F12] border border-white/10 text-white text-xs outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#151518] p-4 rounded-2xl border border-white/10 space-y-4 mb-6">
            {/* Crypto Asset Selector */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5">
                {t.selectCrypto}
              </label>
              <div className="flex gap-2">
                {(['USDT_TRC20', 'BTC', 'ETH'] as CryptoAsset[]).map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => setCryptoAsset(asset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      cryptoAsset === asset
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#0F0F12] border-white/10 text-gray-400'
                    }`}
                  >
                    {asset.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Address Copy */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                {t.sendToWallet} (${selectedPkg.price} USD)
              </label>
              <div className="flex items-center gap-2 bg-[#0F0F12] p-2 rounded-xl border border-white/10">
                <span className="font-mono text-xs text-amber-300 truncate flex-1">
                  {WALLETS[cryptoAsset]}
                </span>
                <button
                  type="button"
                  onClick={handleCopyWallet}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : t.copyAddress}</span>
                </button>
              </div>
            </div>

            {/* TX Hash Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                {t.txHashLabel} *
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder={t.txHashPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-[#0F0F12] border border-white/10 text-white font-mono text-xs outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleProcessPayment}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-700 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Processing...' : `${t.payNow} ($${selectedPkg.price})`}
        </button>

      </div>
    </div>
  );
};
