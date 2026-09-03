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
} from 'lucide-react';


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
      savedSuccess,
      setSavedSuccess,
    ] = useState(false);


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
            ? 'UZS '
            : '€',

        academicYear,

        enableSmsNotifications:
          enableSms,

        autoRemindUnpaid:
          autoRemind,
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