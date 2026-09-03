import React, {
  useMemo,
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import type {
  Teacher,
} from '../types/crm';

import {
  Plus,
  Phone,
  Mail,
  Star,
  Trash2,
  Calendar,
  X,
  Save,
  Search,
  Users,
  DollarSign,
} from 'lucide-react';


interface TeacherDetailsModalProps {
  teacher: Teacher;
  currencySymbol: string;
  onClose: () => void;
  onSave: (
    updated: Partial<Teacher>
  ) => void;
}


const TeacherDetailsModal:
  React.FC<
    TeacherDetailsModalProps
  > = ({
    teacher,
    currencySymbol,
    onClose,
    onSave,
  }) => {
    const [
      fullName,
      setFullName,
    ] = useState(
      teacher.fullName
    );

    const [
      phone,
      setPhone,
    ] = useState(
      teacher.phone
    );

    const [
      email,
      setEmail,
    ] = useState(
      teacher.email
    );

    const [
      subjectsText,
      setSubjectsText,
    ] = useState(
      teacher.subjects.join(', ')
    );

    const [
      baseSalary,
      setBaseSalary,
    ] = useState(
      teacher.baseSalary
    );

    const [
      bonusPerStudent,
      setBonusPerStudent,
    ] = useState(
      teacher.bonusPerStudent
    );

    const [
      schedule,
      setSchedule,
    ] = useState(
      teacher.schedule
    );


    const handleSave = () => {
      const subjects =
        subjectsText
          .split(',')
          .map(
            subject =>
              subject.trim()
          )
          .filter(Boolean);

      onSave({
        fullName:
          fullName.trim(),

        phone:
          phone.trim(),

        email:
          email.trim(),

        subjects,

        baseSalary:
          Number(
            baseSalary
          ),

        bonusPerStudent:
          Number(
            bonusPerStudent
          ),

        schedule:
          schedule.trim(),
      });

      onClose();
    };


    return (
      <div
        className="
          fixed inset-0
          z-[100]
          flex
          items-end
          justify-center
          bg-slate-950/50
          p-0
          backdrop-blur-[2px]

          sm:items-center
          sm:p-4
        "
        onClick={
          onClose
        }
      >
        <div
          className="
            flex
            max-h-[92vh]
            w-full
            flex-col
            overflow-hidden
            rounded-t-3xl
            bg-white
            shadow-2xl

            dark:bg-slate-900

            sm:max-w-2xl
            sm:rounded-3xl
          "
          onClick={
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
              border-slate-200
              px-4
              py-4

              dark:border-slate-800

              sm:px-6
              sm:py-5
            "
          >
            <div
              className="
                min-w-0
              "
            >
              <h2
                className="
                  text-lg
                  font-black
                  text-slate-900

                  dark:text-white

                  sm:text-xl
                "
              >
                Teacher Details
              </h2>

              <p
                className="
                  mt-1
                  truncate
                  text-[10px]
                  font-mono
                  text-slate-500

                  sm:text-xs
                "
              >
                {teacher.id}
              </p>
            </div>


            <button
              type="button"
              onClick={
                onClose
              }
              className="
                flex h-10 w-10
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition-colors

                hover:bg-slate-100
                hover:text-slate-900

                dark:hover:bg-slate-800
                dark:hover:text-white
              "
            >
              <X
                className="
                  h-5 w-5
                "
              />
            </button>
          </div>


          {/* MODAL BODY */}

          <div
            className="
              flex-1
              space-y-4
              overflow-y-auto
              px-4
              py-5

              sm:px-6
            "
          >
            {/* NAME */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Full Name
              </label>

              <input
                value={
                  fullName
                }
                onChange={
                  event =>
                    setFullName(
                      event.target.value
                    )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-900
                  outline-none

                  focus:border-[#007AFF]/50
                  focus:ring-2
                  focus:ring-[#007AFF]/10

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>


            {/* PHONE + EMAIL */}

            <div
              className="
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2
              "
            >
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Phone
                </label>

                <input
                  value={
                    phone
                  }
                  onChange={
                    event =>
                      setPhone(
                        event.target.value
                      )
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    text-slate-900
                    outline-none

                    focus:border-[#007AFF]/50
                    focus:ring-2
                    focus:ring-[#007AFF]/10

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />
              </div>


              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Email
                </label>

                <input
                  value={
                    email
                  }
                  onChange={
                    event =>
                      setEmail(
                        event.target.value
                      )
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    text-slate-900
                    outline-none

                    focus:border-[#007AFF]/50
                    focus:ring-2
                    focus:ring-[#007AFF]/10

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />
              </div>
            </div>


            {/* SUBJECTS */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Subjects
              </label>

              <input
                value={
                  subjectsText
                }
                onChange={
                  event =>
                    setSubjectsText(
                      event.target.value
                    )
                }
                placeholder="English, IELTS, Mathematics"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-900
                  outline-none

                  focus:border-[#007AFF]/50
                  focus:ring-2
                  focus:ring-[#007AFF]/10

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>


            {/* SALARY */}

            <div
              className="
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2
              "
            >
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Base Salary (
                  {currencySymbol})
                </label>

                <input
                  type="number"
                  value={
                    baseSalary
                  }
                  onChange={
                    event =>
                      setBaseSalary(
                        Number(
                          event.target.value
                        )
                      )
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    text-slate-900
                    outline-none

                    focus:border-[#007AFF]/50
                    focus:ring-2
                    focus:ring-[#007AFF]/10

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />
              </div>


              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Bonus Per Student (
                  {currencySymbol})
                </label>

                <input
                  type="number"
                  value={
                    bonusPerStudent
                  }
                  onChange={
                    event =>
                      setBonusPerStudent(
                        Number(
                          event.target.value
                        )
                      )
                  }
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-sm
                    text-slate-900
                    outline-none

                    focus:border-[#007AFF]/50
                    focus:ring-2
                    focus:ring-[#007AFF]/10

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                />
              </div>
            </div>


            {/* SCHEDULE */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Teaching Schedule
              </label>

              <input
                value={
                  schedule
                }
                onChange={
                  event =>
                    setSchedule(
                      event.target.value
                    )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-900
                  outline-none

                  focus:border-[#007AFF]/50
                  focus:ring-2
                  focus:ring-[#007AFF]/10

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>


            {/* STATUS */}

            <div
              className="
                rounded-xl
                bg-slate-50
                p-3
                text-xs
                text-slate-500

                dark:bg-slate-800/60
              "
            >
              Status:{' '}

              <strong
                className="
                  text-slate-900

                  dark:text-white
                "
              >
                {teacher.status}
              </strong>
            </div>
          </div>


          {/* MODAL FOOTER */}

          <div
            className="
              grid
              shrink-0
              grid-cols-2
              gap-2
              border-t
              border-slate-200
              bg-white
              p-4

              dark:border-slate-800
              dark:bg-slate-900

              sm:flex
              sm:justify-end
              sm:gap-3
              sm:px-6
              sm:py-5
            "
          >
            <button
              type="button"
              onClick={
                onClose
              }
              className="
                cursor-pointer
                rounded-xl
                bg-slate-100
                px-5 py-2.5
                text-xs
                font-bold
                text-slate-700

                hover:bg-slate-200

                dark:bg-slate-800
                dark:text-slate-300
                dark:hover:bg-slate-700
              "
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={
                handleSave
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#007AFF]
                px-5 py-2.5
                text-xs
                font-bold
                text-white
                transition-all

                hover:bg-blue-600
                active:scale-[0.98]
              "
            >
              <Save
                className="
                  h-4 w-4
                "
              />

              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };


export const TeachersPage:
  React.FC = () => {
    const {
      teachers,

      deleteTeacher,
      updateTeacher,

      setIsAddTeacherModalOpen,

      selectedTeacherId,
      setSelectedTeacherId,

      settings,
    } = useCRM();


    const [
      term,
      setTerm,
    ] = useState('');


    const filteredTeachers =
      useMemo(() => {
        const normalizedTerm =
          term
            .trim()
            .toLowerCase();

        if (!normalizedTerm) {
          return teachers;
        }

        return teachers.filter(
          teacher =>
            teacher.fullName
              .toLowerCase()
              .includes(
                normalizedTerm
              ) ||
            teacher.phone
              .toLowerCase()
              .includes(
                normalizedTerm
              ) ||
            teacher.email
              .toLowerCase()
              .includes(
                normalizedTerm
              ) ||
            teacher.subjects.some(
              subject =>
                subject
                  .toLowerCase()
                  .includes(
                    normalizedTerm
                  )
            )
        );
      }, [
        teachers,
        term,
      ]);


    const selectedTeacher =
      teachers.find(
        teacher =>
          teacher.id ===
          selectedTeacherId
      ) ?? null;


    const handleDelete = (
      teacher: Teacher
    ) => {
      const confirmed =
        window.confirm(
          `Remove teacher ${teacher.fullName}?`
        );

      if (!confirmed) {
        return;
      }

      deleteTeacher(
        teacher.id
      );
    };


    const formatMoney = (
      value: number
    ) => {
      return `${settings.currencySymbol}${Number(
        value || 0
      ).toLocaleString()}`;
    };


    return (
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
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
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4

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
              Teachers & Faculty
              Roster

              <span
                className="
                  ml-2
                  text-base
                  font-bold
                  text-slate-400

                  sm:text-lg
                "
              >
                ({teachers.length})
              </span>
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
              Manage instructors,
              subject specializations,
              salaries, bonuses and
              schedules.
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              setIsAddTeacherModalOpen(
                true
              )
            }
            className="
              flex w-full
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#007AFF]
              px-5 py-2.5
              text-xs
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition-all

              hover:bg-blue-600
              active:scale-[0.98]

              sm:w-auto
            "
          >
            <Plus
              className="
                h-4 w-4
              "
            />

            Add New Teacher
          </button>
        </div>


        {/* SEARCH */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-3
            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900

            sm:p-4
          "
        >
          <div
            className="
              relative
              w-full

              md:max-w-md
            "
          >
            <Search
              className="
                absolute
                left-3.5
                top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={term}
              onChange={
                event =>
                  setTerm(
                    event.target.value
                  )
              }
              placeholder="Search name, subject, phone or email..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200/80
                bg-slate-50
                pl-10 pr-4
                text-xs
                text-slate-900
                outline-none
                transition-all

                placeholder:text-slate-400

                focus:border-[#007AFF]/40
                focus:ring-2
                focus:ring-[#007AFF]/10

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />
          </div>
        </div>


        {/* EMPTY STATE */}

        {filteredTeachers.length ===
        0 ? (
          <div
            className="
              flex
              min-h-[280px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-4
              text-center

              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <Users
              className="
                h-9 w-9
                text-slate-300
              "
            />

            <p
              className="
                mt-3
                text-sm
                font-bold
                text-slate-700

                dark:text-slate-200
              "
            >
              No teachers found
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Try another search
              term.
            </p>
          </div>
        ) : (
          /* TEACHERS GRID */

          <div
            className="
              grid
              grid-cols-1
              gap-3

              sm:grid-cols-2
              sm:gap-4

              xl:grid-cols-3
              xl:gap-5
            "
          >
            {filteredTeachers.map(
              teacher => {
                const totalEstimatedSalary =
                  teacher.baseSalary +
                  teacher.studentsCount *
                    teacher.bonusPerStudent;

                return (
                  <div
                    key={
                      teacher.id
                    }
                    className="
                      flex
                      min-w-0
                      flex-col
                      rounded-2xl
                      border
                      border-slate-200/60
                      bg-white
                      p-4
                      shadow-sm
                      transition-all

                      hover:-translate-y-0.5
                      hover:shadow-md

                      dark:border-slate-800
                      dark:bg-slate-900

                      sm:p-5

                      lg:p-6
                    "
                  >
                    {/* TEACHER TOP */}

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
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >
                        <img
                          src={
                            teacher.avatar
                          }
                          alt={
                            teacher.fullName
                          }
                          className="
                            h-12 w-12
                            shrink-0
                            rounded-full
                            object-cover
                            ring-2
                            ring-[#007AFF]/10

                            sm:h-14
                            sm:w-14
                          "
                        />

                        <div
                          className="
                            min-w-0
                          "
                        >
                          <h3
                            className="
                              truncate
                              text-sm
                              font-bold
                              text-slate-900

                              dark:text-white

                              sm:text-base
                            "
                          >
                            {teacher.fullName}
                          </h3>

                          <span
                            className="
                              mt-0.5
                              block
                              truncate
                              text-[9px]
                              font-mono
                              text-slate-400

                              sm:text-[10px]
                            "
                          >
                            {teacher.id}
                          </span>
                        </div>
                      </div>


                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                          rounded-full
                          bg-amber-50
                          px-2 py-1
                          text-[10px]
                          font-bold
                          text-amber-600

                          dark:bg-amber-950/40
                          dark:text-amber-400
                        "
                      >
                        <Star
                          className="
                            h-3.5 w-3.5
                            fill-current
                          "
                        />

                        {teacher.rating}
                      </div>
                    </div>


                    {/* SUBJECTS */}

                    <div
                      className="
                        mt-4
                        flex
                        min-h-[30px]
                        flex-wrap
                        gap-1.5
                      "
                    >
                      {teacher.subjects.length >
                      0 ? (
                        teacher.subjects.map(
                          subject => (
                            <span
                              key={
                                subject
                              }
                              className="
                                rounded-lg
                                bg-blue-50
                                px-2.5 py-1
                                text-[9px]
                                font-bold
                                text-[#007AFF]

                                dark:bg-blue-950/40
                                dark:text-blue-300

                                sm:text-[10px]
                              "
                            >
                              {subject}
                            </span>
                          )
                        )
                      ) : (
                        <span
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          No subjects
                        </span>
                      )}
                    </div>


                    {/* CONTACT INFO */}

                    <div
                      className="
                        mt-4
                        space-y-2.5
                        border-y
                        border-slate-100
                        py-4

                        dark:border-slate-800
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2.5
                        "
                      >
                        <Phone
                          className="
                            h-4 w-4
                            shrink-0
                            text-slate-400
                          "
                        />

                        <span
                          className="
                            min-w-0
                            truncate
                            text-[11px]
                            font-medium
                            text-slate-600

                            dark:text-slate-300

                            sm:text-xs
                          "
                        >
                          {teacher.phone}
                        </span>
                      </div>


                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2.5
                        "
                      >
                        <Mail
                          className="
                            h-4 w-4
                            shrink-0
                            text-slate-400
                          "
                        />

                        <span
                          className="
                            min-w-0
                            truncate
                            text-[11px]
                            text-slate-600

                            dark:text-slate-300

                            sm:text-xs
                          "
                        >
                          {teacher.email}
                        </span>
                      </div>


                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-2.5
                        "
                      >
                        <Calendar
                          className="
                            mt-0.5
                            h-4 w-4
                            shrink-0
                            text-slate-400
                          "
                        />

                        <span
                          className="
                            min-w-0
                            text-[11px]
                            leading-relaxed
                            text-slate-600

                            dark:text-slate-300

                            sm:text-xs
                          "
                        >
                          {teacher.schedule}
                        </span>
                      </div>
                    </div>


                    {/* NUMBERS */}

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
                          rounded-xl
                          bg-slate-50
                          p-3

                          dark:bg-slate-800/60
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          <Users
                            className="
                              h-3.5 w-3.5
                            "
                          />

                          Students
                        </div>

                        <p
                          className="
                            mt-1
                            text-base
                            font-black
                            text-slate-900

                            dark:text-white
                          "
                        >
                          {
                            teacher.studentsCount
                          }
                        </p>
                      </div>


                      <div
                        className="
                          min-w-0
                          rounded-xl
                          bg-slate-50
                          p-3

                          dark:bg-slate-800/60
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          <DollarSign
                            className="
                              h-3.5 w-3.5
                            "
                          />

                          Est. Salary
                        </div>

                        <p
                          className="
                            mt-1
                            truncate
                            text-sm
                            font-black
                            text-slate-900

                            dark:text-white
                          "
                        >
                          {formatMoney(
                            totalEstimatedSalary
                          )}
                        </p>
                      </div>
                    </div>


                    {/* ACTIONS */}

                    <div
                      className="
                        mt-auto
                        flex
                        items-center
                        gap-2
                        pt-4
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTeacherId(
                            teacher.id
                          )
                        }
                        className="
                          flex-1
                          cursor-pointer
                          rounded-xl
                          bg-slate-100
                          px-3 py-2.5
                          text-xs
                          font-bold
                          text-[#007AFF]
                          transition-colors

                          hover:bg-slate-200

                          dark:bg-slate-800
                          dark:hover:bg-slate-700
                        "
                      >
                        View Details
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            teacher
                          )
                        }
                        className="
                          flex h-10 w-10
                          shrink-0
                          cursor-pointer
                          items-center
                          justify-center
                          rounded-xl
                          text-rose-500
                          transition-colors

                          hover:bg-rose-50

                          dark:hover:bg-rose-950/50
                        "
                        title="Delete teacher"
                      >
                        <Trash2
                          className="
                            h-4 w-4
                          "
                        />
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}


        {/* DETAILS MODAL */}

        {selectedTeacher && (
          <TeacherDetailsModal
            key={
              selectedTeacher.id
            }
            teacher={
              selectedTeacher
            }
            currencySymbol={
              settings.currencySymbol
            }
            onClose={() =>
              setSelectedTeacherId(
                null
              )
            }
            onSave={
              updated =>
                updateTeacher(
                  selectedTeacher.id,
                  updated
                )
            }
          />
        )}
      </div>
    );
  }