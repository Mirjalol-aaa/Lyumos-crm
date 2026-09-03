import React, { useState } from 'react';
import { INITIAL_AUDIT_LOGS, INITIAL_RBAC_ROLES } from '../../data/rewardsData';
import { RolePermission, AuditLog } from '../../types/admin';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import {
  ShieldCheck,
  History,
  MessageSquare,
  Lock,
  CheckCircle2,
  XCircle,
  KeyRound,
  BellRing,
} from 'lucide-react';

export const AdminAuditSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'audit' | 'notifications'>('rbac');
  const [roles, setRoles] = useState<RolePermission[]>(INITIAL_RBAC_ROLES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const auditColumns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Vaqt',
      sortable: true,
      render: (log) => (
        <span className="text-xs text-slate-500">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'userName',
      header: 'Foydalanuvchi & Rol',
      sortable: true,
      render: (log) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">
            {log.userName}
          </span>
          <p className="text-[10px] text-slate-400">IP: {log.ipAddress || '195.158.24.12'}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Amal Turi',
      align: 'center',
      render: (log) => {
        const variant =
          log.action === 'CREATE'
            ? 'success'
            : log.action === 'PAYMENT'
            ? 'emerald'
            : log.action === 'DELETE'
            ? 'danger'
            : 'info';
        return <Badge variant={variant as any}>{log.action}</Badge>;
      },
    },
    {
      key: 'targetEntity',
      header: 'Ob’ekt',
      render: (log) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {log.targetEntity}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Tafsilotlar',
      render: (log) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {log.details}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Security & Governance
            </span>
            <span className="text-xs text-slate-400">RBAC, Audit Log & Xabarnomalar</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Rollar, Xavfsizlik & Tizim Jurnali
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('rbac')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'rbac'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Rollar & Huquqlar Matritsasi (RBAC)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Audit Log (Xavfsizlik Jurnali)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          SMS & Telegram Shablonlari
        </button>
      </div>

      {/* RBAC View */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader
                  title={role.label}
                  subtitle={role.description}
                  action={<Badge variant="purple">{role.userCount} ta user</Badge>}
                />
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 dark:border-slate-800">
                        <tr>
                          <th className="pb-2">Modul</th>
                          <th className="pb-2 text-center">Ko‘rish</th>
                          <th className="pb-2 text-center">Tahrirlash</th>
                          <th className="pb-2 text-center">O‘chirish</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {role.permissions.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                              {p.module}
                            </td>
                            <td className="py-2.5 text-center">
                              {p.canView ? (
                                <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="mx-auto h-4 w-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              {p.canEdit ? (
                                <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="mx-auto h-4 w-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              {p.canDelete ? (
                                <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="mx-auto h-4 w-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log View */}
      {activeTab === 'audit' && (
        <DataTable data={auditLogs} columns={auditColumns} searchPlaceholder="Foydalanuvchi yoki amal bo‘yicha..." />
      )}

      {/* Notification Templates */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader
              title="SMS / Telegram To‘lov Eslatmasi"
              subtitle="Qarz muddati o‘tganda avtomatik yuboriladigan xabar"
            />
            <CardContent className="space-y-3">
              <textarea
                rows={4}
                defaultValue="Hurmatli {OTA_ONA_ISMI}, farzandingiz {TALABA_ISMI} ning {GURUH_NOMI} guruhi uchun {OY_NOMI} oyi to‘lovi (${SUMMA}) muddati yetib keldi. To‘lovni Click/Payme orqali amalga oshirishingiz mumkin. Rahmat!"
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <Button size="sm" variant="primary">
                Shablonni Saqlash
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Yangi Baho & Vazifa Xabarnomasi"
              subtitle="Ustoz baho qo‘yganda o‘quvchiga boradigan xabar"
            />
            <CardContent className="space-y-3">
              <textarea
                rows={4}
                defaultValue="🎉 {TALABA_ISMI}, sizning '{VAZIFA_NOMI}' bo‘yicha topshirgan ishingiz {BAHO} / 100 ball bilan baholandi! Ustoz izohi: '{IZOH}'. Kabinetingizda ko‘ring: {HAVOLA}"
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <Button size="sm" variant="primary">
                Shablonni Saqlash
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
