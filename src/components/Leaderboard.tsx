import React from 'react';
import { Contestant } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { Crown, Trophy, Medal, Heart, Instagram, ExternalLink, Sparkles } from 'lucide-react';

interface LeaderboardProps {
  t: TranslationDictionary;
  contestants: Contestant[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ t, contestants }) => {
  const topQueens = contestants
    .filter((c) => c.status === 'approved')
    .sort((a, b) => b.votes_count - a.votes_count)
    .slice(0, 10);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="text-xl font-black text-yellow-500 italic">01</span>
      );
    }
    if (rank === 2) {
      return (
        <span className="text-xl font-black text-gray-400 italic">02</span>
      );
    }
    if (rank === 3) {
      return (
        <span className="text-xl font-black text-amber-600 italic">03</span>
      );
    }
    return (
      <span className="text-lg font-black text-gray-600 italic">0{rank}</span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-3">
          <Trophy className="w-4 h-4 text-pink-500" />
          <span>{t.appName} Official</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tight uppercase">
          {t.leaderboardTitle}
        </h2>
        <p className="text-xs text-gray-400 max-w-xl mx-auto mt-2">
          {t.leaderboardSubtitle}
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {topQueens.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
          
          {/* 2nd Place */}
          <div className="order-2 md:order-1 bg-[#0F0F12] rounded-2xl border border-white/10 p-5 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400" />
            <div className="relative mb-3">
              <img
                src={topQueens[1].photo_url}
                alt={topQueens[1].nickname}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-400 shadow-md"
              />
              <span className="absolute -bottom-2 right-0 bg-gray-400 text-black font-black text-xs px-2 py-0.5 rounded-full">
                #2
              </span>
            </div>
            <h3 className="font-black text-lg text-white uppercase">{topQueens[1].nickname}</h3>
            <p className="text-xs font-semibold text-pink-500">{topQueens[1].character_name}</p>
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs font-extrabold">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>{topQueens[1].votes_count} {t.votes}</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400 mt-2">Prize: $200 Gift Voucher</span>
          </div>

          {/* 1st Place - Gold Crown */}
          <div className="order-1 md:order-2 bg-[#151518] rounded-2xl border-2 border-yellow-500/60 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden scale-105">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500" />
            <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-yellow-500/40">
              Grand Winner
            </div>
            <div className="relative mb-3 mt-2">
              <img
                src={topQueens[0].photo_url}
                alt={topQueens[0].nickname}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-500 shadow-xl"
              />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 p-1 rounded-full shadow-lg">
                <Crown className="w-5 h-5 text-black fill-black" />
              </div>
            </div>
            <h3 className="font-black text-xl text-white flex items-center gap-1 uppercase">
              <span>{topQueens[0].nickname}</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h3>
            <p className="text-xs font-semibold text-pink-500">{topQueens[0].character_name}</p>
            <div className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/5 border border-yellow-500/40 text-yellow-400 text-sm font-black">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>{topQueens[0].votes_count} {t.votes}</span>
            </div>
            <span className="text-xs font-black text-yellow-400 mt-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
              Prize: $1,000 CASH
            </span>
          </div>

          {/* 3rd Place */}
          <div className="order-3 bg-[#0F0F12] rounded-2xl border border-white/10 p-5 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-700" />
            <div className="relative mb-3">
              <img
                src={topQueens[2].photo_url}
                alt={topQueens[2].nickname}
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-700 shadow-md"
              />
              <span className="absolute -bottom-2 right-0 bg-amber-700 text-amber-100 font-black text-xs px-2 py-0.5 rounded-full">
                #3
              </span>
            </div>
            <h3 className="font-black text-lg text-white uppercase">{topQueens[2].nickname}</h3>
            <p className="text-xs font-semibold text-pink-500">{topQueens[2].character_name}</p>
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs font-extrabold">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>{topQueens[2].votes_count} {t.votes}</span>
            </div>
            <span className="text-[11px] font-bold text-gray-400 mt-2">Prize: $50 Gift Voucher</span>
          </div>

        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-[#0F0F12] rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-3 space-y-2">
        {topQueens.map((queen, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          return (
            <div
              key={queen.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all relative overflow-hidden ${
                rank === 1
                  ? 'bg-white/5 border-yellow-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {rank === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />}
              {rank === 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400" />}
              {rank === 3 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-700" />}

              {/* Rank & Profile Info */}
              <div className="flex items-center gap-4">
                <div className="w-8 text-center flex justify-center">
                  {getRankBadge(rank)}
                </div>

                <img
                  src={queen.photo_url}
                  alt={queen.nickname}
                  className="w-10 h-10 rounded-xl object-cover border border-white/10"
                />

                <div>
                  <h4 className="font-extrabold text-white text-sm uppercase flex items-center gap-2">
                    <span>{queen.nickname}</span>
                  </h4>
                  <p className="text-xs text-pink-500 font-medium">{queen.character_name}</p>
                </div>
              </div>

              {/* Votes & Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-white flex items-center justify-end gap-1 font-mono">
                    <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                    <span>{queen.votes_count}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">{t.votes}</span>
                </div>

                <a
                  href={`https://instagram.com/${queen.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-pink-500 text-xs font-bold text-gray-300 hover:text-white transition-all"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>{queen.instagram_handle}</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
