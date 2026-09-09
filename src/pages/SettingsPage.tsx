import React, {
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import {
  Building,
  Save,
  BellRing,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  CheckCircle2,
  MessageSquareText,
  AlarmClock,
  Send,
  Bot,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  AlertCircle,
  Smartphone,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

import {
  testTelegramBot,
  setupBotMainMenu,
  sendTelegramMessage,
  formatLeadApplicationMessage,
} from '../services/telegramService';
import { testEskizConnection, getEskizBalance } from '../services/eskizSmsService';


export const SettingsPage:
  React.FC = () => {
    const {
      settings,
      updateSettings,
    } = useCRM();


    const [
      centerName,
      setCenterName,
    ] = useState(
      settings.centerName
    );


    const [
      tagline,
      setTagline,
    ] = useState(
      settings.tagline
    );


    const [
      phone,
      setPhone,
    ] = useState(
      settings.phone
    );


    const [
      email,
      setEmail,
    ] = useState(
      settings.email
    );


    const [
      address,
      setAddress,
    ] = useState(
      settings.address
    );


    const [
      currency,
      setCurrency,
    ] = useState(
      settings.currency
    );


    const [
      academicYear,
      setAcademicYear,
    ] = useState(
      settings.academicYear
    );


    const [
      enableSms,
      setEnableSms,
    ] = useState(
      settings.enableSmsNotifications
    );


    const [
      autoRemind,
      setAutoRemind,
    ] = useState(
      settings.autoRemindUnpaid
    );

    const [
      telegramBotToken,
      setTelegramBotToken,
    ] = useState(
      settings.telegramBotToken || ''
    );

    const [
      telegramChatId,
      setTelegramChatId,
    ] = useState(
      settings.telegramChatId || ''
    );

    const [
      enableTelegramAttendance,
      setEnableTelegramAttendance,
    ] = useState(
      settings.enableTelegramAttendance ?? true
    );

    const [
      enableTelegramPayments,
      setEnableTelegramPayments,
    ] = useState(
      settings.enableTelegramPayments ?? true
    );

    const [
      isTestingTelegram,
      setIsTestingTelegram,
    ] = useState(false);

    const [
      telegramTestResult,
      setTelegramTestResult,
    ] = useState<{ success: boolean; message: string } | null>(null);

    const [
      showTelegramGuide,
      setShowTelegramGuide,
    ] = useState(false);

    // ─────────────────────────────────────────────────────────────────────────
    // ESKIZ SMS STATE
    // ─────────────────────────────────────────────────────────────────────────
    const [eskizEmail, setEskizEmail] = useState(settings.eskizEmail || '');
    const [eskizPassword, setEskizPassword] = useState(settings.eskizPassword || '');
    const [eskizToken, setEskizToken] = useState(settings.eskizToken || '');
    const [eskizFrom, setEskizFrom] = useState(settings.eskizFrom || '4546');
    const [enableSmsAttendance, setEnableSmsAttendance] = useState(settings.enableSmsAttendance ?? true);
    const [enableSmsPayments, setEnableSmsPayments] = useState(settings.enableSmsPayments ?? true);
    const [isTestingEskiz, setIsTestingEskiz] = useState(false);
    const [eskizTestPhone, setEskizTestPhone] = useState('');
    const [eskizTestResult, setEskizTestResult] = useState<{
      success: boolean;
      message: string;
      remainingLimit?: number;
    } | null>(null);
    const [showEskizGuide, setShowEskizGuide] = useState(false);

    const [
      savedSuccess,
      setSavedSuccess,
    ] = useState(false);


    // ─────────────────────────────────────────────────────────────────────────
    // TEST TELEGRAM CONNECTION
    // ─────────────────────────────────────────────────────────────────────────

    const handleTestTelegram = async () => {
      if (!telegramBotToken.trim()) {
        setTelegramTestResult({
          success: false,
          message: 'Iltimos, avval Telegram Bot Tokenini kiriting.',
        });
        return;
      }

      setIsTestingTelegram(true);
      setTelegramTestResult(null);

      try {
        const result = await testTelegramBot(telegramBotToken, telegramChatId);
        if (result.success) {
          setTelegramTestResult({
            success: true,
            message: `Muvaffaqiyatli! Bot (${result.botName || 'LumosBot'}) ulandi va sinov xabari yuborildi.`,
          });
        } else {
          setTelegramTestResult({
            success: false,
            message: result.error || 'Ulanishda xatolik yuz berdi.',
          });
        }
      } catch (err: any) {
        setTelegramTestResult({
          success: false,
          message: err.message || 'Xatolik yuz berdi.',
        });
      } finally {
        setIsTestingTelegram(false);
      }
    };

    const [isSettingUpMenu, setIsSettingUpMenu] = useState(false);
    const [isTestingLead, setIsTestingLead] = useState(false);

    const handleSetupTelegramMenu = async () => {
      if (!telegramBotToken.trim() || !telegramChatId.trim()) {
        setTelegramTestResult({
          success: false,
          message: 'Iltimos, avval Bot Token va Chat ID ni kiriting.',
        });
        return;
      }

      setIsSettingUpMenu(true);
      setTelegramTestResult(null);

      try {
        const result = await setupBotMainMenu(telegramBotToken, telegramChatId, centerName);
        if (result.success) {
          setTelegramTestResult({
            success: true,
            message: 'Bot menyu tugmalari (Jadval, To‘lov, Davomat, Manzil) muvaffaqiyatli o‘rnatildi! ✅',
          });
        } else {
          setTelegramTestResult({
            success: false,
            message: result.error || 'Menyuni sozlashda xatolik yuz berdi.',
          });
        }
      } catch (err: any) {
        setTelegramTestResult({
          success: false,
          message: err.message || 'Xatolik yuz berdi.',
        });
      } finally {
        setIsSettingUpMenu(false);
      }
    };

    const handleTestLeadApplication = async () => {
      if (!telegramBotToken.trim() || !telegramChatId.trim()) {
        setTelegramTestResult({
          success: false,
          message: 'Iltimos, avval Bot Token va Chat ID ni kiriting.',
        });
        return;
      }

      setIsTestingLead(true);
      setTelegramTestResult(null);

      try {
        const testMsg = formatLeadApplicationMessage({
          fullName: 'Rustam Karimov (Sinov O‘quvchi)',
          phone: '+998 (90) 123-45-67',
          subject: 'Ingliz tili (IELTS)',
          source: 'LUMOS Rasmiy Sayti (Sinov)',
          centerName: centerName || 'LUMOS Academy',
        });
        const result = await sendTelegramMessage(telegramBotToken, telegramChatId, testMsg);
        if (result.success) {
          setTelegramTestResult({
            success: true,
            message: 'Sinov arizasi muvaffaqiyatli yuborildi! Guruh yoki kanalingizni tekshiring. 🔥',
          });
        } else {
          setTelegramTestResult({
            success: false,
            message: result.error || 'Ariza yuborishda xatolik yuz berdi.',
          });
        }
      } catch (err: any) {
        setTelegramTestResult({
          success: false,
          message: err.message || 'Xatolik yuz berdi.',
        });
      } finally {
        setIsTestingLead(false);
      }
    };


    // ─────────────────────────────────────────────────────────────────────────
    // TEST ESKIZ SMS GATEWAY
    // ─────────────────────────────────────────────────────────────────────────

    const handleTestEskiz = async () => {
      setIsTestingEskiz(true);
      setEskizTestResult(null);

      try {
        const res = await testEskizConnection(
          eskizEmail,
          eskizPassword,
          eskizToken,
          eskizTestPhone
        );

        if (res.success) {
          setEskizTestResult({
            success: true,
            message: res.message || 'Eskiz SMS Gateway muvaffaqiyatli ulandi!',
            remainingLimit: res.remainingLimit,
          });
        } else {
          setEskizTestResult({
            success: false,
            message: res.error || 'Eskiz SMS Gateway ulanishida xatolik yuz berdi.',
          });
        }
      } catch (err: any) {
        setEskizTestResult({
          success: false,
          message: err.message || 'Xatolik yuz berdi.',
        });
      } finally {
        setIsTestingEskiz(false);
      }
    };


    // ─────────────────────────────────────────────────────────────────────────
    // SAVE SETTINGS
    // ─────────────────────────────────────────────────────────────────────────

    const handleSubmit = (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      updateSettings({
        centerName,

        tagline,

        phone,

        email,

        address,

        currency,

        currencySymbol:
          currency === 'USD'
            ? '$'
            : currency === 'UZS'
            ? 'so‘m'
            : '€',

        academicYear,

        enableSmsNotifications:
          enableSms,

        autoRemindUnpaid:
          autoRemind,

        telegramBotToken,

        telegramChatId,

        enableTelegramAttendance,

        enableTelegramPayments,

        eskizEmail,

        eskizPassword,

        eskizToken,

        eskizFrom,

        enableSmsAttendance,

        enableSmsPayments,
      });


      setSavedSuccess(
        true
      );


      window.setTimeout(
        () => {
          setSavedSuccess(
            false
          );
        },
        3000
      );
    };


    // ─────────────────────────────────────────────────────────────────────────
    // STYLES
    // ─────────────────────────────────────────────────────────────────────────

    const inputClass = `
      h-11
      w-full
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      px-3.5
      text-sm
      font-medium
      text-slate-900
      outline-none
      transition-all

      placeholder:text-slate-400

      focus:border-[#007AFF]/50
      focus:bg-white
      focus:ring-2
      focus:ring-[#007AFF]/10

      dark:border-slate-700
      dark:bg-slate-800
      dark:text-white
      dark:focus:border-[#007AFF]/60
      dark:focus:bg-slate-800
    `;


    const labelClass = `
      mb-1.5
      block
      text-[10px]
      font-bold
      uppercase
      tracking-wider
      text-slate-500
    `;


    return (
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          space-y-4
          px-3
          py-4

          sm:space-y-5
          sm:px-5
          sm:py-5

          lg:space-y-6
          lg:px-6
          lg:py-6

          xl:px-8
          xl:py-8
        "
      >
        {/* ─────────────────────────────────────────────────────────────────
            HEADER
        ───────────────────────────────────────────────────────────────── */}

        <div
          className="
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <h1
              className="
                text-xl
                font-black
                tracking-tight
                text-slate-900

                dark:text-white

                sm:text-2xl
              "
            >
              System Preferences &
              Center Settings
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-[11px]
                leading-relaxed
                text-slate-500

                sm:text-xs
              "
            >
              Configure center
              identity, currency,
              academic periods and
              notification
              preferences.
            </p>
          </div>
        </div>


        {/* ─────────────────────────────────────────────────────────────────
            FLOATING SUCCESS NOTIFICATION
        ───────────────────────────────────────────────────────────────── */}

        {savedSuccess && (
          <div
            className="
              fixed
              bottom-4
              left-4
              right-4
              z-[200]

              flex
              items-center
              gap-3

              rounded-2xl
              border
              border-emerald-500/30
              bg-emerald-600
              px-4
              py-3

              text-xs
              font-bold
              text-white

              shadow-2xl
              shadow-emerald-600/30

              animate-in
              fade-in
              slide-in-from-bottom-4
              duration-300

              sm:left-auto
              sm:right-5
              sm:w-auto
              sm:min-w-[300px]
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white/20
              "
            >
              <CheckCircle2
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  font-black
                  text-white
                "
              >
                Settings Saved!
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-medium
                  text-emerald-50
                "
              >
                Your changes have been saved successfully.
              </p>
            </div>
          </div>
        )}


        {/* ─────────────────────────────────────────────────────────────────
            FORM
        ───────────────────────────────────────────────────────────────── */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-4

            sm:space-y-5

            lg:space-y-6
          "
        >
          {/* ═══════════════════════════════════════════════════════════════
              CENTER IDENTITY
          ═══════════════════════════════════════════════════════════════ */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200/60
              bg-white
              shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                border-b
                border-slate-100
                px-4
                py-4

                dark:border-slate-800

                sm:px-5

                lg:px-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-[#007AFF]

                    dark:bg-blue-950/40
                  "
                >
                  <Building
                    className="
                      h-5
                      w-5
                    "
                  />
                </div>


                <div>
                  <h2
                    className="
                      text-sm
                      font-bold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Education Center
                    Identity
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-slate-400

                      sm:text-[11px]
                    "
                  >
                    Main information
                    displayed across
                    the CRM.
                  </p>
                </div>
              </div>
            </div>


            <div
              className="
                p-4

                sm:p-5

                lg:p-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4

                  sm:grid-cols-2
                "
              >
                {/* CENTER NAME */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Center Name
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <Building
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      value={
                        centerName
                      }
                      onChange={
                        event =>
                          setCenterName(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        pl-10
                      `}
                      placeholder="Education center name"
                    />
                  </div>
                </div>


                {/* TAGLINE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Tagline
                  </label>

                  <input
                    type="text"
                    value={
                      tagline
                    }
                    onChange={
                      event =>
                        setTagline(
                          event.target.value
                        )
                    }
                    className={
                      inputClass
                    }
                    placeholder="Center tagline"
                  />
                </div>


                {/* PHONE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Contact Phone
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <Phone
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      value={
                        phone
                      }
                      onChange={
                        event =>
                          setPhone(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        pl-10
                      `}
                      placeholder="+998..."
                    />
                  </div>
                </div>


                {/* EMAIL */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Official Email
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <Mail
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="email"
                      value={
                        email
                      }
                      onChange={
                        event =>
                          setEmail(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        pl-10
                      `}
                      placeholder="center@email.com"
                    />
                  </div>
                </div>


                {/* ADDRESS */}

                <div
                  className="
                    sm:col-span-2
                  "
                >
                  <label
                    className={
                      labelClass
                    }
                  >
                    Campus Address
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <MapPin
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      value={
                        address
                      }
                      onChange={
                        event =>
                          setAddress(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        pl-10
                      `}
                      placeholder="Center address"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* ═══════════════════════════════════════════════════════════════
              FINANCIAL & ACADEMIC RULES
          ═══════════════════════════════════════════════════════════════ */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200/60
              bg-white
              shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                border-b
                border-slate-100
                px-4
                py-4

                dark:border-slate-800

                sm:px-5

                lg:px-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-50
                    text-emerald-600

                    dark:bg-emerald-950/40
                  "
                >
                  <DollarSign
                    className="
                      h-5
                      w-5
                    "
                  />
                </div>


                <div>
                  <h2
                    className="
                      text-sm
                      font-bold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Financial &
                    Academic Rules
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-slate-400

                      sm:text-[11px]
                    "
                  >
                    Configure currency
                    and academic year.
                  </p>
                </div>
              </div>
            </div>


            <div
              className="
                p-4

                sm:p-5

                lg:p-6
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4

                  sm:grid-cols-2
                "
              >
                {/* CURRENCY */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Primary Currency
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <DollarSign
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <select
                      value={
                        currency
                      }
                      onChange={
                        event =>
                          setCurrency(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        cursor-pointer
                        pl-10
                        font-bold
                      `}
                    >
                      <option value="USD">
                        USD ($)
                      </option>

                      <option value="UZS">
                        UZS (So'm)
                      </option>

                      <option value="EUR">
                        EUR (€)
                      </option>
                    </select>
                  </div>
                </div>


                {/* ACADEMIC YEAR */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Academic Year
                    Period
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <CalendarDays
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      value={
                        academicYear
                      }
                      onChange={
                        event =>
                          setAcademicYear(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        pl-10
                      `}
                      placeholder="2026–2027"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* ═══════════════════════════════════════════════════════════════
              NOTIFICATIONS
          ═══════════════════════════════════════════════════════════════ */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200/60
              bg-white
              shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                border-b
                border-slate-100
                px-4
                py-4

                dark:border-slate-800

                sm:px-5

                lg:px-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-50
                    text-amber-600

                    dark:bg-amber-950/40
                  "
                >
                  <BellRing
                    className="
                      h-5
                      w-5
                    "
                  />
                </div>


                <div>
                  <h2
                    className="
                      text-sm
                      font-bold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Parent Notification
                    Automations
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-slate-400

                      sm:text-[11px]
                    "
                  >
                    Configure payment
                    notifications and
                    reminder preferences.
                  </p>
                </div>
              </div>
            </div>


            <div
              className="
                space-y-3
                p-4

                sm:p-5

                lg:p-6
              "
            >
              {/* SMS */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-transparent
                  bg-slate-50
                  p-3
                  transition-all

                  hover:border-blue-200
                  hover:bg-blue-50/50

                  dark:bg-slate-800/50
                  dark:hover:border-blue-900
                  dark:hover:bg-blue-950/20

                  sm:p-4
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-100
                      text-blue-600

                      dark:bg-blue-950/50
                      dark:text-blue-400
                    "
                  >
                    <MessageSquareText
                      className="
                        h-4
                        w-4
                      "
                    />
                  </div>


                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        font-bold
                        leading-relaxed
                        text-slate-800

                        dark:text-white

                        sm:text-xs
                      "
                    >
                      Enable Parent SMS
                      Payment Notifications
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        leading-relaxed
                        text-slate-400

                        sm:text-[10px]
                      "
                    >
                      Allow payment
                      notification
                      automation.
                    </p>
                  </div>
                </div>


                <input
                  type="checkbox"
                  checked={
                    enableSms
                  }
                  onChange={
                    event =>
                      setEnableSms(
                        event.target.checked
                      )
                  }
                  className="
                    h-5
                    w-5
                    shrink-0
                    cursor-pointer
                    accent-[#007AFF]
                  "
                />
              </label>


              {/* AUTO REMINDER */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-transparent
                  bg-slate-50
                  p-3
                  transition-all

                  hover:border-amber-200
                  hover:bg-amber-50/50

                  dark:bg-slate-800/50
                  dark:hover:border-amber-900
                  dark:hover:bg-amber-950/20

                  sm:p-4
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-amber-100
                      text-amber-600

                      dark:bg-amber-950/50
                      dark:text-amber-400
                    "
                  >
                    <AlarmClock
                      className="
                        h-4
                        w-4
                      "
                    />
                  </div>


                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        font-bold
                        leading-relaxed
                        text-slate-800

                        dark:text-white

                        sm:text-xs
                      "
                    >
                      Auto-Send Fee
                      Overdue Reminders
                      on 5th of Month
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        leading-relaxed
                        text-slate-400

                        sm:text-[10px]
                      "
                    >
                      Enable automatic
                      overdue payment
                      reminder preference.
                    </p>
                  </div>
                </div>


                <input
                  type="checkbox"
                  checked={
                    autoRemind
                  }
                  onChange={
                    event =>
                      setAutoRemind(
                        event.target.checked
                      )
                  }
                  className="
                    h-5
                    w-5
                    shrink-0
                    cursor-pointer
                    accent-[#007AFF]
                  "
                />
              </label>

              {/* ─────────────────────────────────────────────────────────────
                  TELEGRAM BOT INTEGRATION SECTION
              ───────────────────────────────────────────────────────────── */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                      <Send className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Telegram Bot Integratsiyasi</span>
                        <span className="rounded bg-sky-500/10 px-1.5 py-0.2 text-[9px] font-bold text-sky-600 dark:text-sky-400">
                          Bepul
                        </span>
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                        To‘lov cheklari va yo‘qlama xabarnomalarini ota-onalarga bot orqali yuborish
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTelegramGuide(!showTelegramGuide)}
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 cursor-pointer self-start sm:self-auto"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Qanday ulanadi?</span>
                  </button>
                </div>

                {/* Step by step guide accordion */}
                {showTelegramGuide && (
                  <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 text-xs space-y-2 text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
                    <p className="font-bold text-sky-800 dark:text-sky-300">
                      Telegram botni ulash bo‘yicha 3 ta oson qadam:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                      <li>
                        Telegramda <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="font-bold text-sky-600 underline">@BotFather</a> ga kiring va <code>/newbot</code> buyrug‘ini bering.
                      </li>
                      <li>
                        Botingizga nom va username bering, berilgan <b>API Token</b> ni quyidagi birinchi qatorga nusxalang.
                      </li>
                      <li>
                        Botingizni markaz guruhiga yoki kanalingizga <b>Admin</b> qilib qo‘shing va kanal/guruh ID sini (masalan <code>@lumos_crm_alerts</code> yoki <code>-100...</code>) ikkinchi qatorga yozing.
                      </li>
                    </ol>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Telegram Bot Token
                    </label>
                    <div className="relative">
                      <Bot className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={telegramBotToken}
                        onChange={(e) => setTelegramBotToken(e.target.value)}
                        placeholder="123456789:ABCdefGHIjkl..."
                        className={`${inputClass} pl-10 font-mono text-xs`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Telegram Chat ID / Kanal ID
                    </label>
                    <div className="relative">
                      <Send className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="@lumos_channel yoki -100123456789"
                        className={`${inputClass} pl-10 font-mono text-xs`}
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white">
                        To‘lov Kvitansiyasini Yuborish
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Har bir to‘lovda avtomatik chek
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableTelegramPayments}
                      onChange={(e) => setEnableTelegramPayments(e.target.checked)}
                      className="h-4 w-4 accent-[#007AFF] cursor-pointer"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white">
                        Yo‘qlama Xabarnomasi
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Kelmagan o‘quvchilar haqida ogohlantirish
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableTelegramAttendance}
                      onChange={(e) => setEnableTelegramAttendance(e.target.checked)}
                      className="h-4 w-4 accent-[#007AFF] cursor-pointer"
                    />
                  </label>
                </div>

                {/* Action buttons & feedback */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={isTestingTelegram}
                      className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 active:scale-[0.98] text-xs font-bold text-sky-700 dark:text-sky-400 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTestingTelegram ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      <span>{isTestingTelegram ? 'Tekshirilmoqda...' : '1. Ulanishni Sinash'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSetupTelegramMenu}
                      disabled={isSettingUpMenu}
                      className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-[0.98] text-xs font-bold text-indigo-700 dark:text-indigo-400 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSettingUpMenu ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                      <span>{isSettingUpMenu ? 'O‘rnatilmoqda...' : '2. 📲 Bot Menyu Tugmalarini O‘rnatish'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestLeadApplication}
                      disabled={isTestingLead}
                      className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] text-xs font-bold text-amber-700 dark:text-amber-400 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTestingLead ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <BellRing className="h-3.5 w-3.5" />
                      )}
                      <span>{isTestingLead ? 'Yuborilmoqda...' : '3. 🔥 Sinov Arizasi Yuborish'}</span>
                    </button>
                  </div>

                  {telegramTestResult && (
                    <div
                      className={`flex items-start gap-2.5 text-xs font-medium px-4 py-2.5 rounded-xl border transition-all ${
                        telegramTestResult.success
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {telegramTestResult.success ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                      )}
                      <span className="text-xs leading-relaxed">{telegramTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  ESKIZ.UZ SMS GATEWAY INTEGRATION SECTION
              ───────────────────────────────────────────────────────────── */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Eskiz.uz SMS Gateway Integratsiyasi</span>
                        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          O‘zbekiston SMS
                        </span>
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                        Oflayn va interneti yo‘q ota-onalarga to‘g‘ridan-to‘g‘ri telefon raqamiga SMS yuborish
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEskizGuide(!showEskizGuide)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer self-start sm:self-auto"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Eskiz qanday ulanadi?</span>
                  </button>
                </div>

                {/* Step by step guide accordion */}
                {showEskizGuide && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-xs space-y-2 text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">
                      Eskiz.uz SMS provayderini ulash (100 ta bepul SMS bilan):
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                      <li>
                        <a href="https://eskiz.uz" target="_blank" rel="noreferrer" className="font-bold text-emerald-600 underline">eskiz.uz</a> saytidan ro‘yxatdan o‘ting va akkaunt yarating (yangi akkauntlarga bepul sinov SMSlari beriladi).
                      </li>
                      <li>
                        Eskiz boshqaruv panelidagi emailingiz va parolingizni yoki <b>API Token</b>ingizni quyidagi maydonlarga kiriting.
                      </li>
                      <li>
                        O‘zingizning tasdiqlangan "From" (Yuboruvchi) nomingiz bo‘lsa kiriting, aks holda standart <code>4546</code> raqami avtomatik ishlatiladi.
                      </li>
                    </ol>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Eskiz Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={eskizEmail}
                        onChange={(e) => setEskizEmail(e.target.value)}
                        placeholder="masalan: lumos.edu@gmail.com"
                        className={`${inputClass} pl-10 text-xs`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Eskiz Parol / Maxfiy Kalit
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={eskizPassword}
                        onChange={(e) => setEskizPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`${inputClass} pl-10 text-xs`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Yoki To‘g‘ridan-to‘g‘ri API Token (Ixtiyoriy)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={eskizToken}
                        onChange={(e) => setEskizToken(e.target.value)}
                        placeholder="eyJ0eXAiOiJKV1QiLC..."
                        className={`${inputClass} pl-10 font-mono text-xs`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Yuboruvchi Nomi (From / Sender ID)
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={eskizFrom}
                        onChange={(e) => setEskizFrom(e.target.value)}
                        placeholder="4546 (yoki tasdiqlangan nom)"
                        className={`${inputClass} pl-10 text-xs`}
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white">
                        To‘lov Chekini SMS orqali yuborish
                      </p>
                      <p className="text-[9px] text-slate-400">
                        To‘lov qabul qilinganda ota-onaga kvitansiya SMS
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSmsPayments}
                      onChange={(e) => setEnableSmsPayments(e.target.checked)}
                      className="h-4 w-4 accent-emerald-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white">
                        Yo‘qlama SMS Ogohlantirishi
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Kelmadi deb belgilanganda darhol SMS boradi
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSmsAttendance}
                      onChange={(e) => setEnableSmsAttendance(e.target.checked)}
                      className="h-4 w-4 accent-emerald-500 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Test SMS button & balance feedback */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestEskiz}
                      disabled={isTestingEskiz}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTestingEskiz ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Smartphone className="h-3.5 w-3.5" />
                      )}
                      <span>{isTestingEskiz ? 'Tekshirilmoqda...' : 'SMS Balansini Tekshirish & Sinash'}</span>
                    </button>
                  </div>

                  {eskizTestResult && (
                    <div
                      className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl ${
                        eskizTestResult.success
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {eskizTestResult.success ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0" />
                      )}
                      <span className="text-[11px] leading-tight">{eskizTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>


          {/* ═══════════════════════════════════════════════════════════════
              SAVE BUTTON
          ═══════════════════════════════════════════════════════════════ */}

          <div
            className="
              flex
              justify-end
              pb-2
            "
          >
            <button
              type="submit"
              className={`
                flex
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-2

                rounded-xl
                px-6
                py-3

                text-xs
                font-bold
                text-white

                shadow-lg

                transition-all
                duration-300

                active:scale-[0.98]

                sm:w-auto

                ${
                  savedSuccess
                    ? `
                      bg-emerald-600
                      shadow-emerald-500/25
                    `
                    : `
                      bg-[#007AFF]
                      shadow-blue-500/20

                      hover:bg-blue-600
                    `
                }
              `}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2
                    className="
                      h-4
                      w-4
                    "
                  />

                  Saved ✓
                </>
              ) : (
                <>
                  <Save
                    className="
                      h-4
                      w-4
                    "
                  />

                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };