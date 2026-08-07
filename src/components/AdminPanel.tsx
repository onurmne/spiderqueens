import React, { useState, useEffect } from 'react';
import { Contestant, Transaction } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { Shield, Check, X, ExternalLink, Copy, FileCode, Users, DollarSign, Heart, AlertCircle, CheckCircle2, Award, Sparkles, TrendingUp, Percent, Save, Zap } from 'lucide-react';

interface AdminPanelProps {
  t: TranslationDictionary;
  onAdminAction: (params: {
    type: 'contestant' | 'transaction';
    id: string;
    action: 'approve' | 'reject';
  }) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ t, onAdminAction }) => {
  const [activeTab, setActiveTab] = useState<'applicants' | 'transactions' | 'rewards' | 'sql'>('applicants');
  const [pendingApplicants, setPendingApplicants] = useState<Contestant[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ totalContestants: 0, totalVotes: 0 });
  const [sqlSchema, setSqlSchema] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic Reward Settings State
  const [settings, setSettings] = useState({
    pool_contribution_percentage: 20,
    base_first_prize: 1000,
    base_second_prize: 250,
    base_third_prize: 50,
    accumulated_pool_usd: 185.50,
    first_place_prize_usd: 1185.50,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/pending');
      const data = await res.json();
      setPendingApplicants(data.pendingApplicants || []);
      setPendingTransactions(data.pendingTransactions || []);
      setStats({
        totalContestants: data.totalContestants || 0,
        totalVotes: data.totalVotes || 0,
      });

      const schemaRes = await fetch('/api/schema.sql');
      const text = await schemaRes.text();
      setSqlSchema(text);

      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData && typeof settingsData.pool_contribution_percentage === 'number') {
        setSettings(settingsData);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (type: 'contestant' | 'transaction', id: string, action: 'approve' | 'reject') => {
    try {
      await onAdminAction({ type, id, action });
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pool_contribution_percentage: Number(settings.pool_contribution_percentage),
          base_first_prize: Number(settings.base_first_prize),
          base_second_prize: Number(settings.base_second_prize),
          base_third_prize: Number(settings.base_third_prize),
        }),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      alert('Failed to save reward settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            <span>{t.adminTitle}</span>
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">
            SpiderQueens <span className="text-pink-500">Control Center</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">{t.adminSubtitle}</p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0F0F12] p-1.5 rounded-2xl border border-white/10 flex-wrap">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'applicants'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Applicants ({pendingApplicants.length})
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Payments ({pendingTransactions.length})
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rewards'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Reward Pool</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Supabase SQL
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0F0F12] p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{stats.totalVotes}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400">{t.statsTotalVotes}</div>
          </div>
        </div>

        <div className="bg-[#0F0F12] p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{stats.totalContestants}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400">{t.statsTotalContestants}</div>
          </div>
        </div>

        <div className="bg-[#0F0F12] p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{pendingApplicants.length}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400">{t.statsPendingApps}</div>
          </div>
        </div>

        <div className="bg-[#0F0F12] p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-black text-white font-mono">{pendingTransactions.length}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400">{t.statsPendingPayments}</div>
          </div>
        </div>
      </div>

      {/* Tab 1: Pending Contestant Applicants */}
      {activeTab === 'applicants' && (
        <div className="bg-[#0F0F12] rounded-2xl border border-white/10 p-6 shadow-2xl">
          <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-4">{t.pendingApplicants}</h3>

          {pendingApplicants.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">{t.noPendingApplicants}</p>
          ) : (
            <div className="space-y-4">
              {pendingApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-[#151518] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={applicant.photo_url}
                      alt={applicant.nickname}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-black text-white text-base">{applicant.nickname}</h4>
                      <p className="text-xs font-semibold text-pink-400">{applicant.character_name}</p>
                      <p className="text-xs text-gray-400 mt-1">Full Name: {applicant.full_name}</p>
                      <a
                        href={`https://instagram.com/${applicant.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-pink-400 hover:underline mt-1 font-semibold"
                      >
                        <span>{applicant.instagram_handle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction('contestant', applicant.id, 'approve')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.approve}</span>
                    </button>

                    <button
                      onClick={() => handleAction('contestant', applicant.id, 'reject')}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                    >
                      <X className="w-4 h-4" />
                      <span>{t.reject}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Financial Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-[#0F0F12] rounded-2xl border border-white/10 p-6 shadow-2xl">
          <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-4">{t.pendingTransactions}</h3>

          {pendingTransactions.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">{t.noPendingTransactions}</p>
          ) : (
            <div className="space-y-4">
              {pendingTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-[#151518] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm font-black text-white">
                      <span>User: {tx.user_email}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono">
                        +{tx.super_votes_amount} Super Votes
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-4 font-mono">
                      <span>Amount: ${tx.amount}</span>
                      <span>Method: {tx.payment_method}</span>
                      <span>Crypto: {tx.crypto_asset || 'N/A'}</span>
                    </div>
                    {tx.tx_hash_or_note && (
                      <p className="text-xs text-gray-300 font-mono mt-2 bg-[#0F0F12] p-2 rounded-lg border border-white/10 break-all">
                        TX ID: {tx.tx_hash_or_note}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction('transaction', tx.id, 'approve')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.approve} & Credit</span>
                    </button>

                    <button
                      onClick={() => handleAction('transaction', tx.id, 'reject')}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                    >
                      <X className="w-4 h-4" />
                      <span>{t.reject}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reward & Pool Management */}
      {activeTab === 'rewards' && (
        <div className="bg-[#0F0F12] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span>Reward Pool & Profit Optimization</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Risk-Free Dynamic Growth Engine: 20% of all Super Vote sales are automatically injected into the 1st place prize pool.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono font-bold">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>Net Revenue Share Active</span>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#151518] p-4 rounded-xl border border-amber-500/30">
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Total 1st Prize</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ${(settings.base_first_prize + settings.accumulated_pool_usd).toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Base ${settings.base_first_prize} + Pool ${settings.accumulated_pool_usd.toFixed(2)}</div>
            </div>

            <div className="bg-[#151518] p-4 rounded-xl border border-emerald-500/30">
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Accumulated Pool</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                +${settings.accumulated_pool_usd.toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Auto-fed from sales</div>
            </div>

            <div className="bg-[#151518] p-4 rounded-xl border border-pink-500/30">
              <div className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Pool Contribution</span>
                <Percent className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {settings.pool_contribution_percentage}%
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Of gross Super Vote sales</div>
            </div>

            <div className="bg-[#151518] p-4 rounded-xl border border-purple-500/30">
              <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Net Profit Margin</span>
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">
                {100 - settings.pool_contribution_percentage}%
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Guaranteed house treasury retention</div>
            </div>
          </div>

          {/* Revenue Split Progress Bar */}
          <div className="bg-[#151518] p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Prize Pool Injection ({settings.pool_contribution_percentage}%)
              </span>
              <span className="text-pink-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>
                House Treasury Revenue ({100 - settings.pool_contribution_percentage}%)
              </span>
            </div>
            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${settings.pool_contribution_percentage}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
              ></div>
              <div
                style={{ width: `${100 - settings.pool_contribution_percentage}%` }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-500"
              ></div>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSaveSettings} className="bg-[#151518] p-6 rounded-xl border border-white/10 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Save className="w-4 h-4 text-pink-500" />
              <span>Update Prize Pool Parameters</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Base 1st Place Cash Prize ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.base_first_prize}
                  onChange={(e) => setSettings({ ...settings, base_first_prize: Number(e.target.value) })}
                  className="w-full bg-[#0F0F12] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Sales Pool Contribution Share (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={settings.pool_contribution_percentage}
                  onChange={(e) => setSettings({ ...settings, pool_contribution_percentage: Number(e.target.value) })}
                  className="w-full bg-[#0F0F12] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  2nd Place Voucher Prize ($ USD Value)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={settings.base_second_prize}
                  onChange={(e) => setSettings({ ...settings, base_second_prize: Number(e.target.value) })}
                  className="w-full bg-[#0F0F12] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  3rd Place Voucher Prize ($ USD Value)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={settings.base_third_prize}
                  onChange={(e) => setSettings({ ...settings, base_third_prize: Number(e.target.value) })}
                  className="w-full bg-[#0F0F12] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {settingsSaved ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reward settings successfully updated!</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">Updates take effect live immediately across all user screens.</span>
              )}

              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Supabase SQL Schema Exporter */}
      {activeTab === 'sql' && (
        <div className="bg-[#0F0F12] rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <FileCode className="w-5 h-5 text-pink-500" />
                <span>Supabase SQL Schema Script</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Copy and run this exact script in your Supabase SQL Editor to provision all database tables, constraints & triggers.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-4 py-2 rounded-xl bg-white hover:bg-gray-200 text-black font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg uppercase tracking-wider"
            >
              {copiedSql ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? t.copied : t.copySqlScript}</span>
            </button>
          </div>

          <pre className="bg-[#151518] p-4 rounded-xl border border-white/10 text-gray-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {sqlSchema || '-- Loading Supabase SQL schema...'}
          </pre>
        </div>
      )}

    </div>
  );
};
