import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';


export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';


export interface ToastPayload {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}


interface ActiveToast
  extends ToastPayload {
  id: number;
}


const TOAST_EVENT =
  'lumos:toast';


export const showToast = (
  payload: ToastPayload
) => {
  if (
    typeof window ===
    'undefined'
  ) {
    return;
  }


  window.dispatchEvent(
    new CustomEvent(
      TOAST_EVENT,
      {
        detail: payload,
      }
    )
  );
};


export const Toast:
  React.FC = () => {
    const [
      toast,
      setToast,
    ] = useState<
      ActiveToast | null
    >(null);


    const [
      visible,
      setVisible,
    ] = useState(false);


    const hideTimer =
      useRef<
        ReturnType<
          typeof setTimeout
        > | null
      >(null);


    const removeTimer =
      useRef<
        ReturnType<
          typeof setTimeout
        > | null
      >(null);


    const clearTimers = () => {
      if (
        hideTimer.current
      ) {
        clearTimeout(
          hideTimer.current
        );

        hideTimer.current =
          null;
      }


      if (
        removeTimer.current
      ) {
        clearTimeout(
          removeTimer.current
        );

        removeTimer.current =
          null;
      }
    };


    const closeToast = () => {
      clearTimers();

      setVisible(false);


      removeTimer.current =
        setTimeout(
          () => {
            setToast(null);
          },
          250
        );
    };


    useEffect(() => {
      const handleToast = (
        event: Event
      ) => {
        const customEvent =
          event as CustomEvent<ToastPayload>;


        const payload =
          customEvent.detail;


        if (
          !payload?.title
        ) {
          return;
        }


        clearTimers();


        setToast({
          id: Date.now(),

          type:
            payload.type ??
            'success',

          title:
            payload.title,

          message:
            payload.message,

          duration:
            payload.duration ??
            3000,
        });


        setVisible(false);


        requestAnimationFrame(
          () => {
            requestAnimationFrame(
              () => {
                setVisible(
                  true
                );
              }
            );
          }
        );


        hideTimer.current =
          setTimeout(
            () => {
              setVisible(
                false
              );


              removeTimer.current =
                setTimeout(
                  () => {
                    setToast(
                      null
                    );
                  },
                  250
                );
            },

            payload.duration ??
              3000
          );
      };


      window.addEventListener(
        TOAST_EVENT,
        handleToast
      );


      return () => {
        window.removeEventListener(
          TOAST_EVENT,
          handleToast
        );

        clearTimers();
      };
    }, []);


    if (!toast) {
      return null;
    }


    const type =
      toast.type ??
      'success';


    const styles = {
      success: {
        wrapper:
          'border-emerald-200 bg-white dark:border-emerald-900/60 dark:bg-slate-900',

        iconBox:
          'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',

        progress:
          'bg-emerald-500',
      },

      error: {
        wrapper:
          'border-rose-200 bg-white dark:border-rose-900/60 dark:bg-slate-900',

        iconBox:
          'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',

        progress:
          'bg-rose-500',
      },

      warning: {
        wrapper:
          'border-amber-200 bg-white dark:border-amber-900/60 dark:bg-slate-900',

        iconBox:
          'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',

        progress:
          'bg-amber-500',
      },

      info: {
        wrapper:
          'border-blue-200 bg-white dark:border-blue-900/60 dark:bg-slate-900',

        iconBox:
          'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',

        progress:
          'bg-blue-500',
      },
    } as const;


    const currentStyle =
      styles[type];


    const Icon =
      type === 'success'
        ? CheckCircle2
        : type === 'error'
        ? XCircle
        : type === 'warning'
        ? AlertTriangle
        : Info;


    return (
      <div
        className="
          pointer-events-none
          fixed
          inset-x-3
          bottom-4
          z-[9999]

          flex
          justify-center

          sm:inset-x-auto
          sm:bottom-5
          sm:right-5
          sm:justify-end
        "
      >
        <div
          className={`
            pointer-events-auto
            relative
            w-full
            overflow-hidden

            rounded-2xl
            border

            shadow-2xl
            shadow-slate-900/10

            transition-all
            duration-300
            ease-out

            sm:w-[360px]

            ${currentStyle.wrapper}

            ${
              visible
                ? `
                  translate-y-0
                  scale-100
                  opacity-100
                `
                : `
                  translate-y-4
                  scale-[0.97]
                  opacity-0

                  sm:translate-y-2
                `
            }
          `}
        >
          <div
            className="
              flex
              items-start
              gap-3

              px-4
              py-4
            "
          >
            <div
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                ${currentStyle.iconBox}
              `}
            >
              <Icon
                className="
                  h-5
                  w-5
                "
              />
            </div>


            <div
              className="
                min-w-0
                flex-1
                pt-0.5
              "
            >
              <p
                className="
                  text-sm
                  font-black
                  text-slate-900

                  dark:text-white
                "
              >
                {toast.title}
              </p>


              {toast.message && (
                <p
                  className="
                    mt-1
                    text-[11px]
                    leading-relaxed
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  {toast.message}
                </p>
              )}
            </div>


            <button
              type="button"
              onClick={
                closeToast
              }
              className="
                flex
                h-8
                w-8
                shrink-0
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
              aria-label="Close notification"
            >
              <X
                className="
                  h-4
                  w-4
                "
              />
            </button>
          </div>


          <div
            className="
              h-1
              w-full
              bg-slate-100

              dark:bg-slate-800
            "
          >
            <div
              key={
                toast.id
              }
              className={`
                h-full
                w-full

                origin-left

                ${currentStyle.progress}
              `}
              style={{
                animation:
                  `lumos-toast-progress ${
                    toast.duration ??
                    3000
                  }ms linear forwards`,
              }}
            />
          </div>


          <style>
            {`
              @keyframes lumos-toast-progress {
                from {
                  transform: scaleX(1);
                }

                to {
                  transform: scaleX(0);
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  };