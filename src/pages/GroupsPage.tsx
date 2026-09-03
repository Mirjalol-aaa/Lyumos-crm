import React, {
  useMemo,
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import type {
  Group,
  Teacher,
} from '../types/crm';

import {
  BookOpen,
  Plus,
  Users,
  Clock,
  MapPin,
  GraduationCap,
  Trash2,
  Pencil,
  X,
  Save,
  Search,
  WalletCards,
  UserRoundCheck,
} from 'lucide-react';


interface GroupEditModalProps {
  group: Group;

  teachers: Teacher[];

  currencySymbol: string;

  onClose: () => void;

  onSave: (
    updated: Partial<Group>
  ) => void;
}


const GroupEditModal:
  React.FC<
    GroupEditModalProps
  > = ({
    group,
    teachers,
    currencySymbol,
    onClose,
    onSave,
  }) => {
    const [
      name,
      setName,
    ] = useState(
      group.name
    );

    const [
      subject,
      setSubject,
    ] = useState(
      group.subject
    );

    const [
      level,
      setLevel,
    ] = useState(
      group.level
    );

    const [
      teacherId,
      setTeacherId,
    ] = useState(
      group.teacherId
    );

    const [
      scheduleDays,
      setScheduleDays,
    ] = useState(
      group.scheduleDays
    );

    const [
      scheduleTime,
      setScheduleTime,
    ] = useState(
      group.scheduleTime
    );

    const [
      room,
      setRoom,
    ] = useState(
      group.room
    );

    const [
      monthlyFee,
      setMonthlyFee,
    ] = useState(
      group.monthlyFee
    );

    const [
      maxCapacity,
      setMaxCapacity,
    ] = useState(
      group.maxCapacity
    );

    const [
      status,
      setStatus,
    ] = useState(
      group.status
    );


    const handleSave = () => {
      if (!name.trim()) {
        return;
      }

      const selectedTeacher =
        teachers.find(
          teacher =>
            teacher.id ===
            teacherId
        );

      onSave({
        name:
          name.trim(),

        subject:
          subject.trim(),

        level:
          level.trim(),

        teacherId,

        teacherName:
          selectedTeacher?.fullName ??
          group.teacherName,

        scheduleDays:
          scheduleDays.trim(),

        scheduleTime:
          scheduleTime.trim(),

        room:
          room.trim(),

        monthlyFee:
          Number(
            monthlyFee
          ),

        maxCapacity:
          Number(
            maxCapacity
          ),

        status,
      });

      onClose();
    };


    const fieldClass = `
      h-11
      w-full
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      px-3.5
      text-sm
      text-slate-900
      outline-none
      transition-all

      focus:border-purple-500/60
      focus:ring-2
      focus:ring-purple-500/10

      dark:border-slate-700
      dark:bg-slate-800
      dark:text-white
    `;


    return (
      <div
        className="
          fixed inset-0
          z-[100]
          flex
          items-end
          justify-center
          bg-slate-950/60
          p-0
          backdrop-blur-[3px]

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
            max-h-[94vh]
            w-full
            flex-col
            overflow-hidden
            rounded-t-3xl
            border
            border-slate-200/70
            bg-white
            shadow-2xl

            dark:border-white/10
            dark:bg-[#0d1628]

            sm:max-w-3xl
            sm:rounded-3xl
          "
          onClick={
            event =>
              event.stopPropagation()
          }
        >
          {/* HEADER */}

          <div
            className="
              relative
              shrink-0
              overflow-hidden
              border-b
              border-slate-200
              px-4 py-4

              dark:border-white/10

              sm:px-6
              sm:py-5
            "
          >
            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-r
                from-purple-600/10
                via-blue-500/5
                to-transparent
              "
            />

            <div
              className="
                relative
                flex
                items-center
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
                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-purple-600
                    to-blue-600
                    text-white
                    shadow-lg
                    shadow-purple-600/20

                    sm:h-12
                    sm:w-12
                    sm:rounded-2xl
                  "
                >
                  <BookOpen
                    className="
                      h-5 w-5

                      sm:h-6
                      sm:w-6
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
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-purple-500

                      sm:text-[10px]
                    "
                  >
                    Group Management
                  </p>

                  <h2
                    className="
                      mt-0.5
                      truncate
                      text-lg
                      font-black
                      text-slate-900

                      dark:text-white

                      sm:text-2xl
                    "
                  >
                    Edit Study Group
                  </h2>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[9px]
                      font-mono
                      text-slate-500

                      sm:text-xs
                    "
                  >
                    {group.id}
                  </p>
                </div>
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
                  bg-slate-100
                  text-slate-400
                  transition-all

                  hover:bg-rose-50
                  hover:text-rose-500

                  dark:bg-white/5
                  dark:hover:bg-rose-500/10
                "
              >
                <X
                  className="
                    h-5 w-5
                  "
                />
              </button>
            </div>
          </div>


          {/* BODY */}

          <div
            className="
              flex-1
              space-y-4
              overflow-y-auto
              px-4 py-5

              sm:space-y-5
              sm:px-6
              sm:py-6
            "
          >
            {/* NAME */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Group Name
              </label>

              <input
                value={
                  name
                }
                onChange={
                  event =>
                    setName(
                      event.target.value
                    )
                }
                className={
                  fieldClass
                }
              />
            </div>


            {/* SUBJECT + LEVEL */}

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
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Subject
                </label>

                <input
                  value={
                    subject
                  }
                  onChange={
                    event =>
                      setSubject(
                        event.target.value
                      )
                  }
                  className={
                    fieldClass
                  }
                />
              </div>


              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Level
                </label>

                <input
                  value={
                    level
                  }
                  onChange={
                    event =>
                      setLevel(
                        event.target.value
                      )
                  }
                  className={
                    fieldClass
                  }
                />
              </div>
            </div>


            {/* TEACHER */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Assigned Teacher
              </label>

              <select
                value={
                  teacherId
                }
                onChange={
                  event =>
                    setTeacherId(
                      event.target.value
                    )
                }
                className={`
                  ${fieldClass}
                  cursor-pointer
                `}
              >
                {teachers.map(
                  teacher => (
                    <option
                      key={
                        teacher.id
                      }
                      value={
                        teacher.id
                      }
                    >
                      {
                        teacher.fullName
                      }
                    </option>
                  )
                )}
              </select>
            </div>


            {/* DAYS + TIME */}

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
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Schedule Days
                </label>

                <input
                  value={
                    scheduleDays
                  }
                  onChange={
                    event =>
                      setScheduleDays(
                        event.target.value
                      )
                  }
                  className={
                    fieldClass
                  }
                />
              </div>


              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Schedule Time
                </label>

                <input
                  value={
                    scheduleTime
                  }
                  onChange={
                    event =>
                      setScheduleTime(
                        event.target.value
                      )
                  }
                  className={
                    fieldClass
                  }
                />
              </div>
            </div>


            {/* ROOM */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Classroom
              </label>

              <input
                value={
                  room
                }
                onChange={
                  event =>
                    setRoom(
                      event.target.value
                    )
                }
                className={
                  fieldClass
                }
              />
            </div>


            {/* FEE + CAPACITY + STATUS */}

            <div
              className="
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2

                lg:grid-cols-3
              "
            >
              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Monthly Fee
                </label>

                <div
                  className="
                    relative
                  "
                >
                  <span
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    {currencySymbol}
                  </span>

                  <input
                    type="number"
                    value={
                      monthlyFee
                    }
                    onChange={
                      event =>
                        setMonthlyFee(
                          Number(
                            event.target.value
                          )
                        )
                    }
                    className={`
                      ${fieldClass}
                      pl-9
                    `}
                  />
                </div>
              </div>


              <div>
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Max Capacity
                </label>

                <input
                  type="number"
                  value={
                    maxCapacity
                  }
                  onChange={
                    event =>
                      setMaxCapacity(
                        Number(
                          event.target.value
                        )
                      )
                  }
                  className={
                    fieldClass
                  }
                />
              </div>


              <div
                className="
                  sm:col-span-2

                  lg:col-span-1
                "
              >
                <label
                  className="
                    mb-1.5
                    block
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Status
                </label>

                <select
                  value={
                    status
                  }
                  onChange={
                    event =>
                      setStatus(
                        event.target
                          .value as Group['status']
                      )
                  }
                  className={`
                    ${fieldClass}
                    cursor-pointer
                  `}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
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
              border-slate-200
              bg-slate-50/80
              p-4

              dark:border-white/10
              dark:bg-white/[0.02]

              sm:flex
              sm:justify-end
              sm:gap-3
              sm:px-6
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
                border
                border-slate-200
                bg-white
                px-4 py-2.5
                text-xs
                font-black
                text-slate-600
                transition-colors

                hover:bg-slate-100

                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-300
                dark:hover:bg-white/10
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
                bg-gradient-to-r
                from-purple-600
                to-blue-600
                px-4 py-2.5
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-purple-600/20
                transition-all

                hover:shadow-xl

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


export const GroupsPage:
  React.FC = () => {
    const {
      groups,
      teachers,

      deleteGroup,
      updateGroup,

      setIsAddGroupModalOpen,

      selectedGroupId,
      setSelectedGroupId,

      settings,
    } = useCRM();


    const [
      search,
      setSearch,
    ] = useState('');


    const selectedGroup =
      groups.find(
        group =>
          group.id ===
          selectedGroupId
      ) ?? null;


    const filteredGroups =
      useMemo(() => {
        const term =
          search
            .trim()
            .toLowerCase();

        if (!term) {
          return groups;
        }

        return groups.filter(
          group =>
            group.name
              .toLowerCase()
              .includes(
                term
              ) ||
            group.subject
              .toLowerCase()
              .includes(
                term
              ) ||
            group.teacherName
              .toLowerCase()
              .includes(
                term
              ) ||
            group.level
              .toLowerCase()
              .includes(
                term
              )
        );
      }, [
        groups,
        search,
      ]);


    const activeGroups =
      groups.filter(
        group =>
          group.status ===
          'Active'
      ).length;


    const totalStudents =
      groups.reduce(
        (
          total,
          group
        ) =>
          total +
          group.currentStudentsCount,
        0
      );


    const totalCapacity =
      groups.reduce(
        (
          total,
          group
        ) =>
          total +
          group.maxCapacity,
        0
      );


    const formatMoney = (
      value: number
    ) => {
      return `${settings.currencySymbol}${Number(
        value || 0
      ).toLocaleString()}`;
    };


    const handleDelete = (
      group: Group
    ) => {
      const confirmed =
        window.confirm(
          `Delete group ${group.name}?`
        );

      if (!confirmed) {
        return;
      }

      deleteGroup(
        group.id
      );
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

        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200/70
            bg-white
            p-5
            shadow-sm

            dark:border-white/10
            dark:bg-[#0d1628]

            sm:rounded-[24px]
            sm:p-6

            lg:p-7
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-72 w-72
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              right-40
              h-40 w-40
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
          />


          <div
            className="
              relative
              flex
              flex-col
              gap-5

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
              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    flex h-9 w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-purple-600
                    to-blue-600
                    text-white
                  "
                >
                  <BookOpen
                    className="
                      h-4 w-4
                    "
                  />
                </span>

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-purple-500

                    sm:text-[10px]
                  "
                >
                  Academic Management
                </span>
              </div>


              <h1
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-slate-900

                  dark:text-white

                  sm:text-3xl
                "
              >
                Study Groups
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-[11px]
                  leading-relaxed
                  text-slate-500

                  sm:text-sm
                "
              >
                Manage cohorts,
                teachers,
                classrooms,
                schedules and
                capacity from one
                place.
              </p>
            </div>


            <button
              type="button"
              onClick={() =>
                setIsAddGroupModalOpen(
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
                bg-gradient-to-r
                from-purple-600
                to-blue-600
                px-5 py-3
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-purple-600/20
                transition-all

                hover:-translate-y-0.5
                hover:shadow-xl

                active:translate-y-0

                sm:w-auto
              "
            >
              <Plus
                className="
                  h-4 w-4
                "
              />

              Create Study Group
            </button>
          </div>
        </section>


        {/* STATS */}

        <section
          className="
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-3
            sm:gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200/70
              bg-white
              p-4
              shadow-sm

              dark:border-white/10
              dark:bg-[#0d1628]

              sm:p-5
            "
          >
            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-purple-50
                text-purple-600

                dark:bg-purple-500/10
              "
            >
              <BookOpen
                className="
                  h-5 w-5
                "
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-slate-500

                  sm:text-xs
                "
              >
                Total Groups
              </p>

              <p
                className="
                  text-xl
                  font-black
                  text-slate-900

                  dark:text-white

                  sm:text-2xl
                "
              >
                {groups.length}
              </p>
            </div>
          </div>


          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200/70
              bg-white
              p-4
              shadow-sm

              dark:border-white/10
              dark:bg-[#0d1628]

              sm:p-5
            "
          >
            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600

                dark:bg-emerald-500/10
              "
            >
              <UserRoundCheck
                className="
                  h-5 w-5
                "
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-slate-500

                  sm:text-xs
                "
              >
                Active Groups
              </p>

              <p
                className="
                  text-xl
                  font-black
                  text-slate-900

                  dark:text-white

                  sm:text-2xl
                "
              >
                {activeGroups}
              </p>
            </div>
          </div>


          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200/70
              bg-white
              p-4
              shadow-sm

              dark:border-white/10
              dark:bg-[#0d1628]

              sm:p-5
            "
          >
            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600

                dark:bg-blue-500/10
              "
            >
              <Users
                className="
                  h-5 w-5
                "
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-slate-500

                  sm:text-xs
                "
              >
                Students / Capacity
              </p>

              <p
                className="
                  text-xl
                  font-black
                  text-slate-900

                  dark:text-white

                  sm:text-2xl
                "
              >
                {totalStudents}

                <span
                  className="
                    ml-1
                    text-xs
                    font-bold
                    text-slate-400

                    sm:text-sm
                  "
                >
                  / {totalCapacity}
                </span>
              </p>
            </div>
          </div>
        </section>


        {/* SEARCH */}

        <section
          className="
            rounded-2xl
            border
            border-slate-200/70
            bg-white
            p-3
            shadow-sm

            dark:border-white/10
            dark:bg-[#0d1628]

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
              value={
                search
              }
              onChange={
                event =>
                  setSearch(
                    event.target.value
                  )
              }
              placeholder="Search groups, teachers, subjects..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10 pr-4
                text-xs
                text-slate-900
                outline-none
                transition-all

                placeholder:text-slate-400

                focus:border-purple-500/60
                focus:ring-2
                focus:ring-purple-500/10

                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-white
              "
            />
          </div>
        </section>


        {/* GROUPS */}

        {filteredGroups.length ===
        0 ? (
          <div
            className="
              flex
              min-h-[260px]
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
              dark:bg-[#0d1628]
            "
          >
            <BookOpen
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
              No groups found
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Try another search.
            </p>
          </div>
        ) : (
          <section
            className="
              grid
              grid-cols-1
              gap-3

              md:grid-cols-2
              md:gap-4

              xl:grid-cols-3
              xl:gap-5
            "
          >
            {filteredGroups.map(
              group => {
                const fillPercentage =
                  group.maxCapacity > 0
                    ? Math.round(
                        (
                          group.currentStudentsCount /
                          group.maxCapacity
                        ) *
                          100
                      )
                    : 0;

                const safePercentage =
                  Math.min(
                    fillPercentage,
                    100
                  );

                const isNearlyFull =
                  fillPercentage >=
                  85;


                return (
                  <article
                    key={
                      group.id
                    }
                    className="
                      group
                      relative
                      min-w-0
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200/80
                      bg-white
                      p-4
                      shadow-sm
                      transition-all

                      hover:-translate-y-0.5
                      hover:border-purple-400/60
                      hover:shadow-lg

                      dark:border-white/10
                      dark:bg-[#0d1628]
                      dark:hover:border-purple-500/40

                      sm:p-5

                      lg:p-6
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-x-0
                        top-0
                        h-[3px]
                        bg-gradient-to-r
                        from-purple-600
                        via-blue-500
                        to-cyan-400
                        opacity-0
                        transition-opacity

                        group-hover:opacity-100
                      "
                    />


                    {/* TOP */}

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
                        "
                      >
                        <div
                          className="
                            mb-2.5
                            flex
                            flex-wrap
                            items-center
                            gap-1.5
                          "
                        >
                          <span
                            className="
                              max-w-full
                              truncate
                              rounded-lg
                              bg-purple-50
                              px-2.5 py-1
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider
                              text-purple-600

                              dark:bg-purple-500/10
                              dark:text-purple-400
                            "
                          >
                            {group.subject}
                          </span>


                          <span
                            className={`
                              rounded-lg
                              px-2.5 py-1
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider

                              ${
                                group.status ===
                                'Active'
                                  ? `
                                    bg-emerald-50
                                    text-emerald-600

                                    dark:bg-emerald-500/10
                                  `
                                  : `
                                    bg-slate-100
                                    text-slate-500

                                    dark:bg-white/5
                                  `
                              }
                            `}
                          >
                            {group.status}
                          </span>
                        </div>


                        <h3
                          className="
                            truncate
                            text-lg
                            font-black
                            text-slate-900
                            transition-colors

                            group-hover:text-purple-600

                            dark:text-white
                            dark:group-hover:text-purple-400

                            sm:text-xl
                          "
                        >
                          {group.name}
                        </h3>

                        <p
                          className="
                            mt-1
                            truncate
                            text-[11px]
                            font-semibold
                            text-slate-400

                            sm:text-xs
                          "
                        >
                          {group.level}
                        </p>
                      </div>


                      <span
                        className="
                          max-w-[100px]
                          shrink-0
                          truncate
                          rounded-lg
                          bg-slate-100
                          px-2 py-1
                          text-[9px]
                          font-black
                          text-slate-500

                          dark:bg-white/5
                        "
                      >
                        {group.id}
                      </span>
                    </div>


                    {/* TEACHER */}

                    <div
                      className="
                        mt-4
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50/90
                        p-3

                        dark:border-white/5
                        dark:bg-white/[0.035]

                        sm:mt-5
                        sm:rounded-2xl
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
                            flex h-9 w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600

                            dark:bg-blue-500/10
                          "
                        >
                          <GraduationCap
                            className="
                              h-4 w-4
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
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider
                              text-slate-400

                              sm:text-[10px]
                            "
                          >
                            Teacher
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              font-black
                              text-slate-800

                              dark:text-white

                              sm:text-sm
                            "
                          >
                            {
                              group.teacherName
                            }
                          </p>
                        </div>
                      </div>
                    </div>


                    {/* DETAILS */}

                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3

                        sm:mt-5
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-2
                        "
                      >
                        <Clock
                          className="
                            mt-0.5
                            h-4 w-4
                            shrink-0
                            text-purple-500
                          "
                        />

                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              truncate
                              text-[10px]
                              font-bold
                              text-slate-700

                              dark:text-slate-300

                              sm:text-xs
                            "
                          >
                            {
                              group.scheduleDays
                            }
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[9px]
                              text-slate-400

                              sm:text-[10px]
                            "
                          >
                            {
                              group.scheduleTime
                            }
                          </p>
                        </div>
                      </div>


                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-2
                        "
                      >
                        <MapPin
                          className="
                            mt-0.5
                            h-4 w-4
                            shrink-0
                            text-purple-500
                          "
                        />

                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              truncate
                              text-[10px]
                              font-bold
                              text-slate-700

                              dark:text-slate-300

                              sm:text-xs
                            "
                          >
                            {group.room}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[9px]
                              text-slate-400

                              sm:text-[10px]
                            "
                          >
                            Classroom
                          </p>
                        </div>
                      </div>
                    </div>


                    {/* CAPACITY */}

                    <div
                      className="
                        mt-5
                      "
                    >
                      <div
                        className="
                          mb-2
                          flex
                          items-end
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider
                              text-slate-400

                              sm:text-[10px]
                            "
                          >
                            Capacity
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              font-black
                              text-slate-900

                              dark:text-white

                              sm:text-sm
                            "
                          >
                            {
                              group.currentStudentsCount
                            }

                            <span
                              className="
                                ml-1
                                font-semibold
                                text-slate-400
                              "
                            >
                              /{' '}
                              {
                                group.maxCapacity
                              }{' '}
                              students
                            </span>
                          </p>
                        </div>

                        <span
                          className={`
                            shrink-0
                            text-xs
                            font-black

                            ${
                              isNearlyFull
                                ? 'text-rose-500'
                                : 'text-purple-600 dark:text-purple-400'
                            }
                          `}
                        >
                          {fillPercentage}%
                        </span>
                      </div>


                      <div
                        className="
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-slate-100

                          dark:bg-white/5
                        "
                      >
                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500

                            ${
                              isNearlyFull
                                ? `
                                  bg-gradient-to-r
                                  from-orange-500
                                  to-rose-500
                                `
                                : `
                                  bg-gradient-to-r
                                  from-purple-600
                                  to-blue-500
                                `
                            }
                          `}
                          style={{
                            width:
                              `${safePercentage}%`,
                          }}
                        />
                      </div>
                    </div>


                    {/* FOOTER */}

                    <div
                      className="
                        mt-5
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-slate-100
                        pt-4

                        dark:border-white/10

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >
                        <div
                          className="
                            flex h-8 w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-50
                            text-emerald-600

                            dark:bg-emerald-500/10
                          "
                        >
                          <WalletCards
                            className="
                              h-4 w-4
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
                              text-[9px]
                              font-black
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Monthly Fee
                          </p>

                          <p
                            className="
                              truncate
                              text-sm
                              font-black
                              text-slate-900

                              dark:text-white

                              sm:text-base
                            "
                          >
                            {formatMoney(
                              group.monthlyFee
                            )}
                          </p>
                        </div>
                      </div>


                      <div
                        className="
                          grid
                          grid-cols-[1fr_auto]
                          gap-2

                          sm:flex
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedGroupId(
                              group.id
                            )
                          }
                          className="
                            flex
                            cursor-pointer
                            items-center
                            justify-center
                            gap-1.5
                            rounded-xl
                            bg-purple-50
                            px-4 py-2.5
                            text-xs
                            font-black
                            text-purple-600
                            transition-all

                            hover:bg-purple-600
                            hover:text-white

                            dark:bg-purple-500/10
                            dark:text-purple-400
                            dark:hover:bg-purple-600
                            dark:hover:text-white
                          "
                        >
                          <Pencil
                            className="
                              h-3.5 w-3.5
                            "
                          />

                          Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              group
                            )
                          }
                          className="
                            flex h-10 w-10
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-xl
                            bg-rose-50
                            text-rose-500
                            transition-all

                            hover:bg-rose-500
                            hover:text-white

                            dark:bg-rose-500/10
                          "
                          title="Delete group"
                        >
                          <Trash2
                            className="
                              h-4 w-4
                            "
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}


        {/* EDIT MODAL */}

        {selectedGroup && (
          <GroupEditModal
            key={
              selectedGroup.id
            }
            group={
              selectedGroup
            }
            teachers={
              teachers
            }
            currencySymbol={
              settings.currencySymbol
            }
            onClose={() =>
              setSelectedGroupId(
                null
              )
            }
            onSave={
              updated =>
                updateGroup(
                  selectedGroup.id,
                  updated
                )
            }
          />
        )}
      </div>
    );
  };