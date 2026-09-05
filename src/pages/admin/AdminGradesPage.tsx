import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Award,
  Star,
  TrendingUp,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Trophy,
  Medal,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface StudentGradeRecord {
  id: string;
  studentName: string;
  groupName: string;
  attendanceScore: number;
  homeworkScore: number;
  testScore: number;
  totalScore: number;
  rank: number;
}

export const AdminGradesPage: React.FC = () => {
  const { students } = useCRM();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Concrete scores derived from Hadicha ustoz and Hasanboy ustoz's students
  const gradeRecords: StudentGradeRecord[] = useMemo(() => {
    const rawData = [
      { name: 'Azizbek', group: 'Matematika (Hadicha ustoz)', att: 100, hw: 98, test: 96 },
      { name: 'Shahjahon', group: 'Matematika (Hadicha ustoz)', att: 95, hw: 92, test: 90 },
      { name: 'Go‘zaloy', group: 'Matematika (Hadicha ustoz)', att: 90, hw: 88, test: 86 },
      { name: 'Quvonchoy', group: 'Matematika (Hadicha ustoz)', att: 90, hw: 86, test: 85 },
      { name: 'Asaloy', group: 'Matematika (Hadicha ustoz)', att: 92, hw: 85, test: 84 },
      { name: 'Habibullo', group: 'Matematika (Hadicha ustoz)', att: 88, hw: 84, test: 82 },
      { name: 'Zarina', group: 'Matematika (Hadicha ustoz)', att: 85, hw: 82, test: 80 },
      { name: 'Mushtariy', group: 'Matematika (Hadicha ustoz)', att: 85, hw: 80, test: 78 },
      { name: 'Munisa', group: 'Matematika (Hadicha ustoz)', att: 80, hw: 78, test: 75 },
      { name: 'Shahrizoda', group: 'Matematika (Hadicha ustoz)', att: 80, hw: 76, test: 75 },
      { name: 'Murodbek', group: 'Matematika (Hadicha ustoz)', att: 78, hw: 75, test: 72 },
    ];

    return rawData
      .map((item, idx) => {
        const total = Math.round((item.att * 0.3) + (item.hw * 0.3) + (item.test * 0.4));
        return {
          id: `STU-${idx + 1}`,
          studentName: item.name,
          groupName: item.group,
          attendanceScore: item.att,
          homeworkScore: item.hw,
          testScore: item.test,
          totalScore: total,
          rank: idx + 1,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, []);

  const filtered = useMemo(() => {
    return gradeRecords.filter((rec) => {
      if (searchQuery.trim() && !rec.studentName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [gradeRecords, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Akademik Natijalar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Baholar & O‘zlashtirish Reytingi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Davomat, uy vazifalari va oraliq testlar bo‘yicha 100 ballik shkala natijalari
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {filtered.slice(0, 3).map((podium, index) => (
          <div
            key={podium.id}
            className={`p-6 rounded-3xl border ${
              index === 0
                ? 'border-amber-400/50 bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-amber-600/10 dark:bg-amber-950/20 shadow-md'
                : 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs'
            } flex flex-col justify-between space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                    index === 0
                      ? 'bg-amber-500 text-white'
                      : index === 1
                      ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white'
                      : 'bg-amber-700 text-white'
                  }`}
                >
                  #{podium.rank}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {index === 0 ? '1-o‘rin (Oltin)' : index === 1 ? '2-o‘rin (Kumush)' : '3-o‘rin (Bronza)'}
                </span>
              </div>
              <Badge variant="warning">{podium.totalScore} ball</Badge>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {podium.studentName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{podium.groupName}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center">
              <div>
                <span className="text-slate-400 block">Davomat</span>
                <strong className="text-slate-700 dark:text-slate-200 font-mono">{podium.attendanceScore}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Vazifalar</span>
                <strong className="text-slate-700 dark:text-slate-200 font-mono">{podium.homeworkScore}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Test</span>
                <strong className="text-slate-700 dark:text-slate-200 font-mono">{podium.testScore}b</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Grades Table */}
      <div className="rounded-3xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            Barcha O‘quvchilar Reytingi
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O‘quvchi ismini qidirish..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-black uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">O‘rin</th>
                <th className="px-5 py-3.5">O‘quvchi FISH</th>
                <th className="px-5 py-3.5">Guruh</th>
                <th className="px-5 py-3.5 text-center">Davomat</th>
                <th className="px-5 py-3.5 text-center">Uy Vazifasi</th>
                <th className="px-5 py-3.5 text-center">Sinov Testi</th>
                <th className="px-5 py-3.5 text-right">Umumiy Natija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-500">
                    #{item.rank}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                        {item.studentName.charAt(0)}
                      </div>
                      <span>{item.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-medium">
                    {item.groupName}
                  </td>
                  <td className="px-5 py-4 text-center font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.attendanceScore}%</span>
                  </td>
                  <td className="px-5 py-4 text-center font-mono">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{item.homeworkScore}%</span>
                  </td>
                  <td className="px-5 py-4 text-center font-mono">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{item.testScore} ball</span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                    {item.totalScore} / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
