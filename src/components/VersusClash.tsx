import React, { useState, useEffect, useMemo } from 'react';
import { Contestant, UserProfile } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Zap, RefreshCw, Instagram, Sparkles, AlertCircle, ShieldAlert, CheckCircle2, Trophy, Gift, DollarSign, Award } from 'lucide-react';

interface VersusClashProps {
  t: TranslationDictionary;
  contestants: Contestant[];
  freeVotesRemaining: number;
  userProfile: UserProfile;
  onVote: (contestantId: string, isSuperVote: boolean) => Promise<void>;
  onOpenStore: () => void;
}

export const VersusClash: React.FC<VersusClashProps> = ({
  t,
  contestants,
  freeVotesRemaining,
  userProfile,
  onVote,
  onOpenStore,
}) => {
  const approvedList = contestants.filter((c) => c.status === 'approved');

  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(1);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  const activities = useMemo(() => {
    if (approvedList.length === 0) return ['Arena is active and waiting for contestants!'];
    return [
      `User_${Math.floor(100 + Math.random() * 800)} cast a Super Vote for ${approvedList[0]?.nickname || 'Cosplayer'}!`,
      `Gamer_${Math.floor(100 + Math.random() * 800)} voted for ${approvedList[1 % approvedList.length]?.nickname || 'Cosplayer'}!`,
      `CosplayFan_${Math.floor(10 + Math.random() * 90)} purchased 25 Super Votes in Store!`,
      `Voter_${Math.floor(100 + Math.random() * 800)} voted for ${approvedList[2 % approvedList.length]?.nickname || 'Cosplayer'}!`,
      `QueenSupporter_${Math.floor(10 + Math.random() * 90)} boosted ${approvedList[3 % approvedList.length]?.nickname || approvedList[0]?.nickname}!`,
    ];
  }, [approvedList]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveActivityIndex((prev) => (prev + 1) % activities.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [activities.length]);

  const leftCosplayer = approvedList[leftIndex] || approvedList[0];
  const rightCosplayer = approvedList[rightIndex] || approvedList[1] || approvedList[0];

  const handleNextPair = () => {
    if (approvedList.length <= 1) return;
    setLeftIndex((prevL) => {
      let nextL = (prevL + 1) % approvedList.length;
      setRightIndex((prevR) => {
        let nextR = (prevR + 1) % approvedList.length;
        if (nextL === nextR) {
          nextR = (nextR + 1) % approvedList.length;
        }
        return nextR;
      });
      return nextL;
    });
  };

  const handleCastVote = async (contestant: Contestant, isSuperVote: boolean) => {
    setVotingId(contestant.id);
    setFeedbackMsg(null);

    try {
      await onVote(contestant.id, isSuperVote);
      setFeedbackMsg({
        text: isSuperVote ? t.superVoteSuccess : t.voteSuccess,
        type: 'success',
      });

      // Auto-advance to next matchup pair seamlessly
      setTimeout(() => {
        handleNextPair();
        setFeedbackMsg(null);
      }, 700);

    } catch (err: any) {
      if (err.message === 'self_vote_forbidden') {
        setFeedbackMsg({ text: t.selfVoteError, type: 'error' });
      } else if (err.message === 'ip_limit_reached') {
        setFeedbackMsg({ text: t.ipLimitError, type: 'error' });
      } else if (err.message === 'insufficient_super_votes') {
        onOpenStore();
      } else {
        setFeedbackMsg({ text: err.message || 'Bir hata oluştu', type: 'error' });
      }
    } finally {
      setVotingId(null);
    }
  };

  if (!leftCosplayer || !rightCosplayer) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-semibold">No approved cosplayers in the arena yet.</p>
        <p className="text-sm mt-1">Submit your entry in the 'Join Contest' tab!</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      {/* Arena Header & Daily Status Bar */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.headToHead}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight uppercase">
          SpiderQueens <span className="text-pink-500">Clash Arena</span>
        </h1>

        {/* Free Vote Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs font-bold shadow-lg">
            <span className="text-pink-500 font-bold">⚡ {t.dailyFreeVotesLeft}:</span>
            <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded ${
              freeVotesRemaining > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {freeVotesRemaining} / 5
            </span>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xl ${
                feedbackMsg.type === 'error'
                  ? 'bg-red-950/90 border border-red-500/60 text-red-300'
                  : 'bg-emerald-950/90 border border-emerald-500/60 text-emerald-300'
              }`}
            >
              {feedbackMsg.type === 'error' ? (
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Versus Battle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
        
        {/* VS Badge in Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center font-black text-xl italic text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border-2 border-white/20">
            VS
          </div>
        </div>

        {/* Left Contestant Card */}
        <motion.div
          key={leftCosplayer.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group rounded-2xl overflow-hidden border-2 border-white/10 hover:border-pink-500/50 transition-all flex flex-col justify-between bg-[#151518] shadow-2xl"
        >
          {/* Watermark background text */}
          <div className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white/5 pointer-events-none select-none z-0">
            QUEEN
          </div>

          {/* Cosplay Photo Container */}
          <div className="relative h-72 sm:h-96 md:h-[420px] overflow-hidden z-10">
            <img
              src={leftCosplayer.photo_url}
              alt={leftCosplayer.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            
            {/* Votes Counter Badge */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{leftCosplayer.votes_count} {t.totalVotes}</span>
            </div>

            {/* Instagram Tag */}
            <a
              href={`https://instagram.com/${leftCosplayer.instagram_handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 bg-black/70 hover:bg-pink-600 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-pink-400 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{leftCosplayer.instagram_handle}</span>
            </a>

            {/* Info Overlay at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <span className="text-pink-500 text-xs font-bold tracking-widest uppercase">
                {leftCosplayer.full_name}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-0.5">{leftCosplayer.nickname}</h3>
              <p className="text-gray-400 text-xs mb-3">
                {leftCosplayer.character_name} • {leftCosplayer.votes_count} Votes
              </p>
            </div>
          </div>

          {/* Voting Action Buttons */}
          <div className="p-3.5 sm:p-4 bg-[#0F0F12] border-t border-white/10 flex items-center gap-2.5 z-20">
            <button
              id={`vote-free-left-${leftCosplayer.id}`}
              disabled={votingId === leftCosplayer.id}
              onClick={() => handleCastVote(leftCosplayer, false)}
              className="flex-1 py-3 px-3 sm:px-4 rounded-xl bg-white text-black hover:bg-pink-500 hover:text-white font-black text-xs transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{t.voteFree} (+1)</span>
            </button>

            <button
              id={`vote-super-left-${leftCosplayer.id}`}
              disabled={votingId === leftCosplayer.id}
              onClick={() => handleCastVote(leftCosplayer, true)}
              className="py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{t.superVote} (+5)</span>
            </button>
          </div>
        </motion.div>

        {/* Mobile VS Separator */}
        <div className="flex md:hidden justify-center my-[-8px] z-30">
          <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center font-black text-sm italic text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] border-2 border-white/20">
            VS
          </div>
        </div>

        {/* Right Contestant Card */}
        <motion.div
          key={rightCosplayer.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group rounded-2xl overflow-hidden border-2 border-white/10 hover:border-blue-500/50 transition-all flex flex-col justify-between bg-[#18181B] shadow-2xl"
        >
          {/* Watermark background text */}
          <div className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white/5 pointer-events-none select-none z-0">
            GODDESS
          </div>

          {/* Cosplay Photo Container */}
          <div className="relative h-72 sm:h-96 md:h-[420px] overflow-hidden z-10">
            <img
              src={rightCosplayer.photo_url}
              alt={rightCosplayer.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            
            {/* Votes Counter Badge */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{rightCosplayer.votes_count} {t.totalVotes}</span>
            </div>

            {/* Instagram Tag */}
            <a
              href={`https://instagram.com/${rightCosplayer.instagram_handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 bg-black/70 hover:bg-blue-600 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-400 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{rightCosplayer.instagram_handle}</span>
            </a>

            {/* Info Overlay at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">
                {rightCosplayer.full_name}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-0.5">{rightCosplayer.nickname}</h3>
              <p className="text-gray-400 text-xs mb-3">
                {rightCosplayer.character_name} • {rightCosplayer.votes_count} Votes
              </p>
            </div>
          </div>

          {/* Voting Action Buttons */}
          <div className="p-3.5 sm:p-4 bg-[#0F0F12] border-t border-white/10 flex items-center gap-2.5 z-20">
            <button
              id={`vote-free-right-${rightCosplayer.id}`}
              disabled={votingId === rightCosplayer.id}
              onClick={() => handleCastVote(rightCosplayer, false)}
              className="flex-1 py-3 px-3 sm:px-4 rounded-xl bg-white text-black hover:bg-blue-500 hover:text-white font-black text-xs transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{t.voteFree} (+1)</span>
            </button>

            <button
              id={`vote-super-right-${rightCosplayer.id}`}
              disabled={votingId === rightCosplayer.id}
              onClick={() => handleCastVote(rightCosplayer, true)}
              className="py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{t.superVote} (+5)</span>
            </button>
          </div>
        </motion.div>

      </div>

      {/* Prize Rewards Banner Section */}
      <div className="mt-8 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">{t.prizeBannerTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <h4 className="text-lg font-black text-white italic">
                $1,250 {t.prizePool}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            {/* 1st Place */}
            <div className="bg-[#0F0F12]/80 backdrop-blur-md border border-amber-500/40 rounded-xl p-3 flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-black text-xs border border-yellow-500/40">
                1st
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">#1 Place</span>
                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.firstPlacePrize}</span>
                </span>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="bg-[#0F0F12]/80 backdrop-blur-md border border-gray-400/30 rounded-xl p-3 flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-gray-400/20 text-gray-300 flex items-center justify-center font-black text-xs border border-gray-400/30">
                2nd
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">#2 Place</span>
                <span className="text-xs font-black text-gray-200 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-pink-400" />
                  <span>{t.secondPlacePrize}</span>
                </span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-[#0F0F12]/80 backdrop-blur-md border border-amber-800/30 rounded-xl p-3 flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-amber-800/20 text-amber-500 flex items-center justify-center font-black text-xs border border-amber-800/30">
                3rd
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">#3 Place</span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.thirdPlacePrize}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Status Strip */}
      <div className="mt-8 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex gap-3 items-center overflow-hidden">
          <span className="font-extrabold text-pink-400 uppercase tracking-widest text-[10px] flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            RECENT ACTIVITY:
          </span>
          <div className="hidden sm:flex -space-x-2 shrink-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 border-2 border-[#0A0A0C]" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-[#0A0A0C]" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 border-2 border-[#0A0A0C]" />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeActivityIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-gray-200 font-semibold truncate"
            >
              {activities[activeActivityIndex] || `Live arena active and accepting votes!`}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="text-pink-500 font-bold shrink-0 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>Live Arena Active</span>
        </div>
      </div>
    </div>
  );
};
