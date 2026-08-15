import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import type { Teacher } from '../types/crm';
import {
  Plus,
  Phone,
  Mail,
  Star,
  Trash2,
  Calendar,
  X,
  Save,
} from 'lucide-react';

interface TeacherDetailsModalProps {
  teacher: Teacher;
  currencySymbol: string;
  onClose: () => void;
  onSave: (updated: Partial<Teacher>) => void;
}

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({
  teacher,
  currencySymbol,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState(teacher.fullName);
  const [phone, setPhone] = useState(teacher.phone);
  const [email, setEmail] = useState(teacher.email);
  const [subjectsText, setSubjectsText] = useState(
    teacher.subjects.join(', ')
  );
  const [baseSalary, setBaseSalary] = useState(teacher.baseSalary);
  const [bonusPerStudent, setBonusPerStudent] = useState(
    teacher.bonusPerStudent
  );
  const [schedule, setSchedule] = useState(teacher.schedule);

  const handleSave = () => {
    const subjects = subjectsText
      .split(',')
      .map((subject) => subject.trim())
      .filter(Boolean);

    onSave({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      subjects,
      baseSalary: Number(baseSalary),
      bonusPerStudent: Number(bonusPerStudent),
      schedule: schedule.trim(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Teacher Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">{teacher.id}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Subjects
            </label>
            <input
              value={subjectsText}
              onChange={(e) => setSubjectsText(e.target.value)}
              placeholder="English, IELTS, Mathematics"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">
                Base Salary ({currencySymbol})
              </label>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                Bonus Per Student ({currencySymbol})
              </label>
              <input
                type="number"
                value={bonusPerStudent}
                onChange={(e) =>
                  setBonusPerStudent(Number(e.target.value))
                }
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Teaching Schedule
            </label>
            <input
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="text-xs text-slate-500">
            Status: <strong>{teacher.status}</strong>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 p-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#007AFF] text-white font-bold text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const TeachersPage: React.FC = () => {
  const {
    teachers,
    deleteTeacher,
    updateTeacher,
    setIsAddTeacherModalOpen,
    selectedTeacherId,
    setSelectedTeacherId,
    settings,
  } = useCRM();

  const [term, setTerm] = useState('');

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName.toLowerCase().includes(term.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(term.toLowerCase())
      )
  );

  const selectedTeacher =
    teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Teachers & Faculty Roster ({teachers.length})
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Manage center instructors, subject specializations, salaries,
            bonuses & schedules
          </p>
        </div>

        <button
          onClick={() => setIsAddTeacherModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Teacher
        </button>
      </div>

      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search teachers..."
        className="w-full max-w-md px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => {
          const totalEstimatedSalary =
            teacher.baseSalary +
            teacher.studentsCount * teacher.bonusPerStudent;

          return (
            <div
              key={teacher.id}
              className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatar}
                    alt={teacher.fullName}
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-base">
                      {teacher.fullName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {teacher.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5" />
                  {teacher.rating}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {teacher.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-[#007AFF]"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  {teacher.phone}
                </p>

                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  {teacher.email}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {teacher.schedule}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                Estimated Salary:{' '}
                <strong>
                  {settings.currencySymbol}
                  {totalEstimatedSalary}
                </strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTeacherId(teacher.id)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-[#007AFF]"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(`Remove teacher ${teacher.fullName}?`)
                    ) {
                      deleteTeacher(teacher.id);
                    }
                  }}
                  className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTeacher && (
        <TeacherDetailsModal
          key={selectedTeacher.id}
          teacher={selectedTeacher}
          currencySymbol={settings.currencySymbol}
          onClose={() => setSelectedTeacherId(null)}
          onSave={(updated) =>
            updateTeacher(selectedTeacher.id, updated)
          }
        />
      )}
    </div>
  );
};