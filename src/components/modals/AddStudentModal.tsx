import React, {
  useEffect,
  useState,
} from 'react';

import { useCRM } from '../../context/CRMContext';

import {
  X,
  UserPlus,
  Sparkles,
} from 'lucide-react';

import confetti from 'canvas-confetti';


export const AddStudentModal:
  React.FC = () => {
    const {
      isAddStudentModalOpen,
      setIsAddStudentModalOpen,

      groups,
      addStudent,

      settings,
    } = useCRM();


    const [
      fullName,
      setFullName,
    ] = useState('');


    const [
      gender,
      setGender,
    ] = useState<
      'Male' | 'Female'
    >('Male');


    const [
      birthDate,
      setBirthDate,
    ] = useState(
      '2008-05-14'
    );


    const [
      phone,
      setPhone,
    ] = useState('');


    const [
      email,
      setEmail,
    ] = useState('');


    const [
      parentName,
      setParentName,
    ] = useState('');


    const [
      parentPhone,
      setParentPhone,
    ] = useState('');


    const [
      groupId,
      setGroupId,
    ] = useState(
      groups[0]?.id || ''
    );


    const [
      notes,
      setNotes,
    ] = useState('');


    // ─────────────────────────────────────────────────────────────────────────
    // KEEP GROUP SELECTION VALID
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
      if (groups.length === 0) {
        setGroupId('');
        return;
      }

      const groupStillExists =
        groups.some(
          group =>
            group.id === groupId
        );

      if (
        !groupId ||
        !groupStillExists
      ) {
        setGroupId(
          groups[0].id
        );
      }
    }, [
      groups,
      groupId,
    ]);


    if (
      !isAddStudentModalOpen
    ) {
      return null;
    }


    const selectedGroup =
      groups.find(
        group =>
          group.id === groupId
      ) ||
      groups[0];


    // ─────────────────────────────────────────────────────────────────────────
    // CLOSE
    // ─────────────────────────────────────────────────────────────────────────

    const handleClose = () => {
      setIsAddStudentModalOpen(
        false
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


      if (
        !fullName.trim() ||
        !phone.trim() ||
        !selectedGroup
      ) {
        return;
      }


      const avatarId =
        Math.floor(
          Math.random() * 70
        ) + 1;


      const avatarGender =
        gender === 'Male'
          ? 'men'
          : 'women';


      const avatar =
        `https://randomuser.me/api/portraits/${avatarGender}/${avatarId}.jpg`;


      addStudent({
        fullName:
          fullName.trim(),

        avatar,

        birthDate,

        gender,

        phone:
          phone.trim(),

        email:
          email.trim() ||
          `${fullName
            .trim()
            .toLowerCase()
            .replace(
              /\s+/g,
              '.'
            )}@gmail.com`,

        parentName:
          parentName.trim() ||
          `Parent of ${fullName.trim()}`,

        parentPhone:
          parentPhone.trim() ||
          phone.trim(),

        groupId:
          selectedGroup.id,

        groupName:
          selectedGroup.name,

        teacherId:
          selectedGroup.teacherId,

        teacherName:
          selectedGroup.teacherName,

        monthlyFee:
          selectedGroup.monthlyFee,

        status:
          'Active',

        joinedDate:
          new Date()
            .toISOString()
            .split('T')[0],

        notes:
          notes.trim(),
      });


      confetti({
        particleCount: 50,
        spread: 70,

        origin: {
          y: 0.6,
        },
      });


      setIsAddStudentModalOpen(
        false
      );


      setFullName('');
      setGender('Male');
      setBirthDate(
        '2008-05-14'
      );
      setPhone('');
      setEmail('');
      setParentName('');
      setParentPhone('');
      setNotes('');
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
      text-slate-900
      outline-none
      transition-all

      placeholder:text-slate-400

      focus:border-[#007AFF]/50
      focus:ring-2
      focus:ring-[#007AFF]/10

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
          z-[100]

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
            sm:max-w-xl
            sm:rounded-3xl
            sm:zoom-in-95
          "
          onMouseDown={
            event =>
              event.stopPropagation()
          }
        >
          {/* ─────────────────────────────────────────────────────────────
              HEADER
          ───────────────────────────────────────────────────────────── */}

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
                  bg-blue-50
                  text-[#007AFF]

                  dark:bg-blue-950/60

                  sm:rounded-2xl
                "
              >
                <UserPlus
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
                  Add New Student
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
                  Register student
                  into a group and
                  add parent details.
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


          {/* ─────────────────────────────────────────────────────────────
              FORM
          ───────────────────────────────────────────────────────────── */}

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
            {/* BODY */}

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
                {/* FULL NAME */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Full Student Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      fullName
                    }
                    onChange={
                      event =>
                        setFullName(
                          event.target.value
                        )
                    }
                    placeholder="e.g. Malika Karimova"
                    className={
                      inputClass
                    }
                  />
                </div>


                {/* GENDER */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Gender *
                  </label>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    {(
                      [
                        'Male',
                        'Female',
                      ] as const
                    ).map(
                      option => (
                        <button
                          type="button"
                          key={
                            option
                          }
                          onClick={() =>
                            setGender(
                              option
                            )
                          }
                          className={`
                            h-11
                            cursor-pointer
                            rounded-xl
                            border
                            text-xs
                            font-semibold
                            transition-all

                            active:scale-[0.98]

                            ${
                              gender ===
                              option
                                ? `
                                  border-[#007AFF]
                                  bg-[#007AFF]
                                  text-white
                                  shadow-sm
                                  shadow-blue-500/20
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
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>


                {/* PHONE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Phone Number *
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      phone
                    }
                    onChange={
                      event =>
                        setPhone(
                          event.target.value
                        )
                    }
                    placeholder="+998..."
                    className={
                      inputClass
                    }
                  />
                </div>


                {/* BIRTH DATE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Birth Date
                  </label>

                  <input
                    type="date"
                    value={
                      birthDate
                    }
                    onChange={
                      event =>
                        setBirthDate(
                          event.target.value
                        )
                    }
                    className={`
                      ${inputClass}

                      cursor-pointer
                    `}
                  />
                </div>


                {/* EMAIL */}

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
                    Student Email
                  </label>

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
                    placeholder="student@email.com"
                    className={
                      inputClass
                    }
                  />
                </div>


                {/* PARENT NAME */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Parent Name
                  </label>

                  <input
                    type="text"
                    value={
                      parentName
                    }
                    onChange={
                      event =>
                        setParentName(
                          event.target.value
                        )
                    }
                    placeholder="Parent or Guardian"
                    className={
                      inputClass
                    }
                  />
                </div>


                {/* PARENT PHONE */}

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Parent Phone
                  </label>

                  <input
                    type="text"
                    value={
                      parentPhone
                    }
                    onChange={
                      event =>
                        setParentPhone(
                          event.target.value
                        )
                    }
                    placeholder="For fee SMS notifications"
                    className={
                      inputClass
                    }
                  />
                </div>


                {/* GROUP */}

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
                    Select Group *
                  </label>

                  <select
                    value={
                      groupId
                    }
                    onChange={
                      event =>
                        setGroupId(
                          event.target.value
                        )
                    }
                    disabled={
                      groups.length === 0
                    }
                    className={`
                      ${inputClass}

                      cursor-pointer
                      font-semibold

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    `}
                  >
                    {groups.length ===
                    0 ? (
                      <option value="">
                        No groups available
                      </option>
                    ) : (
                      groups.map(
                        group => (
                          <option
                            key={
                              group.id
                            }
                            value={
                              group.id
                            }
                          >
                            {group.name}
                            {' — '}
                            {
                              group.teacherName
                            }
                            {' — '}
                            {
                              settings.currencySymbol
                            }
                            {
                              group.monthlyFee
                            }
                            /mo
                          </option>
                        )
                      )
                    )}
                  </select>


                  {selectedGroup && (
                    <div
                      className="
                        mt-2
                        grid
                        grid-cols-2
                        gap-2

                        rounded-xl
                        bg-blue-50/60
                        p-3

                        dark:bg-blue-950/20
                      "
                    >
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
                          Teacher
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[10px]
                            font-semibold
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {
                            selectedGroup.teacherName
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
                            mt-0.5
                            text-[10px]
                            font-bold
                            text-[#007AFF]
                          "
                        >
                          {
                            settings.currencySymbol
                          }
                          {
                            selectedGroup.monthlyFee
                          }
                        </p>
                      </div>
                    </div>
                  )}
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
                    Academic Notes /
                    Goals
                  </label>

                  <textarea
                    rows={3}
                    value={
                      notes
                    }
                    onChange={
                      event =>
                        setNotes(
                          event.target.value
                        )
                    }
                    placeholder="Target score, discount agreement, learning needs..."
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


            {/* ─────────────────────────────────────────────────────────────
                FOOTER
            ───────────────────────────────────────────────────────────── */}

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
                disabled={
                  groups.length === 0
                }
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2

                  rounded-xl
                  bg-[#007AFF]

                  px-5
                  py-2.5

                  text-xs
                  font-bold
                  text-white

                  shadow-lg
                  shadow-blue-500/20

                  transition-all

                  hover:bg-blue-600

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Sparkles
                  className="
                    h-4
                    w-4
                  "
                />

                Save Student
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };