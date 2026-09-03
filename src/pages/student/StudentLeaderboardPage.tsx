import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export const StudentLeaderboardPage: React.FC = () => {
  const { students, groups } = useCRM();
  const { activeStudentId, getLeaderboard } = useLMS();

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const myGroup = groups.find(g => g.id === currentStudent?.groupId);

  const leaderboard = getLeaderboard(currentStudent?.groupId);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {myGroup?.name || 'Guruh'}
            </span>
            <span className="text-xs text-slate-400">Jami {leaderboard.length} ta o‘quvchi</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Guruh Reytingi (Leaderboard)
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Reyting 100 ballik uyga vazifalar natijalari (75%) va darslardagi davomat ko‘rsatkichi (25%) asosida real vaqtda hisoblanadi.
          </p>
        </div>
      </div>

      {/* Podium Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
          {/* 2nd Place */}
          {top2 && (
            <div className="flex flex-col items-center justify-end rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:order-1">
              <div className="relative">
                <img
                  src={top2.avatar || 'https://randomuser.me/api/portraits/women/2.jpg'}
                  alt={top2.studentName}
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-slate-300 dark:ring-slate-700"
                />
                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-700 shadow-md">
                  🥈 2
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                {top2.studentName}
              </h3>
              <p className="mt-1 text-xs font-black text-slate-500">
                {top2.totalPoints} umumiy ball
              </p>
              <div className="mt-2 flex gap-2 text-[10px] text-slate-400">
                <span>Vazifa: {top2.averageScore} ball</span>
                <span>•</span>
                <span>Davomat: {top2.attendanceRate}%</span>
              </div>
            </div>
          )}

          {/* 1st Place (Champion) */}
          {top1 && (
            <div className="relative flex flex-col items-center justify-end rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/10 via-white to-white p-6 text-center shadow-lg shadow-amber-500/10 dark:border-amber-500/50 dark:via-slate-900 dark:to-slate-900 sm:-translate-y-3 sm:order-2">
              <Crown className="absolute -top-4 h-8 w-8 text-amber-500" />
              <div className="relative">
                <img
                  src={top1.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={top1.studentName}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-400"
                />
                <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-amber-950 shadow-md">
                  🥇 1
                </span>
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900 dark:text-white">
                {top1.studentName}
              </h3>
              <p className="mt-1 text-sm font-black text-amber-600 dark:text-amber-400">
                {top1.totalPoints} umumiy ball
              </p>
              <div className="mt-2 flex gap-2 text-[11px] font-bold text-slate-500">
                <span>Vazifa: {top1.averageScore} ball</span>
                <span>•</span>
                <span>Davomat: {top1.attendanceRate}%</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="flex flex-col items-center justify-end rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:order-3">
              <div className="relative">
                <img
                  src={top3.avatar || 'https://randomuser.me/api/portraits/men/3.jpg'}
                  alt={top3.studentName}
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-amber-700/50"
                />
                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-700/20 text-xs font-black text-amber-800 dark:text-amber-300 shadow-md">
                  🥉 3
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                {top3.studentName}
              </h3>
              <p className="mt-1 text-xs font-black text-slate-500">
                {top3.totalPoints} umumiy ball
              </p>
              <div className="mt-2 flex gap-2 text-[10px] text-slate-400">
                <span>Vazifa: {top3.averageScore} ball</span>
                <span>•</span>
                <span>Davomat: {top3.attendanceRate}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Ranking Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-5 py-3">O‘rin</th>
                <th className="px-5 py-3">Talaba</th>
                <th className="px-5 py-3 text-center">Uyga Vazifalar O‘rtachasi (100 ball)</th>
                <th className="px-5 py-3 text-center">Davomat %</th>
                <th className="px-5 py-3 text-right">Umumiy Reyting Bali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((item) => {
                const isMe = item.studentId === currentStudent?.id;

                return (
                  <tr
                    key={item.studentId}
                    className={`transition-colors ${
                      isMe
                        ? 'bg-emerald-50/70 font-bold dark:bg-emerald-950/40'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                          item.rank === 1
                            ? 'bg-amber-400 text-amber-950'
                            : item.rank === 2
                            ? 'bg-slate-200 text-slate-800'
                            : item.rank === 3
                            ? 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        #{item.rank}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                          alt={item.studentName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.studentName}
                            </span>
                            {isMe && (
                              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                                Siz
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {item.groupName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {item.averageScore} / 100 ball
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {item.attendanceRate}%
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {item.totalPoints} ball
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
