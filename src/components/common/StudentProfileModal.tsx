import React, { useEffect, useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import type { Student } from '../../types/crm';
import {
  X,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  BookOpen,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
  Save,
  UserRound,
  UserCheck,
  WalletCards,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type MainTab = 'profile' | 'payments';

interface EditFormState {
  fullName: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  groupId: string;
  monthlyFee: number;
  status: string;
  joinedDate: string;
  address: string;
  notes: string;
}

const fieldClass = `
  w-full rounded-xl
  border border-slate-700
  bg-slate-800
  px-3.5 py-2.5
  text-sm text-white
  outline-none
  transition-all
  focus:border-blue-500
  focus:ring-2 focus:ring-blue-500/15
`;

const labelClass =
  'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400';

export const StudentProfileModal: React.FC = () => {
  const {
    selectedStudentId,
    setSelectedStudentId,
    students,
    groups,
    teachers,
    updateStudent,
    deleteStudent,
    setIsReceivePaymentModalOpen,
    setPaymentModalDefaultStudentId,
    settings,
  } = useCRM();

  const [activeTab, setActiveTab] =
    useState<MainTab>('profile');

  const [isEditing, setIsEditing] =
    useState(false);

  const [form, setForm] =
    useState<EditFormState>({
      fullName: '',
      birthDate: '',
      gender: 'Male',
      phone: '',
      email: '',
      parentName: '',
      parentPhone: '',
      groupId: '',
      monthlyFee: 0,
      status: 'Active',
      joinedDate: '',
      address: '',
      notes: '',
    });

  const student = students.find(
    s => s.id === selectedStudentId
  );

  useEffect(() => {
    if (!student) return;

    setForm({
      fullName: student.fullName ?? '',
      birthDate: student.birthDate ?? '',
      gender: student.gender ?? 'Male',
      phone: student.phone ?? '',
      email: student.email ?? '',
      parentName: student.parentName ?? '',
      parentPhone: student.parentPhone ?? '',
      groupId: student.groupId ?? '',
      monthlyFee: Number(student.monthlyFee ?? 0),
      status: student.status ?? 'Active',
      joinedDate: student.joinedDate ?? '',
      address: student.address ?? '',
      notes: student.notes ?? '',
    });
  }, [student?.id]);

  if (!selectedStudentId || !student) {
    return null;
  }

  const months = [
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  const selectedGroup =
    groups.find(g => g.id === form.groupId);

  const selectedTeacher =
    teachers.find(
      t => t.id === selectedGroup?.teacherId
    );

  const handlePayment = () => {
    setPaymentModalDefaultStudentId(
      student.id
    );

    setIsReceivePaymentModalOpen(true);

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const handleSave = () => {
    if (!form.fullName.trim()) {
      alert('Student name is required');
      return;
    }

    updateStudent(student.id, {
      fullName: form.fullName.trim(),
      birthDate: form.birthDate,
      gender:
        form.gender as Student['gender'],
      phone: form.phone.trim(),
      email: form.email.trim(),
      parentName: form.parentName.trim(),
      parentPhone:
        form.parentPhone.trim(),

      groupId: form.groupId,

      groupName:
        selectedGroup?.name ??
        student.groupName,

      teacherId:
        selectedGroup?.teacherId ??
        student.teacherId,

      teacherName:
        selectedTeacher?.fullName ??
        selectedGroup?.teacherName ??
        student.teacherName,

      monthlyFee:
        Number(form.monthlyFee),

      status:
        form.status as Student['status'],

      joinedDate: form.joinedDate,

      address:
        form.address.trim() || undefined,

      notes:
        form.notes.trim() || undefined,
    });

    setIsEditing(false);
  };

  const paymentBadge = (
    status: string
  ) => {
    if (status === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </span>
      );
    }

    if (status === 'Overdue') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-400">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </span>
      );
    }

    if (status === 'Discount') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-400">
          <CheckCircle2 className="h-3 w-3" />
          Discount
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">
        <Clock className="h-3 w-3" />
        Unpaid
      </span>
    );
  };

  return (
    <div
      onClick={() =>
        setSelectedStudentId(null)
      }
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70
        p-2 sm:p-5
        backdrop-blur-md
      "
    >
      <div
        onClick={e =>
          e.stopPropagation()
        }
        className="
          flex
          h-[92vh] sm:h-[84vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl sm:rounded-[26px]
          border border-slate-700/60
          bg-[#0b1322]
          shadow-[0_30px_100px_rgba(0,0,0,.55)]
        "
      >
        {/* HEADER */}

        <div
          className="
            relative
            shrink-0
            border-b
            border-white/10
            bg-gradient-to-r
            from-[#111c30]
            to-[#0e213b]
            px-4 sm:px-6 py-4 sm:py-5
          "
        >
          <button
            onClick={() =>
              setSelectedStudentId(null)
            }
            className="
              absolute
              right-3.5 top-3.5 sm:right-5 sm:top-5
              flex h-8 w-8 sm:h-9 sm:w-9
              cursor-pointer
              items-center justify-center
              rounded-xl
              bg-white/5
              text-slate-300
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            <X className="h-4 w-4" />
          </button>

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-start
              md:items-center
              justify-between
              gap-3 md:gap-5
              pr-10 md:pr-12
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3 sm:gap-4
              "
            >
              <img
                src={student.avatar}
                alt={student.fullName}
                className="
                  h-12 w-12 sm:h-16 sm:w-16
                  shrink-0
                  rounded-xl sm:rounded-2xl
                  object-cover
                  ring-2 ring-blue-500/40
                "
              />

              <div className="min-w-0">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-1.5 sm:gap-2
                  "
                >
                  <h2
                    className="
                      truncate
                      text-base sm:text-xl
                      font-black
                      text-white
                    "
                  >
                    {student.fullName}
                  </h2>

                  <span
                    className="
                      rounded-md
                      bg-slate-800
                      px-1.5 py-0.5 sm:px-2 sm:py-1
                      font-mono
                      text-[9px]
                      font-bold
                      text-slate-400
                    "
                  >
                    {student.id}
                  </span>

                  <span
                    className="
                      rounded-md
                      bg-emerald-500/10
                      px-1.5 py-0.5 sm:px-2 sm:py-1
                      text-[9px]
                      font-bold
                      uppercase
                      text-emerald-400
                    "
                  >
                    {student.status}
                  </span>
                </div>

                <div
                  className="
                    mt-1.5 sm:mt-2
                    flex
                    flex-wrap
                    gap-2 sm:gap-4
                    text-[10px] sm:text-[11px]
                    font-medium
                    text-slate-400
                  "
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {student.groupName}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {student.teacherName}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <div
                className="
                  flex
                  flex-wrap
                  shrink-0
                  items-center
                  gap-1.5 sm:gap-2
                  mt-1 md:mt-0
                "
              >
                <button
                  onClick={handlePayment}
                  className="
                    cursor-pointer
                    rounded-xl
                    bg-blue-600
                    px-3 sm:px-4 py-2 sm:py-2.5
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-500
                  "
                >
                  To‘lov Qabul Qilish
                </button>

                <button
                  onClick={() =>
                    setIsEditing(true)
                  }
                  className="
                    flex
                    cursor-pointer
                    items-center gap-1.5 sm:gap-2
                    rounded-xl
                    border border-slate-600
                    bg-slate-800
                    px-3 sm:px-4 py-2 sm:py-2.5
                    text-xs
                    font-bold
                    text-slate-200
                    transition
                    hover:border-blue-500
                    hover:text-blue-400
                  "
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Tahrirlash</span>
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Haqiqatan ham ${student.fullName} o‘quvchisini o‘chirmoqchimisiz?`
                      )
                    ) {
                      deleteStudent(
                        student.id
                      );
                    }
                  }}
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-xl
                    border border-rose-500/20
                    bg-rose-500/10
                    p-2 sm:p-2.5
                    text-rose-400
                    transition
                    hover:bg-rose-500
                    hover:text-white
                  "
                  title="O‘chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NAV */}

        {!isEditing && (
          <div
            className="
              shrink-0
              border-b
              border-white/10
              bg-[#0c1627]
              px-6
            "
          >
            <div className="flex gap-6">
              <button
                onClick={() =>
                  setActiveTab('profile')
                }
                className={`
                  cursor-pointer
                  border-b-2
                  py-3
                  text-xs
                  font-bold
                  ${
                    activeTab ===
                    'profile'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                Profile
              </button>

              <button
                onClick={() =>
                  setActiveTab('payments')
                }
                className={`
                  cursor-pointer
                  border-b-2
                  py-3
                  text-xs
                  font-bold
                  ${
                    activeTab ===
                    'payments'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                Payments
              </button>
            </div>
          </div>
        )}

        {/* BODY */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {isEditing ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-6">
                <h3 className="text-lg font-black text-white">
                  Edit Student
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Update profile and academic details
                </p>
              </div>

              <div className="space-y-7">
                {/* BASIC */}

                <section>
                  <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-blue-400">
                    Student information
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Full name
                      </label>

                      <input
                        className={fieldClass}
                        value={form.fullName}
                        onChange={e =>
                          setForm({
                            ...form,
                            fullName:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Phone
                      </label>

                      <input
                        className={fieldClass}
                        value={form.phone}
                        onChange={e =>
                          setForm({
                            ...form,
                            phone:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Email
                      </label>

                      <input
                        className={fieldClass}
                        value={form.email}
                        onChange={e =>
                          setForm({
                            ...form,
                            email:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Birth date
                      </label>

                      <input
                        type="date"
                        className={fieldClass}
                        value={
                          form.birthDate
                        }
                        onChange={e =>
                          setForm({
                            ...form,
                            birthDate:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Gender
                      </label>

                      <select
                        className={fieldClass}
                        value={form.gender}
                        onChange={e =>
                          setForm({
                            ...form,
                            gender:
                              e.target
                                .value,
                          })
                        }
                      >
                        <option value="Male">
                          Male
                        </option>
                        <option value="Female">
                          Female
                        </option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Address
                      </label>

                      <input
                        className={fieldClass}
                        value={form.address}
                        onChange={e =>
                          setForm({
                            ...form,
                            address:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                <div className="border-t border-white/5" />

                {/* ACADEMIC */}

                <section>
                  <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-violet-400">
                    Academic
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Group
                      </label>

                      <select
                        className={fieldClass}
                        value={form.groupId}
                        onChange={e =>
                          setForm({
                            ...form,
                            groupId:
                              e.target
                                .value,
                          })
                        }
                      >
                        {groups.map(
                          group => (
                            <option
                              key={
                                group.id
                              }
                              value={
                                group.id
                              }
                            >
                              {
                                group.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Teacher
                      </label>

                      <div
                        className="
                          rounded-xl
                          border border-slate-700
                          bg-slate-800/50
                          px-3.5 py-2.5
                          text-sm
                          font-semibold
                          text-slate-300
                        "
                      >
                        {selectedTeacher?.fullName ??
                          selectedGroup?.teacherName ??
                          student.teacherName}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Monthly fee
                      </label>

                      <input
                        type="number"
                        className={fieldClass}
                        value={
                          form.monthlyFee
                        }
                        onChange={e =>
                          setForm({
                            ...form,
                            monthlyFee:
                              Number(
                                e.target
                                  .value
                              ),
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Status
                      </label>

                      <select
                        className={fieldClass}
                        value={form.status}
                        onChange={e =>
                          setForm({
                            ...form,
                            status:
                              e.target
                                .value,
                          })
                        }
                      >
                        <option value="Active">
                          Active
                        </option>

                        <option value="Trial">
                          Trial
                        </option>

                        <option value="Frozen">
                          Frozen
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Joined date
                      </label>

                      <input
                        type="date"
                        className={fieldClass}
                        value={
                          form.joinedDate
                        }
                        onChange={e =>
                          setForm({
                            ...form,
                            joinedDate:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                <div className="border-t border-white/5" />

                {/* PARENT */}

                <section>
                  <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                    Parent / Guardian
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Parent name
                      </label>

                      <input
                        className={fieldClass}
                        value={
                          form.parentName
                        }
                        onChange={e =>
                          setForm({
                            ...form,
                            parentName:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Parent phone
                      </label>

                      <input
                        className={fieldClass}
                        value={
                          form.parentPhone
                        }
                        onChange={e =>
                          setForm({
                            ...form,
                            parentPhone:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Notes
                      </label>

                      <textarea
                        rows={3}
                        className={`${fieldClass} resize-none`}
                        value={form.notes}
                        onChange={e =>
                          setForm({
                            ...form,
                            notes:
                              e.target
                                .value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : activeTab ===
            'profile' ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white">
                      Student
                    </h3>

                    <p className="text-[10px] text-slate-500">
                      Personal information
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <p className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {student.phone}
                  </p>

                  <p className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {student.email}
                  </p>

                  <p className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {student.birthDate}
                  </p>

                  <p className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {student.address ||
                      'No address'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <UserCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white">
                      Parent
                    </h3>

                    <p className="text-[10px] text-slate-500">
                      Guardian information
                    </p>
                  </div>
                </div>

                <p className="text-sm font-black text-white">
                  {student.parentName}
                </p>

                <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <Phone className="h-4 w-4" />
                  {student.parentPhone}
                </p>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <BookOpen className="mb-3 h-4 w-4 text-blue-400" />

                  <p className="text-[9px] font-bold uppercase text-slate-500">
                    Group
                  </p>

                  <p className="mt-1 text-xs font-black text-white">
                    {student.groupName}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <GraduationCap className="mb-3 h-4 w-4 text-violet-400" />

                  <p className="text-[9px] font-bold uppercase text-slate-500">
                    Teacher
                  </p>

                  <p className="mt-1 text-xs font-black text-white">
                    {student.teacherName}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <WalletCards className="mb-3 h-4 w-4 text-emerald-400" />

                  <p className="text-[9px] font-bold uppercase text-slate-500">
                    Monthly Fee
                  </p>

                  <p className="mt-1 text-xs font-black text-white">
                    {settings.currencySymbol}
                    {student.monthlyFee}
                  </p>
                </div>
              </div>

              {student.notes && (
                <div className="md:col-span-2 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-amber-400">
                    <FileText className="h-4 w-4" />

                    <span className="text-[10px] font-bold uppercase">
                      Notes
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {student.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
                <div>
                  <h3 className="text-sm font-black text-white">
                    Payment History
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-500">
                    {settings.academicYear}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase text-slate-500">
                    Monthly fee
                  </p>

                  <p className="font-black text-white">
                    {settings.currencySymbol}
                    {student.monthlyFee}
                  </p>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#111b2d] text-[9px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">
                      Month
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3">
                      Paid
                    </th>

                    <th className="px-5 py-3">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {months.map(month => {
                    const p =
                      student.payments[
                        month
                      ] || {
                        status:
                          'Unpaid',
                        amountPaid: 0,
                        discount: 0,
                      };

                    return (
                      <tr
                        key={month}
                        className="bg-[#0d1728] transition hover:bg-[#122039]"
                      >
                        <td className="px-5 py-3 font-bold text-white">
                          {month}
                        </td>

                        <td className="px-5 py-3">
                          {paymentBadge(
                            p.status
                          )}
                        </td>

                        <td className="px-5 py-3 text-slate-300">
                          {p.amountPaid
                            ? `${settings.currencySymbol}${p.amountPaid}`
                            : '—'}
                        </td>

                        <td className="px-5 py-3 text-slate-500">
                          {p.paymentDate ||
                            '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EDIT FOOTER */}

        {isEditing && (
          <div
            className="
              shrink-0
              border-t
              border-white/10
              bg-[#0c1627]
              px-6 py-4
            "
          >
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setIsEditing(false)
                }
                className="
                  cursor-pointer
                  rounded-xl
                  border border-slate-700
                  px-5 py-2.5
                  text-xs font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-800
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="
                  flex
                  cursor-pointer
                  items-center gap-2
                  rounded-xl
                  bg-blue-600
                  px-5 py-2.5
                  text-xs font-bold
                  text-white
                  shadow-lg
                  shadow-blue-600/20
                  transition
                  hover:bg-blue-500
                "
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};