import React, { useState, useRef } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { useI18n } from '../../lib/i18n';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Users,
  Check,
  Loader2,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';

interface ParsedStudentRow {
  tempId: string;
  fullName: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  monthlyFee: number;
  groupName: string;
  groupId: string;
  teacherId: string;
  teacherName: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  isValid: boolean;
  errors: string[];
}

export const ImportStudentsModal: React.FC = () => {
  const {
    isImportStudentsModalOpen,
    setIsImportStudentsModalOpen,
    groups,
    teachers,
    addStudentsBulk,
  } = useCRM();

  const { addOrUpdateCredential } = useLMS();
  const { t } = useI18n();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [defaultGroupId, setDefaultGroupId] = useState<string>('auto');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  if (!isImportStudentsModalOpen) {
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DOWNLOAD SAMPLE EXCEL TEMPLATE
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDownloadTemplate = () => {
    const defaultGroupOne = groups[0]?.name || 'Matematika (Hadicha ustoz)';
    const defaultGroupTwo = groups[1]?.name || groups[0]?.name || 'Ingliz tili (Hasanboy ustoz)';

    const sampleRows = [
      {
        'Ism va Familiya': 'Azizbek Rahimov',
        'Telefon raqami': '+998 90 123 45 67',
        'Ota-onasi ismi': 'Sherzod Rahimov',
        'Ota-onasi telefoni': '+998 90 987 65 43',
        'Oylik to‘lov (so‘m)': 250000,
        'Guruh nomi': defaultGroupOne,
        'Tug‘ilgan sana (YYYY-MM-DD)': '2008-05-14',
        'Jinsi (Erkak/Ayol)': 'Erkak',
      },
      {
        'Ism va Familiya': 'Madina Karimova',
        'Telefon raqami': '+998 93 345 67 89',
        'Ota-onasi ismi': 'Gulnora Karimova',
        'Ota-onasi telefoni': '+998 94 876 54 32',
        'Oylik to‘lov (so‘m)': 250000,
        'Guruh nomi': defaultGroupTwo,
        'Tug‘ilgan sana (YYYY-MM-DD)': '2009-08-21',
        'Jinsi (Erkak/Ayol)': 'Ayol',
      },
      {
        'Ism va Familiya': 'Javohir Alimov',
        'Telefon raqami': '+998 97 567 89 01',
        'Ota-onasi ismi': 'Bobur Alimov',
        'Ota-onasi telefoni': '+998 91 234 56 78',
        'Oylik to‘lov (so‘m)': 250000,
        'Guruh nomi': defaultGroupOne,
        'Tug‘ilgan sana (YYYY-MM-DD)': '2008-11-03',
        'Jinsi (Erkak/Ayol)': 'Erkak',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    
    // Column widths
    worksheet['!cols'] = [
      { wch: 22 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Oquvchilar_Namuna');

    XLSX.writeFile(workbook, 'LUMOS_Oquvchilar_Namuna_Shablon.xlsx');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PARSE EXCEL / CSV FILE
  // ─────────────────────────────────────────────────────────────────────────────
  const processUploadedFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsReadingFile(true);
    setImportSuccess(false);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (workbook.SheetNames.length === 0) {
          alert('Excel fayl bo‘sh yoki o‘qib bo‘lmadi.');
          setIsReadingFile(false);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          alert('Faylda o‘quvchilar ma’lumotlari topilmadi.');
          setIsReadingFile(false);
          return;
        }

        const parsed: ParsedStudentRow[] = rawJson.map((row, index) => {
          let fullName = '';
          let phone = '';
          let parentName = '';
          let parentPhone = '';
          let monthlyFeeStr = '';
          let groupNameFromFile = '';
          let genderStr = '';
          let birthDateStr = '';

          // Intelligently detect columns by fuzzy header matching (UZ, RU, EN)
          Object.entries(row).forEach(([colHeader, colVal]) => {
            const h = colHeader.toLowerCase().trim();
            const val = String(colVal || '').trim();

            if (
              h.includes('ism') ||
              h.includes('familiya') ||
              h.includes('fio') ||
              h.includes('name') ||
              h.includes('фио') ||
              h.includes('имя') ||
              h.includes('student')
            ) {
              if (!fullName) fullName = val;
            } else if (
              (h.includes('telefon') || h.includes('phone') || h.includes('tel') || h.includes('raqam') || h.includes('телефон')) &&
              (h.includes('ota') || h.includes('ona') || h.includes('parent') || h.includes('2') || h.includes('родител'))
            ) {
              if (!parentPhone) parentPhone = val;
            } else if (
              h.includes('ota') ||
              h.includes('ona') ||
              h.includes('parent') ||
              h.includes('родител')
            ) {
              if (!parentName) parentName = val;
            } else if (
              h.includes('telefon') ||
              h.includes('phone') ||
              h.includes('tel') ||
              h.includes('raqam') ||
              h.includes('телефон')
            ) {
              if (!phone) phone = val;
            } else if (
              h.includes('to‘lov') ||
              h.includes('to\'lov') ||
              h.includes('tolov') ||
              h.includes('fee') ||
              h.includes('summa') ||
              h.includes('narx') ||
              h.includes('цена') ||
              h.includes('оплата')
            ) {
              if (!monthlyFeeStr) monthlyFeeStr = val;
            } else if (
              h.includes('guruh') ||
              h.includes('group') ||
              h.includes('sinf') ||
              h.includes('kurs') ||
              h.includes('группа') ||
              h.includes('класс')
            ) {
              if (!groupNameFromFile) groupNameFromFile = val;
            } else if (
              h.includes('jins') ||
              h.includes('gender') ||
              h.includes('пол')
            ) {
              if (!genderStr) genderStr = val;
            } else if (
              h.includes('tug‘il') ||
              h.includes('tugil') ||
              h.includes('birth') ||
              h.includes('bday') ||
              h.includes('рожд')
            ) {
              if (!birthDateStr) birthDateStr = val;
            }
          });

          // Determine target group
          let targetGroup = groups[0];
          if (defaultGroupId !== 'auto') {
            const foundSelected = groups.find((g) => g.id === defaultGroupId);
            if (foundSelected) targetGroup = foundSelected;
          } else if (groupNameFromFile) {
            const match = groups.find(
              (g) =>
                g.name.toLowerCase().includes(groupNameFromFile.toLowerCase()) ||
                g.id.toLowerCase() === groupNameFromFile.toLowerCase() ||
                g.subject.toLowerCase().includes(groupNameFromFile.toLowerCase())
            );
            if (match) targetGroup = match;
          }

          // Target teacher
          const teacher =
            teachers.find((t) => t.id === targetGroup?.teacherId) ||
            teachers[0] || {
              id: 'TCH-01',
              fullName: 'Hadicha ustoz',
            };

          // Clean fee
          const cleanFeeNum = parseInt(
            monthlyFeeStr.replace(/[^0-9]/g, ''),
            10
          );
          const monthlyFee =
            !isNaN(cleanFeeNum) && cleanFeeNum > 0
              ? cleanFeeNum
              : targetGroup?.monthlyFee || 250000;

          // Gender
          const isFemale =
            genderStr.toLowerCase().startsWith('a') ||
            genderStr.toLowerCase().startsWith('f') ||
            genderStr.toLowerCase().startsWith('ж') ||
            genderStr.toLowerCase().includes('qiz') ||
            genderStr.toLowerCase().includes('жен');
          const gender: 'Male' | 'Female' = isFemale ? 'Female' : 'Male';

          // Birth date
          const birthDate = birthDateStr.match(/^\d{4}-\d{2}-\d{2}$/)
            ? birthDateStr
            : '2008-05-14';

          // Errors validation
          const errors: string[] = [];
          if (!fullName.trim()) {
            errors.push('Ism-familiya kiritilmagan');
          }
          if (!phone.trim()) {
            errors.push('Telefon kiritilmagan');
          }

          return {
            tempId: `TMP-${Date.now()}-${index}`,
            fullName: fullName.trim(),
            phone: phone.trim() || '+998 (90) 000-00-00',
            parentName: parentName.trim() || 'Ota-onasi',
            parentPhone: parentPhone.trim() || phone.trim() || '+998 (90) 000-00-00',
            monthlyFee,
            groupName: targetGroup?.name || 'Umumiy Guruh',
            groupId: targetGroup?.id || 'GRP-01',
            teacherId: teacher.id,
            teacherName: teacher.fullName,
            gender,
            birthDate,
            isValid: errors.length === 0,
            errors,
          };
        });

        setParsedRows(parsed);
      } catch (err) {
        console.error('Failed to parse excel file', err);
        alert('Faylni tahlil qilishda xatolik yuz berdi. Iltimos, fayl formati (.xlsx yoki .csv) to‘g‘riligini tekshiring.');
      } finally {
        setIsReadingFile(false);
      }
    };

    reader.onerror = () => {
      alert('Faylni o‘qishda xatolik yuz berdi.');
      setIsReadingFile(false);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleRemoveRow = (tempId: string) => {
    setParsedRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. EXECUTE IMPORT INTO DATABASE & CRM CONTEXT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleExecuteImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('Yuklash uchun kamida bitta to‘g‘ri ma’lumotga ega o‘quvchi kerak.');
      return;
    }

    setIsImporting(true);

    try {
      const studentsToCreate = validRows.map((row) => ({
        fullName: row.fullName,
        avatar: '',
        birthDate: row.birthDate,
        gender: row.gender,
        phone: row.phone,
        email: `${row.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.lumos.uz`,
        parentName: row.parentName,
        parentPhone: row.parentPhone,
        groupId: row.groupId,
        groupName: row.groupName,
        teacherId: row.teacherId,
        teacherName: row.teacherName,
        monthlyFee: row.monthlyFee,
        status: 'Active' as const,
        joinedDate: new Date().toISOString().split('T')[0],
      }));

      const created = await addStudentsBulk(studentsToCreate);

      // Also register credentials so each student can login
      created.forEach((stu) => {
        const cleanLogin = stu.phone.replace(/[^0-9]/g, '') || stu.id.toLowerCase();
        addOrUpdateCredential({
          id: `USR-${stu.id}`,
          role: 'student',
          name: stu.fullName,
          login: cleanLogin,
          password: 'student123',
          details: `${stu.groupName} o‘quvchisi`,
          studentId: stu.id,
        });
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setImportedCount(created.length);
      setImportSuccess(true);
    } catch (err) {
      console.error('Import error:', err);
      alert('O‘quvchilarni yuklashda xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetModal = () => {
    setFile(null);
    setParsedRows([]);
    setImportSuccess(false);
    setImportedCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleResetModal();
    setIsImportStudentsModalOpen(false);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Excel / CSV orqali o‘quvchilarni yuklash
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guruh ro‘yxatidagi barcha o‘quvchilarni 5 soniyada avtomatik tizimga kiritish
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* SUCCESS SCREEN */}
          {importSuccess ? (
            <div className="py-10 text-center space-y-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Muvaffaqiyatli yuklandi!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{importedCount} nafar</span> o‘quvchi ro‘yxatga qo‘shildi. Barcha o‘quvchilarga avtomatik kirish login va parollari berildi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 max-w-md mx-auto text-left text-xs space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  🔑 O‘quvchilar uchun kirish ma’lumotlari:
                </p>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Login:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">Telefon raqam yoki STU-ID</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Standart parol:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">student123</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Yana boshqa fayl yuklash
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-[#007AFF] text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all cursor-pointer"
                >
                  O‘quvchilar ro‘yxatiga o‘tish
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TOP ACTION BAR: TEMPLATE DOWNLOAD & GROUP SELECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Download sample template card */}
                <div className="flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                  <div className="space-y-1 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <FileCheck className="h-3.5 w-3.5" />
                      Tayyor Shablon
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Namuna Excel shablonini oling
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Ustunlar to‘g‘ri joylashgan shablonga o‘quvchilarni to‘ldirib yuklasangiz, 100% xatosiz ishlaydi.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Shablonni yuklab olish (.xlsx)
                  </button>
                </div>

                {/* Group selector */}
                <div className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="space-y-1 mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      <Users className="h-3.5 w-3.5" />
                      Guruhga biriktirish
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Qaysi guruhga qo‘shilsin?
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Fayldagi guruh nomi bo‘yicha yoki barcha o‘quvchilarni bitta guruhga yo‘naltiring.
                    </p>
                  </div>

                  <select
                    value={defaultGroupId}
                    onChange={(e) => setDefaultGroupId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="auto">🔍 Fayldagi guruh bo‘yicha avtomatik aniqlash</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.subject})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* DRAG & DROP UPLOAD ZONE */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragging
                    ? 'border-[#007AFF] bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-400 dark:border-slate-700 dark:hover:border-slate-600 bg-slate-50/40 dark:bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-[#007AFF] dark:bg-blue-500/20 dark:text-blue-400 mb-3 shadow-inner">
                  {isReadingFile ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <UploadCloud className="h-8 w-8" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {file ? file.name : 'Excel yoki CSV faylni shu yerga tashlang'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    yoki kompyuterdan tanlash uchun <span className="text-[#007AFF] font-bold underline">bosing</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                    Qo‘llab-quvvatlanadigan formatlar: .xlsx, .xls, .csv (Cheksiz o‘quvchilar)
                  </p>
                </div>
              </div>

              {/* PREVIEW TABLE IF ROWS PARSED */}
              {parsedRows.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Fayldan o‘qilgan o‘quvchilar
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                          <CheckCircle2 className="h-3 w-3" />
                          {validCount} ta to‘g‘ri
                        </span>
                        {invalidCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[11px]">
                            <AlertTriangle className="h-3 w-3" />
                            {invalidCount} ta xato
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetModal}
                      className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      Boshqa fayl tanlash
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="max-h-72 overflow-y-auto scrollbar-thin">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/90 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300">#</th>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300">Ism Familiya</th>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300">Telefon</th>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300">Guruh</th>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300">Oylik to‘lov</th>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300">Holati</th>
                            <th className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-300 text-right">Amal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                          {parsedRows.map((row, idx) => (
                            <tr
                              key={row.tempId}
                              className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                                !row.isValid ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                                {row.fullName || (
                                  <span className="text-rose-500 italic">Ism kiritilmagan</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                                {row.phone}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex rounded-lg bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                                  {row.groupName}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                                {row.monthlyFee.toLocaleString()} so‘m
                              </td>
                              <td className="py-2.5 px-3">
                                {row.isValid ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <Check className="h-3 w-3" />
                                    Tayyor
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500"
                                    title={row.errors.join(', ')}
                                  >
                                    <AlertTriangle className="h-3 w-3" />
                                    {row.errors[0]}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRow(row.tempId)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  title="O‘chirish"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* FOOTER */}
        {!importSuccess && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              {parsedRows.length > 0 ? (
                <span>
                  Jami <b>{parsedRows.length}</b> ta o‘quvchidan <b>{validCount}</b> tasi yuklanadi.
                </span>
              ) : (
                <span>Excel shablonini yuklab olib to‘ldirishingiz mumkin.</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                disabled={isImporting}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {t.common.cancel}
              </button>

              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || validCount === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Yuklanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Tizimga yuklash ({validCount} ta o‘quvchi)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
