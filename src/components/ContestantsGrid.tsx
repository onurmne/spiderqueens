import React, { useState } from 'react';
import { Contestant } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { Search, Heart, Zap, Instagram, ExternalLink, Filter } from 'lucide-react';

interface ContestantsGridProps {
  t: TranslationDictionary;
  contestants: Contestant[];
  onVote: (contestantId: string, isSuperVote: boolean) => Promise<void>;
  onOpenStore: () => void;
}

export const ContestantsGrid: React.FC<ContestantsGridProps> = ({
  t,
  contestants,
  onVote,
  onOpenStore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'newest'>('votes');
  const [votingId, setVotingId] = useState<string | null>(null);

  const approvedQueens = contestants.filter((c) => c.status === 'approved');

  const filtered = approvedQueens
    .filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.nickname.toLowerCase().includes(term) ||
        c.character_name.toLowerCase().includes(term) ||
        c.full_name.toLowerCase().includes(term) ||
        c.instagram_handle.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes_count - a.votes_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleVote = async (contestantId: string, isSuperVote: boolean) => {
    setVotingId(contestantId);
    try {
      await onVote(contestantId, isSuperVote);
    } catch (err: any) {
      if (err.message === 'insufficient_super_votes') {
        onOpenStore();
      } else {
        alert(err.message || 'Voting failed');
      }
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">
            SpiderQueens <span className="text-pink-500">Directory</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Browse all approved cosplayers competing in the tournament.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nickname or character..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0F0F12] border border-white/10 focus:border-pink-500 text-white text-xs outline-none transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-[#0F0F12] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setSortBy('votes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                sortBy === 'votes' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Most Votes
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                sortBy === 'newest' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Newest
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base font-semibold">No cosplayers found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((queen) => (
            <div
              key={queen.id}
              className="bg-[#0F0F12] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-pink-500/50 transition-all flex flex-col justify-between group"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden bg-black">
                <img
                  src={queen.photo_url}
                  alt={queen.nickname}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-transparent to-black/20" />

                {/* Vote Counter Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-xs font-extrabold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  <span>{queen.votes_count}</span>
                </div>

                {/* Info at Bottom */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] text-pink-500 font-bold tracking-widest uppercase">{queen.full_name}</span>
                  <h3 className="text-xl font-black text-white">{queen.nickname}</h3>
                  <p className="text-xs font-bold text-gray-400">{queen.character_name}</p>
                </div>
              </div>

              {/* Body & Actions */}
              <div className="p-4 bg-[#0F0F12] flex flex-col gap-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <a
                    href={`https://instagram.com/${queen.instagram_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-400 hover:text-white font-semibold"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>{queen.instagram_handle}</span>
                  </a>
                  <span className="text-[11px] font-mono text-gray-500">{queen.votes_count} Votes</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    disabled={votingId === queen.id}
                    onClick={() => handleVote(queen.id, false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white text-black hover:bg-pink-500 hover:text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{t.voteFree} (+1)</span>
                  </button>

                  <button
                    disabled={votingId === queen.id}
                    onClick={() => handleVote(queen.id, true)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{t.superVote} (+5)</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
