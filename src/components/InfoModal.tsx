import React from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { X, HelpCircle, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

interface InfoModalProps {
  t: TranslationDictionary;
  type: 'faq' | 'rules' | 'privacy' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ t, type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0F0F12] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#151518] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* FAQ Content */}
        {type === 'faq' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-500 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">
                  {t.faqNav}
                </h3>
                <p className="text-xs text-gray-400">SpiderQueens Arena & Voting System Guide</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#151518] p-4 rounded-2xl border border-white/5">
                <h4 className="font-extrabold text-pink-400 mb-1 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>{t.faqQ1}</span>
                </h4>
                <p className="text-gray-300 leading-relaxed pl-6">
                  {t.faqA1}
                </p>
              </div>

              <div className="bg-[#151518] p-4 rounded-2xl border border-white/5">
                <h4 className="font-extrabold text-pink-400 mb-1 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>{t.faqQ2}</span>
                </h4>
                <p className="text-gray-300 leading-relaxed pl-6">
                  {t.faqA2}
                </p>
              </div>

              <div className="bg-[#151518] p-4 rounded-2xl border border-white/5">
                <h4 className="font-extrabold text-pink-400 mb-1 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>{t.faqQ3}</span>
                </h4>
                <p className="text-gray-300 leading-relaxed pl-6">
                  {t.faqA3}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rules Content */}
        {type === 'rules' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">
                  {t.rulesNav}
                </h3>
                <p className="text-xs text-gray-400">Tournament Fair-Play Guidelines</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <div className="bg-[#151518] p-4 rounded-2xl border border-white/5 space-y-3">
                <p className="bg-white/5 p-3 rounded-xl">{t.rulesR1}</p>
                <p className="bg-white/5 p-3 rounded-xl">{t.rulesR2}</p>
                <p className="bg-white/5 p-3 rounded-xl">{t.rulesR3}</p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy */}
        {type === 'privacy' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">
                  {t.privacyNav}
                </h3>
                <p className="text-xs text-gray-400">Data Security & Privacy Commitment</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <div className="bg-[#151518] p-4 rounded-2xl border border-white/5 space-y-3">
                <p className="bg-white/5 p-3 rounded-xl">{t.privacyP1}</p>
                <p className="bg-white/5 p-3 rounded-xl">{t.privacyP2}</p>
                <p className="bg-white/5 p-3 rounded-xl">{t.privacyP3}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
