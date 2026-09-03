import React, {
  useMemo,
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import type {
  Expense,
} from '../types/crm';

import {
  Plus,
  Trash2,
  AlertTriangle,
  Pencil,
  X,
  Save,
  ReceiptText,
  CalendarDays,
  CreditCard,
  UserRound,
  Wallet,
  TrendingDown,
  Hash,
  ArrowUpRight,
} from 'lucide-react';

import {
  showToast,
} from '../components/common/Toast';


export const ExpensesPage: React.FC = () => {
  const {
    expenses,
    updateExpense,
    deleteExpense,
    setIsAddExpenseModalOpen,
    settings,
  } = useCRM();


  // ==========================================================================
  // STATE
  // ==========================================================================

  const [
    expenseToDelete,
    setExpenseToDelete,
  ] = useState<string | null>(null);


  const [
    expenseToEdit,
    setExpenseToEdit,
  ] = useState<Expense | null>(null);


  const [
    editForm,
    setEditForm,
  ] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    paymentMethod: '',
    requestedBy: '',
    notes: '',
  });


  // ==========================================================================
  // CALCULATIONS
  // ==========================================================================

  const totalExpenseSum = useMemo(
    () =>
      expenses.reduce(
        (total, expense) =>
          total + expense.amount,
        0
      ),
    [expenses]
  );


  const averageExpense = useMemo(() => {
    if (expenses.length === 0) {
      return 0;
    }

    return Math.round(
      totalExpenseSum /
        expenses.length
    );
  }, [
    expenses.length,
    totalExpenseSum,
  ]);


  const formatMoney = (
    amount: number
  ) =>
    `${settings.currencySymbol}${amount.toLocaleString()}`;


  // ==========================================================================
  // DELETE
  // ==========================================================================

  const selectedExpenseToDelete =
    expenses.find(
      expense =>
        expense.id ===
        expenseToDelete
    );


  const handleConfirmDelete = () => {
    if (
      !selectedExpenseToDelete
    ) {
      return;
    }


    const deletedTitle =
      selectedExpenseToDelete.title;


    const deletedAmount =
      selectedExpenseToDelete.amount;


    deleteExpense(
      selectedExpenseToDelete.id
    );


    setExpenseToDelete(null);


    showToast({
      type: 'success',

      title:
        'Expense deleted successfully',

      message:
        `${deletedTitle} • ${formatMoney(
          deletedAmount
        )}`,

      duration: 3000,
    });
  };


  // ==========================================================================
  // EDIT
  // ==========================================================================

  const handleOpenEdit = (
    expense: Expense
  ) => {
    setExpenseToEdit(expense);


    setEditForm({
      title:
        expense.title ?? '',

      category:
        expense.category ?? '',

      amount:
        String(
          expense.amount ?? ''
        ),

      date:
        expense.date ?? '',

      paymentMethod:
        expense.paymentMethod ?? '',

      requestedBy:
        expense.requestedBy ?? '',

      notes:
        expense.notes ?? '',
    });
  };


  const handleCloseEdit = () => {
    setExpenseToEdit(null);


    setEditForm({
      title: '',
      category: '',
      amount: '',
      date: '',
      paymentMethod: '',
      requestedBy: '',
      notes: '',
    });
  };


  const handleSaveEdit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();


    if (!expenseToEdit) {
      return;
    }


    const cleanTitle =
      editForm.title.trim();

    const cleanCategory =
      editForm.category.trim();

    const cleanMethod =
      editForm.paymentMethod.trim();

    const cleanRequestedBy =
      editForm.requestedBy.trim();

    const numericAmount =
      Number(editForm.amount);


    if (
      !cleanTitle ||
      !cleanCategory ||
      !editForm.date ||
      !cleanMethod ||
      !cleanRequestedBy
    ) {
      showToast({
        type: 'warning',

        title:
          'Complete required fields',

        message:
          'Please fill in all required expense information.',

        duration: 3000,
      });

      return;
    }


    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      showToast({
        type: 'error',

        title:
          'Invalid expense amount',

        message:
          'Expense amount must be greater than zero.',

        duration: 3000,
      });

      return;
    }


    const updatedCategory =
      cleanCategory as Expense['category'];


    const updatedPaymentMethod =
      cleanMethod as Expense['paymentMethod'];


    updateExpense(
      expenseToEdit.id,
      {
        title:
          cleanTitle,

        category:
          updatedCategory,

        amount:
          numericAmount,

        date:
          editForm.date,

        paymentMethod:
          updatedPaymentMethod,

        requestedBy:
          cleanRequestedBy,

        notes:
          editForm.notes.trim() ||
          undefined,
      }
    );


    showToast({
      type: 'success',

      title:
        'Expense updated successfully',

      message:
        `${cleanTitle} • ${formatMoney(
          numericAmount
        )}`,

      duration: 3000,
    });


    handleCloseEdit();
  };


  // ==========================================================================
  // STYLES
  // ==========================================================================

  const fieldClass = `
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
    duration-200

    placeholder:text-slate-400

    hover:border-slate-300

    focus:border-[#007AFF]
    focus:ring-4
    focus:ring-[#007AFF]/10

    dark:border-slate-700
    dark:bg-slate-800/80
    dark:text-slate-100

    dark:hover:border-slate-600

    dark:focus:border-[#007AFF]
    dark:focus:bg-slate-800
  `;


  const labelClass = `
    mb-2
    block
    text-[11px]
    font-semibold
    text-slate-500

    dark:text-slate-400
  `;


  // ==========================================================================
  // PAGE
  // ==========================================================================

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1500px]

        px-4
        py-5

        sm:px-6
        sm:py-6

        xl:px-8
        xl:py-8
      "
    >
      {/* ================================================================
          PAGE HEADER
      ================================================================ */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <div
            className="
              mb-2
              flex
              items-center
              gap-2

              text-[11px]
              font-semibold
              text-[#007AFF]
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#007AFF]
              "
            />

            Finance
          </div>


          <h1
            className="
              text-2xl
              font-bold
              tracking-[-0.025em]
              text-slate-950

              dark:text-white

              sm:text-[28px]
            "
          >
            Expenses
          </h1>


          <p
            className="
              mt-1.5
              max-w-2xl

              text-sm
              leading-6
              text-slate-500

              dark:text-slate-400
            "
          >
            Track and manage operational
            spending, salaries,
            procurement and other center
            expenses.
          </p>
        </div>


        <button
          type="button"
          onClick={() =>
            setIsAddExpenseModalOpen(
              true
            )
          }
          className="
            inline-flex
            h-11
            w-full
            cursor-pointer
            items-center
            justify-center
            gap-2

            rounded-xl
            bg-[#007AFF]

            px-5

            text-sm
            font-semibold
            text-white

            shadow-lg
            shadow-blue-500/20

            transition-all

            hover:bg-[#006EE6]
            hover:shadow-xl
            hover:shadow-blue-500/20

            active:scale-[0.98]

            sm:w-auto
          "
        >
          <Plus
            className="
              h-4
              w-4
            "
          />

          Add Expense
        </button>
      </div>


      {/* ================================================================
          FINANCIAL SUMMARY
      ================================================================ */}

      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-3

          sm:grid-cols-3
        "
      >
        {/* TOTAL */}

        <div
          className="
            relative
            overflow-hidden

            rounded-2xl
            border
            border-slate-200/80

            bg-white
            p-5

            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              absolute
              -right-10
              -top-10

              h-32
              w-32
              rounded-full

              bg-rose-500/5
              blur-2xl
            "
          />


          <div
            className="
              relative
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Total expenses
              </p>


              <p
                className="
                  mt-2

                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-950

                  dark:text-white
                "
              >
                {formatMoney(
                  totalExpenseSum
                )}
              </p>


              <div
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-1.5

                  text-[11px]
                  font-medium
                  text-rose-500
                "
              >
                <TrendingDown
                  className="
                    h-3.5
                    w-3.5
                  "
                />

                Recorded spending
              </div>
            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-rose-500/10
                text-rose-500
              "
            >
              <Wallet
                className="
                  h-[18px]
                  w-[18px]
                "
              />
            </div>
          </div>
        </div>


        {/* RECORDS */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/80

            bg-white
            p-5

            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Expense records
              </p>


              <p
                className="
                  mt-2

                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-950

                  dark:text-white
                "
              >
                {expenses.length}
              </p>


              <p
                className="
                  mt-3

                  text-[11px]
                  font-medium
                  text-slate-400
                "
              >
                Total recorded entries
              </p>
            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-blue-500/10
                text-[#007AFF]
              "
            >
              <ReceiptText
                className="
                  h-[18px]
                  w-[18px]
                "
              />
            </div>
          </div>
        </div>


        {/* AVERAGE */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/80

            bg-white
            p-5

            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Average expense
              </p>


              <p
                className="
                  mt-2

                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-950

                  dark:text-white
                "
              >
                {formatMoney(
                  averageExpense
                )}
              </p>


              <p
                className="
                  mt-3

                  text-[11px]
                  font-medium
                  text-slate-400
                "
              >
                Average per record
              </p>
            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                bg-slate-100
                text-slate-500

                dark:bg-slate-800
                dark:text-slate-300
              "
            >
              <Hash
                className="
                  h-[18px]
                  w-[18px]
                "
              />
            </div>
          </div>
        </div>
      </div>


      {/* ================================================================
          EXPENSE LIST CONTAINER
      ================================================================ */}

      <section
        className="
          overflow-hidden

          rounded-2xl
          border
          border-slate-200/80

          bg-white

          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* SECTION HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4

            border-b
            border-slate-100

            px-5
            py-4

            dark:border-slate-800
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-semibold
                text-slate-900

                dark:text-white
              "
            >
              Expense history
            </h2>


            <p
              className="
                mt-0.5

                text-[11px]
                text-slate-400
              "
            >
              All recorded financial
              outflows
            </p>
          </div>


          <div
            className="
              flex
              items-center
              gap-1.5

              rounded-lg

              bg-slate-100

              px-2.5
              py-1.5

              text-[10px]
              font-semibold
              text-slate-500

              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            {expenses.length}

            {' '}

            {expenses.length === 1
              ? 'record'
              : 'records'}
          </div>
        </div>


        {/* ============================================================
            MOBILE
        ============================================================ */}

        <div
          className="
            divide-y
            divide-slate-100

            dark:divide-slate-800

            md:hidden
          "
        >
          {expenses.length === 0 ? (
            <div
              className="
                px-5
                py-16
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-slate-100
                  text-slate-400

                  dark:bg-slate-800
                "
              >
                <ReceiptText
                  className="
                    h-5
                    w-5
                  "
                />
              </div>


              <p
                className="
                  mt-4

                  text-sm
                  font-semibold
                  text-slate-800

                  dark:text-white
                "
              >
                No expenses recorded
              </p>


              <p
                className="
                  mt-1

                  text-xs
                  text-slate-400
                "
              >
                Add your first expense
                to start tracking.
              </p>
            </div>
          ) : (
            expenses.map(
              expense => (
                <div
                  key={
                    expense.id
                  }
                  className="
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate

                          text-sm
                          font-semibold
                          text-slate-900

                          dark:text-white
                        "
                      >
                        {expense.title}
                      </p>


                      <span
                        className="
                          mt-1.5
                          inline-flex

                          rounded-lg

                          bg-slate-100

                          px-2
                          py-1

                          text-[10px]
                          font-medium
                          text-slate-500

                          dark:bg-slate-800
                          dark:text-slate-400
                        "
                      >
                        {expense.category}
                      </span>
                    </div>


                    <p
                      className="
                        shrink-0

                        text-sm
                        font-bold
                        text-rose-500
                      "
                    >
                      {formatMoney(
                        expense.amount
                      )}
                    </p>
                  </div>


                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-slate-50

                        px-3
                        py-2.5

                        dark:bg-slate-800/60
                      "
                    >
                      <CalendarDays
                        className="
                          h-3.5
                          w-3.5
                          shrink-0
                          text-slate-400
                        "
                      />


                      <span
                        className="
                          truncate

                          text-[11px]
                          font-medium
                          text-slate-600

                          dark:text-slate-300
                        "
                      >
                        {expense.date}
                      </span>
                    </div>


                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-slate-50

                        px-3
                        py-2.5

                        dark:bg-slate-800/60
                      "
                    >
                      <CreditCard
                        className="
                          h-3.5
                          w-3.5
                          shrink-0
                          text-slate-400
                        "
                      />


                      <span
                        className="
                          truncate

                          text-[11px]
                          font-medium
                          text-slate-600

                          dark:text-slate-300
                        "
                      >
                        {
                          expense.paymentMethod
                        }
                      </span>
                    </div>
                  </div>


                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-2

                      px-1

                      text-[11px]
                      text-slate-400
                    "
                  >
                    <UserRound
                      className="
                        h-3.5
                        w-3.5
                      "
                    />

                    <span
                      className="
                        truncate
                      "
                    >
                      {
                        expense.requestedBy
                      }
                    </span>
                  </div>


                  {expense.notes && (
                    <p
                      className="
                        mt-3
                        line-clamp-2

                        text-[11px]
                        leading-5
                        text-slate-400
                      "
                    >
                      {expense.notes}
                    </p>
                  )}


                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-end
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenEdit(
                          expense
                        )
                      }
                      className="
                        inline-flex
                        h-9
                        cursor-pointer
                        items-center
                        justify-center
                        gap-1.5

                        rounded-lg

                        border
                        border-slate-200

                        px-3

                        text-[11px]
                        font-medium
                        text-slate-600

                        transition-all

                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-[#007AFF]

                        dark:border-slate-700
                        dark:text-slate-300

                        dark:hover:border-blue-900
                        dark:hover:bg-blue-950/30
                        dark:hover:text-blue-400
                      "
                    >
                      <Pencil
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        setExpenseToDelete(
                          expense.id
                        )
                      }
                      className="
                        inline-flex
                        h-9
                        cursor-pointer
                        items-center
                        justify-center
                        gap-1.5

                        rounded-lg

                        border
                        border-slate-200

                        px-3

                        text-[11px]
                        font-medium
                        text-slate-500

                        transition-all

                        hover:border-rose-200
                        hover:bg-rose-50
                        hover:text-rose-600

                        dark:border-slate-700

                        dark:hover:border-rose-900
                        dark:hover:bg-rose-950/30
                        dark:hover:text-rose-400
                      "
                    >
                      <Trash2
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                      Delete
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>


        {/* ============================================================
            DESKTOP TABLE
        ============================================================ */}

        <div
          className="
            hidden
            overflow-x-auto

            md:block
          "
        >
          {expenses.length === 0 ? (
            <div
              className="
                py-20
                text-center
              "
            >
              <ReceiptText
                className="
                  mx-auto

                  h-7
                  w-7

                  text-slate-300
                "
              />


              <p
                className="
                  mt-3

                  text-sm
                  font-semibold
                  text-slate-600

                  dark:text-slate-300
                "
              >
                No expenses recorded
              </p>
            </div>
          ) : (
            <table
              className="
                w-full
                min-w-[950px]
                text-left
              "
            >
              <thead>
                <tr
                  className="
                    bg-slate-50/80

                    dark:bg-slate-800/60
                  "
                >
                  {[
                    'Expense',
                    'Category',
                    'Amount',
                    'Date',
                    'Payment method',
                    'Requested by',
                    '',
                  ].map(
                    (
                      column,
                      index
                    ) => (
                      <th
                        key={
                          `${column}-${index}`
                        }
                        className={`
                          px-5
                          py-3.5

                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-slate-400

                          ${
                            index ===
                            6
                              ? 'text-right'
                              : ''
                          }
                        `}
                      >
                        {column}
                      </th>
                    )
                  )}
                </tr>
              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100

                  dark:divide-slate-800
                "
              >
                {expenses.map(
                  expense => (
                    <tr
                      key={
                        expense.id
                      }
                      className="
                        group

                        transition-colors

                        hover:bg-slate-50/70

                        dark:hover:bg-white/[0.025]
                      "
                    >
                      <td
                        className="
                          px-5
                          py-4
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
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center

                              rounded-xl

                              bg-slate-100

                              text-slate-500

                              dark:bg-slate-800
                              dark:text-slate-400
                            "
                          >
                            <ReceiptText
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
                                max-w-[280px]
                                truncate

                                text-[13px]
                                font-semibold
                                text-slate-900

                                dark:text-slate-100
                              "
                            >
                              {expense.title}
                            </p>


                            {expense.notes && (
                              <p
                                className="
                                  mt-0.5
                                  max-w-[280px]
                                  truncate

                                  text-[10px]
                                  text-slate-400
                                "
                              >
                                {
                                  expense.notes
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </td>


                      <td
                        className="
                          px-5
                          py-4
                        "
                      >
                        <span
                          className="
                            inline-flex

                            rounded-lg

                            bg-slate-100

                            px-2.5
                            py-1.5

                            text-[10px]
                            font-medium
                            text-slate-600

                            dark:bg-slate-800
                            dark:text-slate-300
                          "
                        >
                          {
                            expense.category
                          }
                        </span>
                      </td>


                      <td
                        className="
                          px-5
                          py-4
                        "
                      >
                        <span
                          className="
                            text-[13px]
                            font-semibold
                            text-rose-500
                          "
                        >
                          {formatMoney(
                            expense.amount
                          )}
                        </span>
                      </td>


                      <td
                        className="
                          px-5
                          py-4

                          text-[12px]
                          font-medium
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {expense.date}
                      </td>


                      <td
                        className="
                          px-5
                          py-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-2

                            text-[12px]
                            font-medium
                            text-slate-600

                            dark:text-slate-300
                          "
                        >
                          <CreditCard
                            className="
                              h-3.5
                              w-3.5
                              text-slate-400
                            "
                          />

                          {
                            expense.paymentMethod
                          }
                        </div>
                      </td>


                      <td
                        className="
                          px-5
                          py-4

                          text-[12px]
                          font-medium
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {
                          expense.requestedBy
                        }
                      </td>


                      <td
                        className="
                          px-5
                          py-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-end
                            gap-1
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(
                                expense
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              cursor-pointer
                              items-center
                              justify-center

                              rounded-lg

                              text-slate-400

                              transition-all

                              hover:bg-blue-50
                              hover:text-[#007AFF]

                              dark:hover:bg-blue-950/30
                              dark:hover:text-blue-400
                            "
                            title="Edit expense"
                            aria-label="Edit expense"
                          >
                            <Pencil
                              className="
                                h-4
                                w-4
                              "
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              setExpenseToDelete(
                                expense.id
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              cursor-pointer
                              items-center
                              justify-center

                              rounded-lg

                              text-slate-400

                              transition-all

                              hover:bg-rose-50
                              hover:text-rose-600

                              dark:hover:bg-rose-950/30
                              dark:hover:text-rose-400
                            "
                            title="Delete expense"
                            aria-label="Delete expense"
                          >
                            <Trash2
                              className="
                                h-4
                                w-4
                              "
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>


      {/* ================================================================
          EDIT EXPENSE MODAL
      ================================================================ */}

      {expenseToEdit && (
        <div
          className="
            fixed
            inset-0
            z-[110]

            flex
            items-end
            justify-center

            bg-slate-950/60
            backdrop-blur-[6px]

            sm:items-center
            sm:p-5
          "
          onMouseDown={
            handleCloseEdit
          }
        >
          <div
            className="
              flex
              max-h-[94vh]
              w-full
              flex-col
              overflow-hidden

              rounded-t-[24px]

              border
              border-slate-200

              bg-white

              shadow-2xl

              dark:border-slate-700/70
              dark:bg-[#111B2E]

              sm:max-h-[88vh]
              sm:max-w-[680px]
              sm:rounded-[22px]
            "
            onMouseDown={
              event =>
                event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-4

                border-b
                border-slate-100

                px-5
                py-4

                dark:border-slate-800
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

                    bg-blue-500/10
                    text-[#007AFF]
                  "
                >
                  <Pencil
                    className="
                      h-[18px]
                      w-[18px]
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
                      text-base
                      font-semibold
                      tracking-tight
                      text-slate-950

                      dark:text-white
                    "
                  >
                    Edit expense
                  </h2>


                  <p
                    className="
                      mt-0.5
                      truncate

                      text-[11px]
                      text-slate-400
                    "
                  >
                    Update expense
                    information
                  </p>
                </div>
              </div>


              <button
                type="button"
                onClick={
                  handleCloseEdit
                }
                className="
                  flex
                  h-9
                  w-9
                  cursor-pointer
                  items-center
                  justify-center

                  rounded-lg

                  text-slate-400

                  transition-colors

                  hover:bg-slate-100
                  hover:text-slate-700

                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
                aria-label="Close modal"
              >
                <X
                  className="
                    h-[18px]
                    w-[18px]
                  "
                />
              </button>
            </div>


            {/* MODAL FORM */}

            <form
              onSubmit={
                handleSaveEdit
              }
              className="
                flex
                min-h-0
                flex-1
                flex-col
              "
            >
              <div
                className="
                  flex-1
                  overflow-y-auto

                  px-5
                  py-5
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
                  {/* TITLE */}

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
                      Expense title
                    </label>


                    <input
                      type="text"
                      spellCheck={
                        false
                      }
                      value={
                        editForm.title
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              title:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={
                        fieldClass
                      }
                      placeholder="Enter expense title"
                      required
                    />
                  </div>


                  {/* CATEGORY */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Category
                    </label>


                    <select
                      value={
                        editForm.category
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              category:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={`
                        ${fieldClass}
                        cursor-pointer
                      `}
                      required
                    >
                      <option value="Rent">
                        Rent
                      </option>

                      <option value="Teacher Salaries">
                        Teacher Salaries
                      </option>

                      <option value="Marketing">
                        Marketing
                      </option>

                      <option value="Utilities & Software">
                        Utilities & Software
                      </option>

                      <option value="Equipment">
                        Equipment
                      </option>

                      <option value="Events">
                        Events
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>


                  {/* AMOUNT */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Amount (
                      {
                        settings.currencySymbol
                      }
                      )
                    </label>


                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={
                        editForm.amount
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              amount:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={
                        fieldClass
                      }
                      placeholder="0"
                      required
                    />
                  </div>


                  {/* DATE */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Expense date
                    </label>


                    <input
                      type="date"
                      value={
                        editForm.date
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              date:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={
                        fieldClass
                      }
                      required
                    />
                  </div>


                  {/* METHOD */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Payment method
                    </label>


                    <select
                      value={
                        editForm.paymentMethod
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              paymentMethod:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={`
                        ${fieldClass}
                        cursor-pointer
                      `}
                      required
                    >
                      <option value="Card">
                        Card
                      </option>

                      <option value="Corporate Card">
                        Corporate Card
                      </option>

                      <option value="Bank Transfer">
                        Bank Transfer
                      </option>

                      <option value="Cash">
                        Cash
                      </option>

                      <option value="Payme / Click">
                        Payme / Click
                      </option>
                    </select>
                  </div>


                  {/* REQUESTED BY */}

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
                      Requested by
                    </label>


                    <input
                      type="text"
                      spellCheck={
                        false
                      }
                      value={
                        editForm.requestedBy
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              requestedBy:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={
                        fieldClass
                      }
                      placeholder="Person or department"
                      required
                    />
                  </div>


                  {/* NOTES */}

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
                      Notes
                    </label>


                    <textarea
                      rows={3}
                      spellCheck={
                        false
                      }
                      value={
                        editForm.notes
                      }
                      onChange={
                        event =>
                          setEditForm(
                            previous => ({
                              ...previous,

                              notes:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className={`
                        ${fieldClass}

                        h-auto
                        min-h-[88px]
                        resize-none
                        py-3
                      `}
                      placeholder="Add optional details..."
                    />
                  </div>
                </div>
              </div>


              {/* MODAL FOOTER */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-end
                  gap-2

                  border-t
                  border-slate-100

                  bg-slate-50/70

                  px-5
                  py-4

                  dark:border-slate-800
                  dark:bg-slate-900/40
                "
              >
                <button
                  type="button"
                  onClick={
                    handleCloseEdit
                  }
                  className="
                    h-10
                    cursor-pointer

                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-4

                    text-xs
                    font-semibold
                    text-slate-600

                    transition-all

                    hover:bg-slate-50

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
                  className="
                    inline-flex
                    h-10
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-[#007AFF]

                    px-4

                    text-xs
                    font-semibold
                    text-white

                    shadow-md
                    shadow-blue-500/20

                    transition-all

                    hover:bg-[#006EE6]

                    active:scale-[0.98]
                  "
                >
                  <Save
                    className="
                      h-4
                      w-4
                    "
                  />

                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================================================================
          DELETE CONFIRMATION
      ================================================================ */}

      {selectedExpenseToDelete && (
        <div
          className="
            fixed
            inset-0
            z-[120]

            flex
            items-end
            justify-center

            bg-slate-950/60
            backdrop-blur-[6px]

            sm:items-center
            sm:p-5
          "
          onMouseDown={() =>
            setExpenseToDelete(
              null
            )
          }
        >
          <div
            className="
              w-full

              rounded-t-[24px]

              border
              border-slate-200

              bg-white

              p-5

              shadow-2xl

              dark:border-slate-700
              dark:bg-[#111B2E]

              sm:max-w-[420px]
              sm:rounded-[22px]
              sm:p-6
            "
            onMouseDown={
              event =>
                event.stopPropagation()
            }
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-xl

                bg-rose-500/10
                text-rose-500
              "
            >
              <AlertTriangle
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <h2
              className="
                mt-5

                text-lg
                font-semibold
                tracking-tight
                text-slate-950

                dark:text-white
              "
            >
              Delete expense?
            </h2>


            <p
              className="
                mt-2

                text-sm
                leading-6
                text-slate-500

                dark:text-slate-400
              "
            >
              You are about to
              permanently delete
              {' '}

              <span
                className="
                  font-semibold
                  text-slate-800

                  dark:text-slate-200
                "
              >
                {
                  selectedExpenseToDelete.title
                }
              </span>

              . This action cannot be
              undone.
            </p>


            <div
              className="
                mt-4
                flex
                items-center
                justify-between

                rounded-xl

                bg-slate-50

                px-4
                py-3

                dark:bg-slate-800/60
              "
            >
              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                Amount
              </span>


              <span
                className="
                  text-sm
                  font-semibold
                  text-rose-500
                "
              >
                {formatMoney(
                  selectedExpenseToDelete.amount
                )}
              </span>
            </div>


            <div
              className="
                mt-6
                grid
                grid-cols-2
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setExpenseToDelete(
                    null
                  )
                }
                className="
                  h-10
                  cursor-pointer

                  rounded-xl

                  border
                  border-slate-200

                  text-xs
                  font-semibold
                  text-slate-600

                  transition-all

                  hover:bg-slate-50

                  dark:border-slate-700
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                className="
                  inline-flex
                  h-10
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-rose-600

                  text-xs
                  font-semibold
                  text-white

                  transition-all

                  hover:bg-rose-700

                  active:scale-[0.98]
                "
              >
                <Trash2
                  className="
                    h-4
                    w-4
                  "
                />

                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  