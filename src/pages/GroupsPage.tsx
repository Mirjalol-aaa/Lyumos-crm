import React, { useMemo, useState } from 'react';
import { useCRM } from '../context/CRMContext';
import type { Group, Teacher } from '../types/crm';
import {
  BookOpen,
  Plus,
  Users,
  Clock,
  MapPin,
  GraduationCap,
  Trash2,
  Pencil,
  X,
  Save,
  Search,
  ArrowUpRight,
  WalletCards,
  UserRoundCheck,
} from 'lucide-react';

interface GroupEditModalProps {
  group: Group;
  teachers: Teacher[];
  currencySymbol: string;
  onClose: () => void;
  onSave: (updated: Partial<Group>) => void;
}

const GroupEditModal: React.FC<GroupEditModalProps> = ({
  group,
  teachers,
  currencySymbol,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(group.name);
  const [subject, setSubject] = useState(group.subject);
  const [level, setLevel] = useState(group.level);
  const [teacherId, setTeacherId] = useState(group.teacherId);
  const [scheduleDays, setScheduleDays] = useState(group.scheduleDays);
  const [scheduleTime, setScheduleTime] = useState(group.scheduleTime);
  const [room, setRoom] = useState(group.room);
  const [monthlyFee, setMonthlyFee] = useState(group.monthlyFee);
  const [maxCapacity, setMaxCapacity] = useState(group.maxCapacity);
  const [status, setStatus] = useState(group.status);

  const handleSave = () => {
    if (!name.trim()) return;

    const selectedTeacher = teachers.find(
      (teacher) => teacher.id === teacherId
    );

    onSave({
      name: name.trim(),
      subject: subject.trim(),
      level: level.trim(),
      teacherId,
      teacherName: selectedTeacher?.fullName ?? group.teacherName,
      scheduleDays: scheduleDays.trim(),
      scheduleTime: scheduleTime.trim(),
      room: room.trim(),
      monthlyFee: Number(monthlyFee),
      maxCapacity: Number(maxCapacity),
      status,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-3xl
          max-h-[92vh] overflow-y-auto
          rounded-[32px]
          bg-white dark:bg-[#0d1628]
          border border-white/10
          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
          animate-in zoom-in-95 duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 p-7">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-500/5 to-transparent pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                <BookOpen className="w-6 h-6" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-purple-500 font-black">
                  Group Management
                </p>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Edit Study Group
                </h2>

                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {group.id}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="
                cursor-pointer
                w-10 h-10 rounded-xl
                flex items-center justify-center
                text-slate-400
                bg-slate-100 dark:bg-white/5
                hover:bg-rose-50 hover:text-rose-500
                dark:hover:bg-rose-500/10
                transition-all duration-200
                hover:rotate-90
              "
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-7 space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
              Group Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full rounded-2xl px-4 py-3
                bg-slate-50 dark:bg-white/[0.04]
                border border-slate-200 dark:border-white/10
                text-slate-900 dark:text-white
                outline-none
                focus:border-purple-500
                focus:ring-4 focus:ring-purple-500/10
                transition-all
              "
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Subject
              </label>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-slate-50 dark:bg-white/[0.04]
                  border border-slate-200 dark:border-white/10
                  outline-none
                  focus:border-purple-500
                  focus:ring-4 focus:ring-purple-500/10
                  transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Level
              </label>

              <input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-slate-50 dark:bg-white/[0.04]
                  border border-slate-200 dark:border-white/10
                  outline-none
                  focus:border-purple-500
                  focus:ring-4 focus:ring-purple-500/10
                  transition-all
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
              Assigned Teacher
            </label>

            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="
                cursor-pointer
                w-full rounded-2xl px-4 py-3
                bg-slate-50 dark:bg-[#141f33]
                border border-slate-200 dark:border-white/10
                outline-none
                focus:border-purple-500
                focus:ring-4 focus:ring-purple-500/10
                transition-all
              "
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Schedule Days
              </label>

              <input
                value={scheduleDays}
                onChange={(e) => setScheduleDays(e.target.value)}
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-slate-50 dark:bg-white/[0.04]
                  border border-slate-200 dark:border-white/10
                  outline-none
                  focus:border-purple-500
                  focus:ring-4 focus:ring-purple-500/10
                  transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Schedule Time
              </label>

              <input
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-slate-50 dark:bg-white/[0.04]
                  border border-slate-200 dark:border-white/10
                  outline-none
                  focus:border-purple-500
                  focus:ring-4 focus:ring-purple-500/10
                  transition-all
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
              Classroom
            </label>

            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="
                w-full rounded-2xl px-4 py-3
                bg-slate-50 dark:bg-white/[0.04]
                border border-slate-200 dark:border-white/10
                outline-none
                focus:border-purple-500
                focus:ring-4 focus:ring-purple-500/10
                transition-all
              "
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Monthly Fee
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  {currencySymbol}
                </span>

                <input
                  type="number"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(Number(e.target.value))}
                  className="
                    w-full rounded-2xl pl-9 pr-4 py-3
                    bg-slate-50 dark:bg-white/[0.04]
                    border border-slate-200 dark:border-white/10
                    outline-none
                    focus:border-purple-500
                    focus:ring-4 focus:ring-purple-500/10
                    transition-all
                  "
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Max Capacity
              </label>

              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="
                  w-full rounded-2xl px-4 py-3
                  bg-slate-50 dark:bg-white/[0.04]
                  border border-slate-200 dark:border-white/10
                  outline-none
                  focus:border-purple-500
                  focus:ring-4 focus:ring-purple-500/10
                  transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-black text-slate-500 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Group['status'])
                }
                className="
                  cursor-pointer
                  w-full rounded-2xl px-4 py-3
                  bg-slate-50 dark:bg-[#141f33]
                  border border-slate-200 dark:border-white/10
                  outline-none
                  focus:border-purple-500
                  focus:ring-4 focus:ring-purple-500/10
                  transition-all
                "
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/10 p-6 bg-slate-50/80 dark:bg-white/[0.02]">
          <button
            onClick={onClose}
            className="
              cursor-pointer
              px-5 py-3 rounded-2xl
              text-xs font-black
              text-slate-600 dark:text-slate-300
              bg-white dark:bg-white/5
              border border-slate-200 dark:border-white/10
              hover:bg-slate-100 dark:hover:bg-white/10
              transition-all
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              cursor-pointer
              px-6 py-3 rounded-2xl
              text-xs font-black text-white
              bg-gradient-to-r from-purple-600 to-blue-600
              shadow-lg shadow-purple-600/25
              hover:shadow-xl hover:shadow-purple-600/30
              hover:-translate-y-0.5
              active:translate-y-0
              transition-all
              flex items-center gap-2
            "
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const GroupsPage: React.FC = () => {
  const {
    groups,
    teachers,
    deleteGroup,
    updateGroup,
    setIsAddGroupModalOpen,
    selectedGroupId,
    setSelectedGroupId,
    settings,
  } = useCRM();

  const [search, setSearch] = useState('');

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? null;

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return groups;

    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(term) ||
        group.subject.toLowerCase().includes(term) ||
        group.teacherName.toLowerCase().includes(term) ||
        group.level.toLowerCase().includes(term)
    );
  }, [groups, search]);

  const activeGroups = groups.filter(
    (group) => group.status === 'Active'
  ).length;

  const totalStudents = groups.reduce(
    (sum, group) => sum + group.currentStudentsCount,
    0
  );

  const totalCapacity = groups.reduce(
    (sum, group) => sum + group.maxCapacity,
    0
  );

  return (
    <div className="p-6 md:p-8 space-y-7 max-w-7xl mx-auto">

      {/* Professional Header */}
      <div className="relative overflow-hidden rounded-[30px] border border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#0d1628] p-7 shadow-sm">
        <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-500">
                Academic Management
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Study Groups
            </h1>

            <p className="text-sm text-slate-500 mt-2 max-w-2xl">
              Manage cohorts, teachers, classrooms, schedules and capacity from
              one place.
            </p>
          </div>

          <button
            onClick={() => setIsAddGroupModalOpen(true)}
            className="
              cursor-pointer
              px-5 py-3.5 rounded-2xl
              bg-gradient-to-r from-purple-600 to-blue-600
              text-white text-xs font-black
              shadow-lg shadow-purple-600/20
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-purple-600/30
              active:translate-y-0
              transition-all duration-200
              flex items-center gap-2
            "
          >
            <Plus className="w-4 h-4" />
            Create Study Group
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#0d1628] border border-slate-200/70 dark:border-white/10 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500 font-semibold">
              Total Groups
            </p>
            <p className="text-2xl font-black">{groups.length}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0d1628] border border-slate-200/70 dark:border-white/10 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <UserRoundCheck className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500 font-semibold">
              Active Groups
            </p>
            <p className="text-2xl font-black">{activeGroups}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0d1628] border border-slate-200/70 dark:border-white/10 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs text-slate-500 font-semibold">
              Students / Capacity
            </p>
            <p className="text-2xl font-black">
              {totalStudents}
              <span className="text-sm text-slate-400 font-bold">
                {' '}
                / {totalCapacity}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups, teachers, subjects..."
            className="
              w-full pl-11 pr-4 py-3
              rounded-2xl
              bg-white dark:bg-[#0d1628]
              border border-slate-200 dark:border-white/10
              outline-none
              text-sm
              focus:border-purple-500
              focus:ring-4 focus:ring-purple-500/10
              transition-all
            "
          />
        </div>
      </div>

      {/* Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const fillPercentage =
            group.maxCapacity > 0
              ? Math.round(
                  (group.currentStudentsCount / group.maxCapacity) * 100
                )
              : 0;

          const isNearlyFull = fillPercentage >= 85;

          return (
            <div
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className="
                group relative overflow-hidden
                cursor-pointer
                rounded-[28px]
                bg-white dark:bg-[#0d1628]
                border border-slate-200/80 dark:border-white/10
                p-6
                shadow-sm
                hover:shadow-[0_22px_60px_rgba(15,23,42,0.16)]
                dark:hover:shadow-[0_22px_60px_rgba(0,0,0,0.35)]
                hover:border-purple-400/60
                dark:hover:border-purple-500/40
                hover:-translate-y-1.5
                transition-all duration-300
              "
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute -right-12 -top-12 w-36 h-36 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />

              {/* Top */}
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {group.subject}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        group.status === 'Active'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {group.name}
                  </h3>

                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    {group.level}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black bg-slate-100 dark:bg-white/5 text-slate-500">
                    {group.id}
                  </span>

                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>

              {/* Teacher */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50/90 dark:bg-white/[0.035] border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                      Teacher
                    </p>

                    <p className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                      {group.teacherName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      {group.scheduleDays}
                    </p>
                    <p className="text-[10px] mt-0.5">
                      {group.scheduleTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      {group.room}
                    </p>
                    <p className="text-[10px] mt-0.5">Classroom</p>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="mt-6">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                      Capacity
                    </p>

                    <p className="text-sm font-black mt-1">
                      {group.currentStudentsCount}
                      <span className="text-slate-400 font-semibold">
                        {' '}
                        / {group.maxCapacity} students
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-xs font-black ${
                      isNearlyFull
                        ? 'text-rose-500'
                        : 'text-purple-600'
                    }`}
                  >
                    {fillPercentage}%
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNearlyFull
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                        : 'bg-gradient-to-r from-purple-600 to-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(fillPercentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <WalletCards className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider font-black text-slate-400">
                      Monthly Fee
                    </p>

                    <p className="text-base font-black text-slate-900 dark:text-white">
                      {settings.currencySymbol}
                      {group.monthlyFee}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroupId(group.id);
                    }}
                    className="
                      cursor-pointer
                      px-4 py-2.5 rounded-xl
                      bg-purple-50 dark:bg-purple-500/10
                      text-purple-600 dark:text-purple-400
                      text-xs font-black
                      hover:bg-purple-600 hover:text-white
                      hover:scale-105
                      transition-all
                      flex items-center gap-1.5
                    "
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (confirm(`Delete group ${group.name}?`)) {
                        deleteGroup(group.id);
                      }
                    }}
                    className="
                      cursor-pointer
                      w-10 h-10 rounded-xl
                      flex items-center justify-center
                      text-rose-500
                      bg-rose-50 dark:bg-rose-500/10
                      hover:bg-rose-500 hover:text-white
                      hover:scale-105
                      transition-all
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedGroup && (
        <GroupEditModal
          key={selectedGroup.id}
          group={selectedGroup}
          teachers={teachers}
          currencySymbol={settings.currencySymbol}
          onClose={() => setSelectedGroupId(null)}
          onSave={(updated) =>
            updateGroup(selectedGroup.id, updated)
          }
        />
      )}
    </div>
  );
};