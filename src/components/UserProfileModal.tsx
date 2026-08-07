import React from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { UserProfile } from '../types';
import { X, User, Mail, Shield, Zap, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';

interface UserProfileModalProps {
  t: TranslationDictionary;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLogout: () => void;
  onOpenStore: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  t,
  isOpen,
  onClose,
  userProfile,
  onLogout,
  onOpenStore,
}) => {
  if (!isOpen) return null;

  const userInitial = userProfile.full_name
    ? userProfile.full_name.charAt(0).toUpperCase()
    : userProfile.email
    ? userProfile.email.charAt(0).toUpperCase()
    : 'U';

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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-700 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            {userInitial}
          </div>
          <div>
            <h3 className="text-xl font-black text-white italic tracking-tight uppercase">
              {t.userProfileTitle}
            </h3>
            <p className="text-xs text-gray-400">{t.userProfileSubtitle}</p>
          </div>
        </div>

        {/* User Card Content */}
        <div className="space-y-4">
          
          {/* Profile Badge */}
          <div className="bg-[#151518] p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-pink-400" />
                <span>{t.fullNameLabel}</span>
              </span>
              <span className="text-xs font-black text-white">
                {userProfile.full_name || 'Anonymous User'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>{t.emailLabel}</span>
              </span>
              <span className="text-xs font-medium text-gray-200 font-mono">
                {userProfile.email}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>{t.userRoleLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-pink-400" />
                {userProfile.role === 'contestant' ? t.roleContestant : t.roleVoter}
              </span>
            </div>
          </div>

          {/* Super Vote Credit Box */}
          <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-pink-950/40 p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase block">{t.superVoteCredits}</span>
                <span className="text-lg font-black text-white font-mono">
                  {userProfile.super_votes_credit} <span className="text-xs text-blue-400 font-sans">Votes</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenStore();
              }}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 hover:brightness-110 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.buyVotes}</span>
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logoutBtn}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
