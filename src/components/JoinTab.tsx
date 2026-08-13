import React, { useState } from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { Sparkles, Image as ImageIcon, CheckCircle, Instagram, User, Upload, Link as LinkIcon, Send } from 'lucide-react';

interface JoinTabProps {
  t: TranslationDictionary;
  onSubmitApplication: (data: {
    full_name: string;
    nickname: string;
    instagram_handle: string;
    character_name: string;
    photo_url: string;
    bio?: string;
  }) => Promise<void>;
}

const PRESET_PHOTOS = [
  { label: 'Cyberpunk Spider-Gwen', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Neon Spider-Woman', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Black Cat Symbiote', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Sci-Fi Heroine', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop' },
];

export const JoinTab: React.FC<JoinTabProps> = ({ t, onSubmitApplication }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    nickname: '',
    instagram_handle: '',
    character_name: '',
    photo_url: PRESET_PHOTOS[0].url,
    bio: '',
  });

  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Görsel boyutu maksimum 5MB olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, photo_url: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.nickname || !formData.instagram_handle || !formData.photo_url) {
      alert('Lütfen tüm gerekli alanları doldurunuz.');
      return;
    }

    setLoading(true);
    try {
      await onSubmitApplication(formData);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Başvuru gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#0F0F12] rounded-3xl border border-emerald-500/40 p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{t.applicationPending}</h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">
            {t.applicationSubmittedMsg}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Submit Another Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>{t.joinTitle}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tight uppercase">
          Enter the <span className="text-pink-500">Tournament</span>
        </h2>
        <p className="text-xs text-gray-400 max-w-xl mx-auto mt-2">
          {t.joinSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-[#0F0F12] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              {t.fullName} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Elena Rostova"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                {t.nickname} *
              </label>
              <input
                type="text"
                required
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="e.g. ValkyrieCosplay"
                className="w-full px-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                {t.instagramHandle} *
              </label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.instagram_handle}
                  onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                  placeholder="@your_instagram"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              {t.characterName}
            </label>
            <input
              type="text"
              value={formData.character_name}
              onChange={(e) => setFormData({ ...formData, character_name: e.target.value })}
              placeholder="e.g. Cyberpunk Spider-Gwen"
              className="w-full px-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-sm outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                {t.photoLabel}
              </label>
              
              {/* Toggle upload mode */}
              <div className="flex items-center gap-1 bg-[#151518] p-1 rounded-lg border border-white/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    uploadType === 'file'
                      ? 'bg-pink-500 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>{t.photoUploadFile}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('url')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    uploadType === 'url'
                      ? 'bg-pink-500 text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{t.photoUploadLink}</span>
                </button>
              </div>
            </div>

            {uploadType === 'file' ? (
              <div className="border-2 border-dashed border-white/15 hover:border-pink-500/50 bg-[#151518] rounded-2xl p-6 text-center transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {t.photoDropHint}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {t.photoFormats}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative mb-2">
                <Instagram className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder={t.photoUrlPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-xs outline-none transition-colors"
                />
              </div>
            )}

            {/* Quick Preset Selector */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[11px] text-gray-400 font-semibold">{t.photoExamples}</span>
              {PRESET_PHOTOS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, photo_url: preset.url, character_name: preset.label })}
                  className="px-2.5 py-1 rounded-lg bg-[#151518] border border-white/10 hover:border-pink-500 text-[11px] font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              {t.bio}
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell fans about your suit construction, materials, or cosplay story..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 focus:border-pink-500 text-white text-sm outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 hover:brightness-110 text-white font-black text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Submitting Application...' : t.submitApplication}</span>
          </button>
        </form>

        {/* Live Card Preview */}
        <div className="lg:col-span-5 bg-[#0F0F12] rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Arena Preview
          </span>

          <div className="w-full bg-[#151518] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <div className="relative h-72 overflow-hidden">
              <img
                src={formData.photo_url || PRESET_PHOTOS[0].url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_PHOTOS[0].url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xl font-black text-white">
                  {formData.nickname || 'Your Cosplay Nickname'}
                </h3>
                <p className="text-xs font-bold text-pink-500">
                  {formData.character_name || 'Character Title'}
                </p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs text-gray-400 border-t border-white/10">
              <span className="flex items-center gap-1 text-pink-400 font-semibold">
                <Instagram className="w-3.5 h-3.5" />
                {formData.instagram_handle || '@your_instagram'}
              </span>
              <span>0 Votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
