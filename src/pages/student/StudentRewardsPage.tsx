import React, { useState } from 'react';
import { INITIAL_REWARDS } from '../../data/rewardsData';
import { RewardItem } from '../../types/admin';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  Coins,
  Gift,
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  Zap,
} from 'lucide-react';

export const StudentRewardsPage: React.FC = () => {
  const [coinsBalance, setCoinsBalance] = useState<number>(340);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  const handleRedeem = (reward: RewardItem) => {
    if (coinsBalance < reward.costCoins) {
      alert('Tangalaringiz yetarli emas! Ko‘proq vazifalarni 90+ ball bilan topshirib tanga to‘plang.');
      return;
    }

    setCoinsBalance(prev => prev - reward.costCoins);
    setClaimedReward(reward.title);
    setTimeout(() => setClaimedReward(null), 4000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Gamification & Rewards
            </span>
            <span className="text-xs text-slate-400">Yig‘ilgan ballaringizni sovg‘alarga almashtiring</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Lumos Coins Sovg‘alar Do‘koni
          </h1>
        </div>

        {/* Current Coins Balance Widget */}
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-500/10 to-amber-500/20 px-4 py-2.5 shadow-sm dark:border-amber-900 dark:from-amber-950/40 dark:to-amber-900/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-amber-950 font-black shadow-md shadow-amber-500/30">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Sizning Tangalaringiz
            </span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">
              {coinsBalance} Coins
            </p>
          </div>
        </div>
      </div>

      {/* Alert if redeemed */}
      {claimedReward && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Tabriklaymiz! Siz muvaffaqiyatli <strong>"{claimedReward}"</strong> sovg‘asini xarid qildingiz. Administrator tez orada siz bilan bog‘lanadi!</span>
        </div>
      )}

      {/* Gamification Level Progression */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black shadow-lg shadow-amber-500/20">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Level 7
                </span>
                <span className="text-xs font-bold text-slate-500">Academic Scholar</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Keyingi darajagacha: 260 XP kerak (Level 8: Master)
              </h3>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Progress:</span>
              <span className="text-amber-600">740 / 1000 XP</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '74%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {rewards.map((reward) => {
          const canAfford = coinsBalance >= reward.costCoins;

          return (
            <div
              key={reward.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {reward.category}
                  </span>
                  <Badge variant="amber" hasDot>
                    {reward.costCoins} Coins
                  </Badge>
                </div>

                <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  {reward.icon === 'FileText' && <FileText className="h-7 w-7" />}
                  {reward.icon === 'GraduationCap' && <GraduationCap className="h-7 w-7" />}
                  {reward.icon === 'Sparkles' && <Sparkles className="h-7 w-7" />}
                  {reward.icon === 'Award' && <Award className="h-7 w-7" />}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {reward.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                  {reward.description}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Button
                  size="sm"
                  variant={canAfford ? 'indigo' : 'secondary'}
                  className="w-full"
                  disabled={!canAfford}
                  onClick={() => handleRedeem(reward)}
                >
                  {canAfford ? `${reward.costCoins} Coins bilan olish` : `Yetarli emas (${reward.costCoins})`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
