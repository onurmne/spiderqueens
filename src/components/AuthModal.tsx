import React, { useState } from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { X, User, Lock, Mail, Sparkles, Crown, Heart, Check } from 'lucide-react';
import { registerUserApi, loginUserApi } from '../lib/api';

interface AuthModalProps {
  t: TranslationDictionary;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onRegisterSuccess: (user: any, role: 'voter' | 'contestant') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  t,
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<'voter' | 'contestant'>('voter');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'register') {
        const { user, requiresConfirmation } = await registerUserApi({
          full_name: fullName || email.split('@')[0],
          email,
          password,
          role,
        });

        onRegisterSuccess(user, role);

        if (requiresConfirmation) {
          setSuccessMsg('Kayıt başarılı! E-posta adresinize (Spam klasörü dahil) doğrulama bağlantısı gönderildi. Lütfen e-postanızı onaylayın.');
          setTimeout(() => {
            onClose();
          }, 3500);
        } else {
          onClose();
        }
      } else {
        const { user } = await loginUserApi({ email, password });

        onLoginSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F0F12] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#151518] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SpiderQueens Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">
            {mode === 'register' ? t.authModalTitleRegister : t.authModalTitleLogin}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'register' ? t.authModalSubtitleRegister : t.authModalSubtitleLogin}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#151518] p-1 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.authTabRegister}
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.authTabLogin}
          </button>
        </div>

        {/* Form Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form Success Message */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold animate-pulse">
            {successMsg}
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register-only Role Selector */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                {t.accountTypeLabel} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('voter')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'voter'
                      ? 'bg-pink-500/10 border-pink-500 text-white'
                      : 'bg-[#151518] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Heart className="w-5 h-5 text-pink-500" />
                    {role === 'voter' && <Check className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div className="mt-2">
                    <span className="block text-xs font-black text-white">{t.voterRoleTitle}</span>
                    <span className="text-[10px] text-gray-400 leading-tight block mt-0.5">{t.voterRoleDesc}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('contestant')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'contestant'
                      ? 'bg-purple-500/10 border-purple-500 text-white'
                      : 'bg-[#151518] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Crown className="w-5 h-5 text-purple-400" />
                    {role === 'contestant' && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <div className="mt-2">
                    <span className="block text-xs font-black text-white">{t.contestantRoleTitle}</span>
                    <span className="text-[10px] text-gray-400 leading-tight block mt-0.5">{t.contestantRoleDesc}</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Full Name Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                {t.fullNameLabel} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-xs outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              {t.emailLabel} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-xs outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              {t.passwordLabel} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-xs outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? '...' : mode === 'register' ? t.submitRegister : t.submitLogin}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
