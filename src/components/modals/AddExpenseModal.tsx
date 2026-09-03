import React, { useState } from 'react';

import { useCRM } from '../../context/CRMContext';

import {
  X,
  Receipt,
  Plus,
} from 'lucide-react';

import type {
  Expense,
} from '../../types/crm';

import {
  showToast,
} from '../common/Toast';


export const AddExpenseModal: React.FC = () => {
  const {
    isAddExpenseModalOpen,
    setIsAddExpenseModalOpen,
    addExpense,
    settings,
  } = useCRM();


  const [title, setTitle] =
    useState('');

  const [category, setCategory] =
    useState<Expense['category']>(
      'Utilities & Software'
    );

  const [amount, setAmount] =
    useState(250);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState('Card');

  const [
    requestedBy,
    setRequestedBy,
  ] = useState(
    'Administration'
  );

  const [notes, setNotes] =
    useState('');


  if (
    !isAddExpenseModalOpen
  ) {
    return null;
  }


  const handleClose = () => {
    setIsAddExpenseModalOpen(
      false
    );
  };


  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();


    if (!title.trim()) {
      return;
    }


    const cleanTitle =
      title.trim();

    const cleanAmount =
      Number(amount);


    addExpense({
      title: cleanTitle,

      category,

      amount: cleanAmount,

      date:
        new Date()
          .toISOString()
          .split('T')[0],

      paymentMethod,

      requestedBy:
        requestedBy.trim(),

      notes:
        notes.trim(),
    });


    showToast({
      type: 'success',

      title:
        'Expense added successfully',

      message:
        `${cleanTitle} • ` +
        `${settings.currencySymbol}` +
        `${cleanAmount.toLocaleString()}`,

      duration: 3000,
    });


    setIsAddExpenseModalOpen(
      false
    );


    setTitle('');
    setCategory(
      'Utilities & Software'
    );
    setAmount(250);
    setPaymentMethod('Card');
    setRequestedBy(
      'Administration'
    );
    setNotes('');
  };


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

    placeholder:text-slate-400

    focus:border-rose-400
    focus:ring-2
    focus:ring-rose-500/10

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
        fixed
        inset-0
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
          max-h-[95vh]
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
          sm:max-w-md
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

            border-b
            border-slate-100

            bg-slate-50/70

            px-4
            py-4

            dark:border-slate-800
            dark:bg-slate-900

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
                bg-rose-50
                text-rose-600

                dark:bg-rose-950/50

                sm:rounded-2xl
              "
            >
              <Receipt
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
              <h2
                className="
                  truncate
                  text-base
                  font-bold
                  tracking-tight
                  text-slate-900

                  dark:text-white

                  sm:text-lg
                "
              >
                Record New Expense
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  leading-relaxed
                  text-slate-500

                  sm:text-xs
                "
              >
                Log operational and
                campus expenditures.
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

              text-slate-400

              transition-colors

              hover:bg-slate-100
              hover:text-slate-700

              dark:hover:bg-slate-800
              dark:hover:text-white
            "
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
          <div
            className="
              flex-1
              overflow-y-auto

              px-4
              py-5

              scrollbar-thin

              sm:px-6
              sm:py-6
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
                  Expense Title *
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={
                    event =>
                      setTitle(
                        event.target.value
                      )
                  }
                  placeholder="e.g. New Projector Bulb"
                  className={
                    inputClass
                  }
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
                  value={category}
                  onChange={
                    event =>
                      setCategory(
                        event.target
                          .value as Expense['category']
                      )
                  }
                  className={`
                    ${inputClass}
                    cursor-pointer
                  `}
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
                  required
                  min="0"
                  value={amount}
                  onChange={
                    event =>
                      setAmount(
                        Number(
                          event.target.value
                        )
                      )
                  }
                  className={`
                    ${inputClass}

                    font-bold
                    text-rose-600

                    dark:text-rose-400
                  `}
                />
              </div>


              {/* PAYMENT METHOD */}

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Payment Method
                </label>

                <select
                  value={
                    paymentMethod
                  }
                  onChange={
                    event =>
                      setPaymentMethod(
                        event.target.value
                      )
                  }
                  className={`
                    ${inputClass}
                    cursor-pointer
                  `}
                >
                  <option value="Card">
                    Corporate Card
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Cash">
                    Petty Cash
                  </option>
                </select>
              </div>


              {/* REQUESTED BY */}

              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Requested By
                </label>

                <input
                  type="text"
                  value={
                    requestedBy
                  }
                  onChange={
                    event =>
                      setRequestedBy(
                        event.target.value
                      )
                  }
                  className={
                    inputClass
                  }
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
                  Notes / Description
                </label>

                <textarea
                  rows={3}
                  value={notes}
                  onChange={
                    event =>
                      setNotes(
                        event.target.value
                      )
                  }
                  placeholder="Vendor details, invoice numbers..."
                  className={`
                    ${inputClass}

                    h-auto
                    min-h-[90px]
                    resize-none
                    py-3
                  `}
                />
              </div>
            </div>
          </div>


          {/* FOOTER */}

          <div
            className="
              grid
              shrink-0
              grid-cols-2
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
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2

                rounded-xl
                bg-rose-600

                px-5
                py-2.5

                text-xs
                font-bold
                text-white

                shadow-lg
                shadow-rose-600/20

                transition-all

                hover:bg-rose-700

                active:scale-[0.98]
              "
            >
              <Plus
                className="
                  h-4
                  w-4
                "
              />

              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};