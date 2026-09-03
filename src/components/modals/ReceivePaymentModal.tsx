import React, {
  useEffect,
  useState,
} from 'react';

import { useCRM } from '../../context/CRMContext';

import {
  X,
  DollarSign,
  Check,
  Percent,
  UserRound,
  CalendarDays,
  CreditCard,
  ReceiptText,
} from 'lucide-react';

import confetti from 'canvas-confetti';

import {
  PaymentMethod,
} from '../../types/crm';

import {
  ACADEMIC_MONTHS,
  getCurrentAcademicMonth,
} from '../../constants/academic';


export const ReceivePaymentModal:
  React.FC = () => {
    const {
      isReceivePaymentModalOpen,
      setIsReceivePaymentModalOpen,

      paymentModalDefaultStudentId,
      setPaymentModalDefaultStudentId,

      paymentModalDefaultMonth,
      setPaymentModalDefaultMonth,

      students,
      recordPayment,
      settings,
    } = useCRM();


    const [
      studentId,
      setStudentId,
    ] = useState('');


    const [
      selectedMonth,
      setSelectedMonth,
    ] = useState<string>(
      getCurrentAcademicMonth()
    );


    const [
      discountPercent,
      setDiscountPercent,
    ] = useState(0);


    const [
      method,
      setMethod,
    ] = useState<PaymentMethod>(
      'Payme / Click'
    );


    const [
      notes,
      setNotes,
    ] = useState('');


    const MONTHS =
      ACADEMIC_MONTHS as readonly string[];


    // ─────────────────────────────────────────────────────────────────────────
    // DEFAULT VALUES WHEN MODAL OPENS
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
      if (
        !isReceivePaymentModalOpen
      ) {
        return;
      }


      // Student
      if (
        paymentModalDefaultStudentId
      ) {
        setStudentId(
          paymentModalDefaultStudentId
        );
      } else if (
        students.length > 0
      ) {
        setStudentId(
          students[0].id
        );
      }


      // Month
      if (
        paymentModalDefaultMonth &&
        MONTHS.includes(
          paymentModalDefaultMonth
        )
      ) {
        setSelectedMonth(
          paymentModalDefaultMonth
        );
      } else {
        setSelectedMonth(
          getCurrentAcademicMonth()
        );
      }


      // Reset form
      setDiscountPercent(0);

      setMethod(
        'Payme / Click'
      );

      setNotes('');
    }, [
      isReceivePaymentModalOpen,
      paymentModalDefaultStudentId,
      paymentModalDefaultMonth,
      students,
    ]);


    if (
      !isReceivePaymentModalOpen
    ) {
      return null;
    }


    // ─────────────────────────────────────────────────────────────────────────
    // CURRENT STUDENT
    // ─────────────────────────────────────────────────────────────────────────

    const currentStudent =
      students.find(
        student =>
          student.id === studentId
      ) ?? students[0];


    const baseFee =
      currentStudent
        ? currentStudent.monthlyFee
        : 0;


    const finalAmount =
      Math.max(
        0,

        baseFee *
          (
            1 -
            discountPercent / 100
          )
      );


    const discountAmount =
      baseFee *
      discountPercent /
      100;


    // ─────────────────────────────────────────────────────────────────────────
    // CLOSE
    // ─────────────────────────────────────────────────────────────────────────

    const handleClose = () => {
      setIsReceivePaymentModalOpen(
        false
      );

      setPaymentModalDefaultStudentId(
        null
      );

      setPaymentModalDefaultMonth(
        null
      );
    };


    // ─────────────────────────────────────────────────────────────────────────
    // SUBMIT
    // ─────────────────────────────────────────────────────────────────────────

    const handleSubmit = (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      if (!currentStudent) {
        return;
      }


      recordPayment({
        studentId:
          currentStudent.id,

        month:
          selectedMonth,

        amount:
          finalAmount,

        discount:
          discountPercent,

        method,

        notes:
          notes.trim() ||
          undefined,
      });


      confetti({
        particleCount: 80,

        spread: 80,

        origin: {
          y: 0.6,
        },

        colors: [
          '#007AFF',
          '#34C759',
          '#FF9500',
        ],
      });


      handleClose();
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
      bg-white
      px-3.5
      text-sm
      font-medium
      text-slate-900
      outline-none
      transition-all

      focus:border-emerald-500/60
      focus:ring-2
      focus:ring-emerald-500/10

      dark:border-slate-700
      dark:bg-slate-800
      dark:text-white
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
          fixed inset-0
          z-[110]

          flex
          items-end
          justify-center

          bg-slate-950/50
          backdrop-blur-sm

          sm:items-center
          sm:p-4
        "
        onMouseDown={
          handleClose
        }
      >
        <div
          className="
            flex
            max-h-[96vh]
            w-full
            flex-col
            overflow-hidden

            rounded-t-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl

            animate-in
            fade-in
            slide-in-from-bottom-4
            duration-200

            dark:border-slate-800
            dark:bg-slate-900

            sm:max-h-[90vh]
            sm:max-w-lg
            sm:rounded-3xl
            sm:zoom-in-95
          "
          onMouseDown={
            event =>
              event.stopPropagation()
          }
        >
          {/* HEADER */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-3

              bg-gradient-to-r
              from-emerald-600
              to-teal-600

              px-4
              py-4

              text-white

              sm:px-6
              sm:py-5
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
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl
                  bg-white/20
                  backdrop-blur-md

                  sm:rounded-2xl
                "
              >
                <DollarSign
                  className="
                    h-5
                    w-5
                    text-white
                  "
                />
              </div>


              <div
                className="
                  min-w-0
                "
              >
                <h2
                  className="
                    truncate
                    text-base
                    font-bold
                    tracking-tight

                    sm:text-lg
                  "
                >
                  Receive Student Payment
                </h2>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-emerald-100

                    sm:text-xs
                  "
                >
                  Process tuition fee
                  and issue receipt.
                </p>
              </div>
            </div>


            <button
              type="button"
              onClick={
                handleClose
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-xl

                text-white/80

                transition-colors

                hover:bg-white/10
                hover:text-white
              "
              aria-label="Close payment modal"
            >
              <X
                className="
                  h-5
                  w-5
                "
              />
            </button>
          </div>


          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              flex
              min-h-0
              flex-1
              flex-col
            "
          >
            {/* SCROLLABLE BODY */}

            <div
              className="
                flex-1
                space-y-4
                overflow-y-auto

                px-4
                py-5

                scrollbar-thin

                sm:px-6
                sm:py-6
              "
            >
              {/* STUDENT */}

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Select Student *
                </label>

                <div
                  className="
                    relative
                  "
                >
                  <UserRound
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
                      currentStudent?.id ??
                      ''
                    }
                    onChange={
                      event =>
                        setStudentId(
                          event.target.value
                        )
                    }
                    disabled={
                      students.length === 0
                    }
                    className={`
                      ${inputClass}

                      cursor-pointer
                      pl-10

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    `}
                  >
                    {students.length ===
                    0 ? (
                      <option value="">
                        No students available
                      </option>
                    ) : (
                      students.map(
                        student => (
                          <option
                            key={
                              student.id
                            }
                            value={
                              student.id
                            }
                          >
                            {
                              student.fullName
                            }
                            {' — '}
                            {
                              student.groupName
                            }
                          </option>
                        )
                      )
                    )}
                  </select>
                </div>
              </div>


              {/* STUDENT SUMMARY */}

              {currentStudent && (
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2

                    rounded-2xl
                    border
                    border-emerald-100
                    bg-emerald-50/60
                    p-3

                    dark:border-emerald-900/40
                    dark:bg-emerald-950/20
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Group
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[10px]
                        font-bold
                        text-slate-700

                        dark:text-slate-300
                      "
                    >
                      {
                        currentStudent.groupName
                      }
                    </p>
                  </div>


                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Monthly Fee
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        font-black
                        text-emerald-600

                        dark:text-emerald-400
                      "
                    >
                      {
                        settings.currencySymbol
                      }
                      {baseFee.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}


              {/* MONTH + METHOD */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3

                  sm:grid-cols-2
                "
              >
                {/* MONTH */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Academic Month *
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <CalendarDays
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
                        selectedMonth
                      }
                      onChange={
                        event =>
                          setSelectedMonth(
                            event.target.value
                          )
                      }
                      className={`
                        ${inputClass}

                        cursor-pointer
                        pl-10
                      `}
                    >
                      {MONTHS.map(
                        month => (
                          <option
                            key={
                              month
                            }
                            value={
                              month
                            }
                          >
                            {month}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>


                {/* METHOD */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Payment Method
                  </label>

                  <div
                    className="
                      relative
                    "
                  >
                    <CreditCard
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
                        method
                      }
                      onChange={
                        event =>
                          setMethod(
                            event.target
                              .value as PaymentMethod
                          )
                      }
                      className={`
                        ${inputClass}

                        cursor-pointer
                        pl-10
                      `}
                    >
                      <option value="Payme / Click">
                        Payme / Click
                      </option>

                      <option value="Card">
                        Visa / MasterCard
                      </option>

                      <option value="Cash">
                        Cash in Hand
                      </option>

                      <option value="Bank Transfer">
                        Bank Transfer
                      </option>
                    </select>
                  </div>
                </div>
              </div>


              {/* DISCOUNT */}

              <div>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <label
                    className="
                      flex
                      items-center
                      gap-1.5

                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    <Percent
                      className="
                        h-3.5
                        w-3.5
                        text-[#007AFF]
                      "
                    />

                    Discount
                  </label>


                  <span
                    className="
                      rounded-lg
                      bg-blue-50
                      px-2
                      py-1

                      text-[10px]
                      font-black
                      text-[#007AFF]

                      dark:bg-blue-950/40
                    "
                  >
                    {discountPercent}%
                  </span>
                </div>


                <div
                  className="
                    grid
                    grid-cols-5
                    gap-1.5

                    sm:gap-2
                  "
                >
                  {[
                    0,
                    10,
                    15,
                    20,
                    25,
                  ].map(
                    discount => (
                      <button
                        type="button"
                        key={
                          discount
                        }
                        onClick={() =>
                          setDiscountPercent(
                            discount
                          )
                        }
                        className={`
                          h-10
                          cursor-pointer
                          rounded-xl
                          border

                          text-[10px]
                          font-bold

                          transition-all

                          active:scale-[0.97]

                          sm:text-xs

                          ${
                            discountPercent ===
                            discount
                              ? `
                                border-[#007AFF]
                                bg-blue-50
                                text-[#007AFF]

                                dark:bg-blue-950/50
                              `
                              : `
                                border-slate-200
                                bg-white
                                text-slate-600

                                hover:bg-slate-50

                                dark:border-slate-700
                                dark:bg-slate-800
                                dark:text-slate-300
                                dark:hover:bg-slate-700
                              `
                          }
                        `}
                      >
                        {discount}%
                      </button>
                    )
                  )}
                </div>
              </div>


              {/* NOTES */}

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Notes
                </label>

                <textarea
                  value={
                    notes
                  }
                  onChange={
                    event =>
                      setNotes(
                        event.target.value
                      )
                  }
                  rows={3}
                  placeholder="Optional payment note..."
                  className="
                    min-h-[88px]
                    w-full
                    resize-none
                    rounded-xl

                    border
                    border-slate-200

                    bg-white
                    px-3.5
                    py-3

                    text-sm
                    text-slate-900

                    outline-none
                    transition-all

                    placeholder:text-slate-400

                    focus:border-emerald-500/60
                    focus:ring-2
                    focus:ring-emerald-500/10

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />
              </div>


              {/* PAYMENT SUMMARY */}

              <div
                className="
                  space-y-2
                  rounded-2xl

                  border
                  border-slate-200/80

                  bg-slate-50
                  p-4

                  dark:border-slate-700/80
                  dark:bg-slate-800/60
                "
              >
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    gap-2
                  "
                >
                  <ReceiptText
                    className="
                      h-4
                      w-4
                      text-slate-400
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Payment Summary
                  </span>
                </div>


                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-[11px]
                    text-slate-500
                  "
                >
                  <span>
                    Standard Group Fee
                  </span>

                  <span
                    className="
                      shrink-0
                      font-semibold
                    "
                  >
                    {
                      settings.currencySymbol
                    }
                    {baseFee.toLocaleString()}
                  </span>
                </div>


                {discountPercent >
                  0 && (
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4

                      text-[11px]
                      font-semibold
                      text-emerald-600
                    "
                  >
                    <span>
                      Discount
                      {' '}
                      (-{discountPercent}%)
                    </span>

                    <span
                      className="
                        shrink-0
                      "
                    >
                      -
                      {
                        settings.currencySymbol
                      }
                      {discountAmount
                        .toFixed(0)}
                    </span>
                  </div>
                )}


                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    gap-3

                    border-t
                    border-slate-200
                    pt-3

                    dark:border-slate-700
                  "
                >
                  <span
                    className="
                      text-xs
                      font-extrabold
                      text-slate-900

                      dark:text-white

                      sm:text-sm
                    "
                  >
                    Total Payable
                  </span>


                  <span
                    className="
                      shrink-0
                      whitespace-nowrap

                      text-lg
                      font-black
                      text-emerald-600

                      dark:text-emerald-400

                      sm:text-xl
                    "
                  >
                    {
                      settings.currencySymbol
                    }
                    {finalAmount
                      .toFixed(0)}
                  </span>
                </div>
              </div>
            </div>


            {/* FIXED FOOTER */}

            <div
              className="
                grid
                shrink-0
                grid-cols-[0.8fr_1.2fr]
                gap-2

                border-t
                border-slate-100

                bg-white
                p-4

                dark:border-slate-800
                dark:bg-slate-900

                sm:flex
                sm:items-center
                sm:justify-end
                sm:gap-3
                sm:px-6
              "
            >
              <button
                type="button"
                onClick={
                  handleClose
                }
                className="
                  cursor-pointer
                  rounded-xl

                  border
                  border-slate-200

                  bg-white
                  px-4
                  py-2.5

                  text-xs
                  font-semibold
                  text-slate-600

                  transition-colors

                  hover:bg-slate-100

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-300
                  dark:hover:bg-slate-700
                "
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={
                  !currentStudent
                }
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2

                  rounded-xl
                  bg-emerald-600

                  px-4
                  py-2.5

                  text-[10px]
                  font-bold
                  text-white

                  shadow-lg
                  shadow-emerald-600/20

                  transition-all

                  hover:bg-emerald-700

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:px-6
                  sm:text-xs
                "
              >
                <Check
                  className="
                    h-4
                    w-4
                    shrink-0
                  "
                />

                <span
                  className="
                    sm:hidden
                  "
                >
                  Confirm Payment
                </span>

                <span
                  className="
                    hidden

                    sm:inline
                  "
                >
                  Confirm & Issue Receipt
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };