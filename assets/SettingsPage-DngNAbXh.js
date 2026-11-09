import{c as o,d as Be,j as e,C as g,P as Ee,a0 as J,M as Ie,_ as V,a9 as qe,h as C,R as c,$ as Fe,K as Z,t as A,e as De,v as Pe,ae as $e,af as Re,ag as Ue,f as _e,s as Le,ah as Ye}from"./index-ogCbkc4q.js";import{b as a}from"./vendor-charts-DNtThECR.js";import{C as W}from"./circle-question-mark-BL0KOjt9.js";import{K as Oe}from"./key-round-DcUuq6Oo.js";import"./vendor-export-bL1p6LmG.js";import"./vendor-supabase-BLTfs_0E.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["circle",{cx:"12",cy:"13",r:"8",key:"3y4lt7"}],["path",{d:"M12 9v4l2 2",key:"1c63tq"}],["path",{d:"M5 3 2 6",key:"18tl5t"}],["path",{d:"m22 6-3-3",key:"1opdir"}],["path",{d:"M6.38 18.7 4 21",key:"17xu3x"}],["path",{d:"M17.64 18.67 20 21",key:"kv2oe2"}]],Ge=o("alarm-clock",Ke);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}]],ee=o("bell-ring",Xe);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]],se=o("bot",He);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3",key:"cabbwy"}],["rect",{x:"4",y:"2",width:"16",height:"20",rx:"2",key:"1uxh74"}]],ae=o("building",Qe);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}],["path",{d:"M7 11h10",key:"1twpyw"}],["path",{d:"M7 15h6",key:"d9of3u"}],["path",{d:"M7 7h8",key:"af5zfr"}]],Ve=o("message-square-text",Je),ns=()=>{const{settings:t,updateSettings:re}=Be(),[x,te]=a.useState(t.centerName),[z,ne]=a.useState(t.tagline),[T,le]=a.useState(t.phone),[M,ie]=a.useState(t.email),[B,de]=a.useState(t.address),[m,ce]=a.useState(t.currency),[E,oe]=a.useState(t.academicYear),[I,xe]=a.useState(t.enableSmsNotifications),[q,me]=a.useState(t.autoRemindUnpaid),[i,he]=a.useState(t.telegramBotToken||""),[d,F]=a.useState(t.telegramChatId||""),[D,ue]=a.useState(t.enableTelegramAttendance??!0),[P,pe]=a.useState(t.enableTelegramPayments??!0),[b,$]=a.useState(!1),[h,r]=a.useState(null),[R,ge]=a.useState(!1),[j,be]=a.useState(t.eskizEmail||""),[k,je]=a.useState(t.eskizPassword||""),[y,ke]=a.useState(t.eskizToken||""),[U,ye]=a.useState(t.eskizFrom||"4546"),[_,fe]=a.useState(t.enableSmsAttendance??!0),[L,ve]=a.useState(t.enableSmsPayments??!0),[f,Y]=a.useState(!1),[Ne,Ze]=a.useState(""),[u,p]=a.useState(null),[O,we]=a.useState(!1),[v,K]=a.useState(!1),Se=async()=>{if(!i.trim()){r({success:!1,message:"Iltimos, avval Telegram Bot Tokenini kiriting."});return}$(!0),r(null);try{const s=await Re(i,d);s.success?r({success:!0,message:`Muvaffaqiyatli! Bot (${s.botName||"LumosBot"}) ulandi va sinov xabari yuborildi.`}):r({success:!1,message:s.error||"Ulanishda xatolik yuz berdi."})}catch(s){r({success:!1,message:s.message||"Xatolik yuz berdi."})}finally{$(!1)}},[N,G]=a.useState(!1),[w,X]=a.useState(!1),Ce=async()=>{if(!i.trim()||!d.trim()){r({success:!1,message:"Iltimos, avval Bot Token va Chat ID ni kiriting."});return}G(!0),r(null);try{const s=await Ue(i,d,x);s.success?r({success:!0,message:"Bot menyu tugmalari (Jadval, To‘lov, Davomat, Manzil) muvaffaqiyatli o‘rnatildi! ✅"}):r({success:!1,message:s.error||"Menyuni sozlashda xatolik yuz berdi."})}catch(s){r({success:!1,message:s.message||"Xatolik yuz berdi."})}finally{G(!1)}},Ae=async()=>{if(!i.trim()||!d.trim()){r({success:!1,message:"Iltimos, avval Bot Token va Chat ID ni kiriting."});return}X(!0),r(null);try{const s=_e({fullName:"Rustam Karimov (Sinov O‘quvchi)",phone:"+998 (90) 123-45-67",subject:"Ingliz tili (IELTS)",source:"LUMOS Rasmiy Sayti (Sinov)",centerName:x||"LUMOS Academy"}),Q=await Le(i,d,s);Q.success?r({success:!0,message:"Sinov arizasi muvaffaqiyatli yuborildi! Guruh yoki kanalingizni tekshiring. 🔥"}):r({success:!1,message:Q.error||"Ariza yuborishda xatolik yuz berdi."})}catch(s){r({success:!1,message:s.message||"Xatolik yuz berdi."})}finally{X(!1)}},[S,H]=a.useState(!1),ze=async()=>{if(!i.trim()){r({success:!1,message:'Iltimos, avval yuqoridagi "Telegram Bot Token" maydonini to‘ldiring.'});return}H(!0),r(null);try{const s=await $e(i);s.success&&s.chatId?(F(s.chatId),r({success:!0,message:`Chat topildi: "${s.chatTitle}" (${s.chatType})! Chat ID avtomatik joylandi: ${s.chatId} ✅ (Endi "1. Ulanishni Sinash" tugmasini bosing)`})):r({success:!1,message:s.error||"Chat ID aniqlanmadi."})}catch(s){r({success:!1,message:s.message||"Xatolik yuz berdi."})}finally{H(!1)}},Te=async()=>{Y(!0),p(null);try{const s=await Ye(j,k,y,Ne);s.success?p({success:!0,message:s.message||"Eskiz SMS Gateway muvaffaqiyatli ulandi!",remainingLimit:s.remainingLimit}):p({success:!1,message:s.error||"Eskiz SMS Gateway ulanishida xatolik yuz berdi."})}catch(s){p({success:!1,message:s.message||"Xatolik yuz berdi."})}finally{Y(!1)}},Me=s=>{s.preventDefault(),re({centerName:x,tagline:z,phone:T,email:M,address:B,currency:m,currencySymbol:m==="USD"?"$":m==="UZS"?"so‘m":"€",academicYear:E,enableSmsNotifications:I,autoRemindUnpaid:q,telegramBotToken:i,telegramChatId:d,enableTelegramAttendance:D,enableTelegramPayments:P,eskizEmail:j,eskizPassword:k,eskizToken:y,eskizFrom:U,enableSmsAttendance:_,enableSmsPayments:L}),K(!0),window.setTimeout(()=>{K(!1)},3e3)},n=`
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

      focus:border-[#5A0B1C]
      focus:bg-white
      focus:ring-2
      focus:ring-[#5A0B1C]/15

      dark:border-slate-700
      dark:bg-slate-800
      dark:text-white
      dark:focus:border-[#5A0B1C]
      dark:focus:bg-slate-800
    `,l=`
      mb-1.5
      block
      text-[10px]
      font-bold
      uppercase
      tracking-wider
      text-slate-500
    `;return e.jsxs("div",{className:`\r
          mx-auto\r
          w-full\r
          max-w-5xl\r
          space-y-4\r
          px-3\r
          py-4\r
\r
          sm:space-y-5\r
          sm:px-5\r
          sm:py-5\r
\r
          lg:space-y-6\r
          lg:px-6\r
          lg:py-6\r
\r
          xl:px-8\r
          xl:py-8\r
        `,children:[e.jsx("div",{className:`\r
            flex\r
            flex-col\r
            gap-3\r
\r
            sm:flex-row\r
            sm:items-center\r
            sm:justify-between\r
          `,children:e.jsxs("div",{className:"min-w-0",children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight",children:"Sozlamalar"}),e.jsx("p",{className:"text-xs sm:text-sm text-slate-500 mt-1",children:"Lumos CRM tizimi sozlamalari"})]})}),v&&e.jsxs("div",{className:`\r
              fixed\r
              bottom-4\r
              left-4\r
              right-4\r
              z-[200]\r
\r
              flex\r
              items-center\r
              gap-3\r
\r
              rounded-2xl\r
              border\r
              border-emerald-500/30\r
              bg-emerald-600\r
              px-4\r
              py-3\r
\r
              text-xs\r
              font-bold\r
              text-white\r
\r
              shadow-2xl\r
              shadow-emerald-600/30\r
\r
              animate-in\r
              fade-in\r
              slide-in-from-bottom-4\r
              duration-300\r
\r
              sm:left-auto\r
              sm:right-5\r
              sm:w-auto\r
              sm:min-w-[300px]\r
            `,children:[e.jsx("div",{className:`\r
                flex\r
                h-10\r
                w-10\r
                shrink-0\r
                items-center\r
                justify-center\r
                rounded-xl\r
                bg-white/20\r
              `,children:e.jsx(g,{className:`\r
                  h-5\r
                  w-5\r
                `})}),e.jsxs("div",{className:`\r
                min-w-0\r
              `,children:[e.jsx("p",{className:`\r
                  font-black\r
                  text-white\r
                `,children:"Settings Saved!"}),e.jsx("p",{className:`\r
                  mt-0.5\r
                  text-[10px]\r
                  font-medium\r
                  text-emerald-50\r
                `,children:"Your changes have been saved successfully."})]})]}),e.jsxs("form",{onSubmit:Me,className:`\r
            space-y-4\r
\r
            sm:space-y-5\r
\r
            lg:space-y-6\r
          `,children:[e.jsxs("section",{className:`\r
              overflow-hidden\r
              rounded-2xl\r
              border\r
              border-slate-200/60\r
              bg-white\r
              shadow-sm\r
\r
              dark:border-slate-800\r
              dark:bg-slate-900\r
            `,children:[e.jsx("div",{className:`\r
                border-b\r
                border-slate-100\r
                px-4\r
                py-4\r
\r
                dark:border-slate-800\r
\r
                sm:px-5\r
\r
                lg:px-6\r
              `,children:e.jsxs("div",{className:`\r
                  flex\r
                  items-center\r
                  gap-3\r
                `,children:[e.jsx("div",{className:`\r
                    flex\r
                    h-10\r
                    w-10\r
                    shrink-0\r
                    items-center\r
                    justify-center\r
                    rounded-xl\r
                    bg-[#FAF0F2]\r
                    text-[#5A0B1C]\r
\r
                    dark:bg-[#5A0B1C]/20\r
                    dark:text-[#D9A62E]\r
                  `,children:e.jsx(ae,{className:`\r
                      h-5\r
                      w-5\r
                    `})}),e.jsxs("div",{children:[e.jsx("h2",{className:`\r
                      text-sm\r
                      font-bold\r
                      text-slate-900\r
\r
                      dark:text-white\r
                    `,children:"Education Center Identity"}),e.jsx("p",{className:`\r
                      mt-0.5\r
                      text-[10px]\r
                      text-slate-400\r
\r
                      sm:text-[11px]\r
                    `,children:"Main information displayed across the CRM."})]})]})}),e.jsx("div",{className:`\r
                p-4\r
\r
                sm:p-5\r
\r
                lg:p-6\r
              `,children:e.jsxs("div",{className:`\r
                  grid\r
                  grid-cols-1\r
                  gap-4\r
\r
                  sm:grid-cols-2\r
                `,children:[e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Center Name"}),e.jsxs("div",{className:`\r
                      relative\r
                    `,children:[e.jsx(ae,{className:`\r
                        absolute\r
                        left-3.5\r
                        top-1/2\r
                        h-4\r
                        w-4\r
                        -translate-y-1/2\r
                        text-slate-400\r
                      `}),e.jsx("input",{type:"text",value:x,onChange:s=>te(s.target.value),className:`
                        ${n}

                        pl-10
                      `,placeholder:"Education center name"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Tagline"}),e.jsx("input",{type:"text",value:z,onChange:s=>ne(s.target.value),className:n,placeholder:"Center tagline"})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Contact Phone"}),e.jsxs("div",{className:`\r
                      relative\r
                    `,children:[e.jsx(Ee,{className:`\r
                        absolute\r
                        left-3.5\r
                        top-1/2\r
                        h-4\r
                        w-4\r
                        -translate-y-1/2\r
                        text-slate-400\r
                      `}),e.jsx("input",{type:"text",value:T,onChange:s=>le(s.target.value),className:`
                        ${n}

                        pl-10
                      `,placeholder:"+998..."})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Official Email"}),e.jsxs("div",{className:`\r
                      relative\r
                    `,children:[e.jsx(J,{className:`\r
                        absolute\r
                        left-3.5\r
                        top-1/2\r
                        h-4\r
                        w-4\r
                        -translate-y-1/2\r
                        text-slate-400\r
                      `}),e.jsx("input",{type:"email",value:M,onChange:s=>ie(s.target.value),className:`
                        ${n}

                        pl-10
                      `,placeholder:"center@email.com"})]})]}),e.jsxs("div",{className:`\r
                    sm:col-span-2\r
                  `,children:[e.jsx("label",{className:l,children:"Campus Address"}),e.jsxs("div",{className:`\r
                      relative\r
                    `,children:[e.jsx(Ie,{className:`\r
                        absolute\r
                        left-3.5\r
                        top-1/2\r
                        h-4\r
                        w-4\r
                        -translate-y-1/2\r
                        text-slate-400\r
                      `}),e.jsx("input",{type:"text",value:B,onChange:s=>de(s.target.value),className:`
                        ${n}

                        pl-10
                      `,placeholder:"Center address"})]})]})]})})]}),e.jsxs("section",{className:`\r
              overflow-hidden\r
              rounded-2xl\r
              border\r
              border-slate-200/60\r
              bg-white\r
              shadow-sm\r
\r
              dark:border-slate-800\r
              dark:bg-slate-900\r
            `,children:[e.jsx("div",{className:`\r
                border-b\r
                border-slate-100\r
                px-4\r
                py-4\r
\r
                dark:border-slate-800\r
\r
                sm:px-5\r
\r
                lg:px-6\r
              `,children:e.jsxs("div",{className:`\r
                  flex\r
                  items-center\r
                  gap-3\r
                `,children:[e.jsx("div",{className:`\r
                    flex\r
                    h-10\r
                    w-10\r
                    shrink-0\r
                    items-center\r
                    justify-center\r
                    rounded-xl\r
                    bg-emerald-50\r
                    text-emerald-600\r
\r
                    dark:bg-emerald-950/40\r
                  `,children:e.jsx(V,{className:`\r
                      h-5\r
                      w-5\r
                    `})}),e.jsxs("div",{children:[e.jsx("h2",{className:`\r
                      text-sm\r
                      font-bold\r
                      text-slate-900\r
\r
                      dark:text-white\r
                    `,children:"Financial & Academic Rules"}),e.jsx("p",{className:`\r
                      mt-0.5\r
                      text-[10px]\r
                      text-slate-400\r
\r
                      sm:text-[11px]\r
                    `,children:"Configure currency and academic year."})]})]})}),e.jsx("div",{className:`\r
                p-4\r
\r
                sm:p-5\r
\r
                lg:p-6\r
              `,children:e.jsxs("div",{className:`\r
                  grid\r
                  grid-cols-1\r
                  gap-4\r
\r
                  sm:grid-cols-2\r
                `,children:[e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Primary Currency"}),e.jsxs("div",{className:`\r
                      relative\r
                    `,children:[e.jsx(V,{className:`\r
                        pointer-events-none\r
                        absolute\r
                        left-3.5\r
                        top-1/2\r
                        h-4\r
                        w-4\r
                        -translate-y-1/2\r
                        text-slate-400\r
                      `}),e.jsxs("select",{value:m,onChange:s=>ce(s.target.value),className:`
                        ${n}

                        cursor-pointer
                        pl-10
                        font-bold
                      `,children:[e.jsx("option",{value:"USD",children:"USD ($)"}),e.jsx("option",{value:"UZS",children:"UZS (So'm)"}),e.jsx("option",{value:"EUR",children:"EUR (€)"})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Academic Year Period"}),e.jsxs("div",{className:`\r
                      relative\r
                    `,children:[e.jsx(qe,{className:`\r
                        absolute\r
                        left-3.5\r
                        top-1/2\r
                        h-4\r
                        w-4\r
                        -translate-y-1/2\r
                        text-slate-400\r
                      `}),e.jsx("input",{type:"text",value:E,onChange:s=>oe(s.target.value),className:`
                        ${n}

                        pl-10
                      `,placeholder:"2026–2027"})]})]})]})})]}),e.jsxs("section",{className:`\r
              overflow-hidden\r
              rounded-2xl\r
              border\r
              border-slate-200/60\r
              bg-white\r
              shadow-sm\r
\r
              dark:border-slate-800\r
              dark:bg-slate-900\r
            `,children:[e.jsx("div",{className:`\r
                border-b\r
                border-slate-100\r
                px-4\r
                py-4\r
\r
                dark:border-slate-800\r
\r
                sm:px-5\r
\r
                lg:px-6\r
              `,children:e.jsxs("div",{className:`\r
                  flex\r
                  items-center\r
                  gap-3\r
                `,children:[e.jsx("div",{className:`\r
                    flex\r
                    h-10\r
                    w-10\r
                    shrink-0\r
                    items-center\r
                    justify-center\r
                    rounded-xl\r
                    bg-amber-50\r
                    text-amber-600\r
\r
                    dark:bg-amber-950/40\r
                  `,children:e.jsx(ee,{className:`\r
                      h-5\r
                      w-5\r
                    `})}),e.jsxs("div",{children:[e.jsx("h2",{className:`\r
                      text-sm\r
                      font-bold\r
                      text-slate-900\r
\r
                      dark:text-white\r
                    `,children:"Parent Notification Automations"}),e.jsx("p",{className:`\r
                      mt-0.5\r
                      text-[10px]\r
                      text-slate-400\r
\r
                      sm:text-[11px]\r
                    `,children:"Configure payment notifications and reminder preferences."})]})]})}),e.jsxs("div",{className:`\r
                space-y-3\r
                p-4\r
\r
                sm:p-5\r
\r
                lg:p-6\r
              `,children:[e.jsxs("label",{className:`\r
                  flex\r
                  cursor-pointer\r
                  items-center\r
                  justify-between\r
                  gap-4\r
                  rounded-2xl\r
                  border\r
                  border-transparent\r
                  bg-slate-50\r
                  p-3\r
                  transition-all\r
\r
                  hover:border-[#F0D5DC]\r
                  hover:bg-[#FAF0F2]/50\r
\r
                  dark:bg-slate-800/50\r
                  dark:hover:border-[#5A0B1C]/40\r
                  dark:hover:bg-[#5A0B1C]/15\r
\r
                  sm:p-4\r
                `,children:[e.jsxs("div",{className:`\r
                    flex\r
                    min-w-0\r
                    items-center\r
                    gap-3\r
                  `,children:[e.jsx("div",{className:`\r
                      flex\r
                      h-9\r
                      w-9\r
                      shrink-0\r
                      items-center\r
                      justify-center\r
                      rounded-xl\r
                      bg-[#FAF0F2]\r
                      text-[#5A0B1C]\r
\r
                      dark:bg-[#5A0B1C]/20\r
                      dark:text-[#D9A62E]\r
                    `,children:e.jsx(Ve,{className:`\r
                        h-4\r
                        w-4\r
                      `})}),e.jsxs("div",{className:`\r
                      min-w-0\r
                    `,children:[e.jsx("p",{className:`\r
                        text-[11px]\r
                        font-bold\r
                        leading-relaxed\r
                        text-slate-800\r
\r
                        dark:text-white\r
\r
                        sm:text-xs\r
                      `,children:"Enable Parent SMS Payment Notifications"}),e.jsx("p",{className:`\r
                        mt-0.5\r
                        text-[9px]\r
                        leading-relaxed\r
                        text-slate-400\r
\r
                        sm:text-[10px]\r
                      `,children:"Allow payment notification automation."})]})]}),e.jsx("input",{type:"checkbox",checked:I,onChange:s=>xe(s.target.checked),className:`\r
                    h-5\r
                    w-5\r
                    shrink-0\r
                    cursor-pointer\r
                    accent-[#5A0B1C]\r
                  `})]}),e.jsxs("label",{className:`\r
                  flex\r
                  cursor-pointer\r
                  items-center\r
                  justify-between\r
                  gap-4\r
                  rounded-2xl\r
                  border\r
                  border-transparent\r
                  bg-slate-50\r
                  p-3\r
                  transition-all\r
\r
                  hover:border-amber-200\r
                  hover:bg-amber-50/50\r
\r
                  dark:bg-slate-800/50\r
                  dark:hover:border-amber-900\r
                  dark:hover:bg-amber-950/20\r
\r
                  sm:p-4\r
                `,children:[e.jsxs("div",{className:`\r
                    flex\r
                    min-w-0\r
                    items-center\r
                    gap-3\r
                  `,children:[e.jsx("div",{className:`\r
                      flex\r
                      h-9\r
                      w-9\r
                      shrink-0\r
                      items-center\r
                      justify-center\r
                      rounded-xl\r
                      bg-amber-100\r
                      text-amber-600\r
\r
                      dark:bg-amber-950/50\r
                      dark:text-amber-400\r
                    `,children:e.jsx(Ge,{className:`\r
                        h-4\r
                        w-4\r
                      `})}),e.jsxs("div",{className:`\r
                      min-w-0\r
                    `,children:[e.jsx("p",{className:`\r
                        text-[11px]\r
                        font-bold\r
                        leading-relaxed\r
                        text-slate-800\r
\r
                        dark:text-white\r
\r
                        sm:text-xs\r
                      `,children:"Auto-Send Fee Overdue Reminders on 5th of Month"}),e.jsx("p",{className:`\r
                        mt-0.5\r
                        text-[9px]\r
                        leading-relaxed\r
                        text-slate-400\r
\r
                        sm:text-[10px]\r
                      `,children:"Enable automatic overdue payment reminder preference."})]})]}),e.jsx("input",{type:"checkbox",checked:q,onChange:s=>me(s.target.checked),className:`\r
                    h-5\r
                    w-5\r
                    shrink-0\r
                    cursor-pointer\r
                    accent-[#5A0B1C]\r
                  `})]}),e.jsxs("div",{className:"mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF0F2] text-[#5A0B1C] dark:bg-[#5A0B1C]/20 dark:text-[#D9A62E]",children:e.jsx(C,{className:"h-4 w-4"})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",children:[e.jsx("span",{children:"Telegram Bot Integratsiyasi"}),e.jsx("span",{className:"rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400",children:"Bepul"})]}),e.jsx("p",{className:"text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400",children:"To‘lov cheklari va yo‘qlama xabarnomalarini ota-onalarga bot orqali yuborish"})]})]}),e.jsxs("button",{type:"button",onClick:()=>ge(!R),className:"flex items-center gap-1 text-[11px] font-bold text-[#5A0B1C] hover:text-[#450815] dark:text-[#D9A62E] cursor-pointer self-start sm:self-auto",children:[e.jsx(W,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Qanday ulanadi?"})]})]}),R&&e.jsxs("div",{className:"p-4 rounded-2xl bg-[#FAF0F2]/60 dark:bg-slate-900/60 border border-[#5A0B1C]/15 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300 animate-in fade-in duration-200",children:[e.jsx("p",{className:"font-bold text-[#5A0B1C] dark:text-[#D9A62E]",children:"Telegram botni ulash bo‘yicha 3 ta oson qadam:"}),e.jsxs("ol",{className:"list-decimal list-inside space-y-1 text-[11px] leading-relaxed",children:[e.jsxs("li",{children:["Telegramda ",e.jsx("a",{href:"https://t.me/BotFather",target:"_blank",rel:"noreferrer",className:"font-bold text-[#5A0B1C] dark:text-[#D9A62E] underline",children:"@BotFather"})," ga kiring va ",e.jsx("code",{children:"/newbot"})," buyrug‘ini bering."]}),e.jsxs("li",{children:["Botingizga nom va username bering, berilgan ",e.jsx("b",{children:"API Token"})," ni quyidagi birinchi qatorga nusxalang."]}),e.jsxs("li",{children:["Botingizni markaz guruhiga yoki kanalingizga ",e.jsx("b",{children:"Admin"})," qilib qo‘shing va kanal/guruh ID sini (masalan ",e.jsx("code",{children:"@lumos_crm_alerts"})," yoki ",e.jsx("code",{children:"-100..."}),") ikkinchi qatorga yozing."]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Telegram Bot Token"}),e.jsxs("div",{className:"relative",children:[e.jsx(se,{className:"absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"text",value:i,onChange:s=>he(s.target.value),placeholder:"123456789:ABCdefGHIjkl...",className:`${n} pl-10 font-mono text-xs`})]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("label",{className:l,children:"Telegram Chat ID / Kanal ID"}),e.jsxs("button",{type:"button",onClick:ze,disabled:S,className:"text-[10px] font-bold text-[#5A0B1C] dark:text-[#D9A62E] hover:text-[#450815] dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors",title:"Botga yozilgan oxirgi xabardan Chat ID ni avtomatik topish",children:[S?e.jsx(c,{className:"h-3 w-3 animate-spin"}):e.jsx(Fe,{className:"h-3 w-3"}),e.jsx("span",{children:S?"Qidirilmoqda...":"🔍 Avtomatik topish"})]})]}),e.jsxs("div",{className:"relative",children:[e.jsx(C,{className:"absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"text",value:d,onChange:s=>F(s.target.value),placeholder:"@lumos_channel yoki -100123456789",className:`${n} pl-10 font-mono text-xs`})]}),e.jsxs("p",{className:"mt-1 text-[10px] text-slate-400",children:["Guruh/Kanal ID si (masalan: ",e.jsx("code",{children:"-100..."}),') yoki botga yozib "Avtomatik topish"ni bosing.']})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",children:[e.jsxs("label",{className:"flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[11px] font-bold text-slate-800 dark:text-white",children:"To‘lov Kvitansiyasini Yuborish"}),e.jsx("p",{className:"text-[9px] text-slate-400",children:"Har bir to‘lovda avtomatik chek"})]}),e.jsx("input",{type:"checkbox",checked:P,onChange:s=>pe(s.target.checked),className:"h-4 w-4 accent-[#5A0B1C] cursor-pointer"})]}),e.jsxs("label",{className:"flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[11px] font-bold text-slate-800 dark:text-white",children:"Yo‘qlama Xabarnomasi"}),e.jsx("p",{className:"text-[9px] text-slate-400",children:"Kelmagan o‘quvchilar haqida ogohlantirish"})]}),e.jsx("input",{type:"checkbox",checked:D,onChange:s=>ue(s.target.checked),className:"h-4 w-4 accent-[#5A0B1C] cursor-pointer"})]})]}),e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2.5",children:[e.jsxs("button",{type:"button",onClick:Se,disabled:b,className:"flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-[#5A0B1C]/30 bg-[#FAF0F2] hover:bg-[#F3E2E6] dark:border-[#5A0B1C]/40 dark:bg-[#5A0B1C]/20 dark:hover:bg-[#5A0B1C]/30 active:scale-[0.98] text-xs font-bold text-[#5A0B1C] dark:text-[#D9A62E] transition-all cursor-pointer disabled:opacity-50",children:[b?e.jsx(c,{className:"h-3.5 w-3.5 animate-spin"}):e.jsx(C,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:b?"Tekshirilmoqda...":"1. Ulanishni Sinash"})]}),e.jsxs("button",{type:"button",onClick:Ce,disabled:N,className:"flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-[#F0D5DC] bg-[#FAF0F2] hover:bg-[#F5E6EA] active:scale-[0.98] text-xs font-bold text-[#5A0B1C] dark:border-[#5A0B1C]/40 dark:bg-[#5A0B1C]/20 dark:text-[#D9A62E] transition-all cursor-pointer disabled:opacity-50",children:[N?e.jsx(c,{className:"h-3.5 w-3.5 animate-spin"}):e.jsx(se,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:N?"O‘rnatilmoqda...":"2. 📲 Bot Menyu Tugmalarini O‘rnatish"})]}),e.jsxs("button",{type:"button",onClick:Ae,disabled:w,className:"flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] text-xs font-bold text-amber-700 dark:text-amber-400 transition-all cursor-pointer disabled:opacity-50",children:[w?e.jsx(c,{className:"h-3.5 w-3.5 animate-spin"}):e.jsx(ee,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:w?"Yuborilmoqda...":"3. 🔥 Sinov Arizasi Yuborish"})]})]}),h&&e.jsxs("div",{className:`flex items-start gap-2.5 text-xs font-medium px-4 py-2.5 rounded-xl border transition-all ${h.success?"bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300":"bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"}`,children:[h.success?e.jsx(g,{className:"h-4 w-4 shrink-0 mt-0.5 text-emerald-500"}):e.jsx(Z,{className:"h-4 w-4 shrink-0 mt-0.5 text-rose-500"}),e.jsx("span",{className:"text-xs leading-relaxed",children:h.message})]})]})]}),e.jsxs("div",{className:"mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",children:e.jsx(A,{className:"h-4 w-4"})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",children:[e.jsx("span",{children:"Eskiz.uz SMS Gateway Integratsiyasi"}),e.jsx("span",{className:"rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400",children:"O‘zbekiston SMS"})]}),e.jsx("p",{className:"text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400",children:"Oflayn va interneti yo‘q ota-onalarga to‘g‘ridan-to‘g‘ri telefon raqamiga SMS yuborish"})]})]}),e.jsxs("button",{type:"button",onClick:()=>we(!O),className:"flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer self-start sm:self-auto",children:[e.jsx(W,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Eskiz qanday ulanadi?"})]})]}),O&&e.jsxs("div",{className:"p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-xs space-y-2 text-slate-700 dark:text-slate-300 animate-in fade-in duration-200",children:[e.jsx("p",{className:"font-bold text-emerald-800 dark:text-emerald-300",children:"Eskiz.uz SMS provayderini ulash (100 ta bepul SMS bilan):"}),e.jsxs("ol",{className:"list-decimal list-inside space-y-1 text-[11px] leading-relaxed",children:[e.jsxs("li",{children:[e.jsx("a",{href:"https://eskiz.uz",target:"_blank",rel:"noreferrer",className:"font-bold text-emerald-600 underline",children:"eskiz.uz"})," saytidan ro‘yxatdan o‘ting va akkaunt yarating (yangi akkauntlarga bepul sinov SMSlari beriladi)."]}),e.jsxs("li",{children:["Eskiz boshqaruv panelidagi emailingiz va parolingizni yoki ",e.jsx("b",{children:"API Token"}),"ingizni quyidagi maydonlarga kiriting."]}),e.jsxs("li",{children:['O‘zingizning tasdiqlangan "From" (Yuboruvchi) nomingiz bo‘lsa kiriting, aks holda standart ',e.jsx("code",{children:"4546"})," raqami avtomatik ishlatiladi."]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Eskiz Email"}),e.jsxs("div",{className:"relative",children:[e.jsx(J,{className:"absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"email",value:j,onChange:s=>be(s.target.value),placeholder:"masalan: lumos.edu@gmail.com",className:`${n} pl-10 text-xs`})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Eskiz Parol / Maxfiy Kalit"}),e.jsxs("div",{className:"relative",children:[e.jsx(Oe,{className:"absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"password",value:k,onChange:s=>je(s.target.value),placeholder:"••••••••••••",className:`${n} pl-10 text-xs`})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Yoki To‘g‘ridan-to‘g‘ri API Token (Ixtiyoriy)"}),e.jsxs("div",{className:"relative",children:[e.jsx(De,{className:"absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"text",value:y,onChange:s=>ke(s.target.value),placeholder:"eyJ0eXAiOiJKV1QiLC...",className:`${n} pl-10 font-mono text-xs`})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:l,children:"Yuboruvchi Nomi (From / Sender ID)"}),e.jsxs("div",{className:"relative",children:[e.jsx(A,{className:"absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"text",value:U,onChange:s=>ye(s.target.value),placeholder:"4546 (yoki tasdiqlangan nom)",className:`${n} pl-10 text-xs`})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",children:[e.jsxs("label",{className:"flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[11px] font-bold text-slate-800 dark:text-white",children:"To‘lov Chekini SMS orqali yuborish"}),e.jsx("p",{className:"text-[9px] text-slate-400",children:"To‘lov qabul qilinganda ota-onaga kvitansiya SMS"})]}),e.jsx("input",{type:"checkbox",checked:L,onChange:s=>ve(s.target.checked),className:"h-4 w-4 accent-emerald-500 cursor-pointer"})]}),e.jsxs("label",{className:"flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:bg-slate-100/60 transition-all",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[11px] font-bold text-slate-800 dark:text-white",children:"Yo‘qlama SMS Ogohlantirishi"}),e.jsx("p",{className:"text-[9px] text-slate-400",children:"Kelmadi deb belgilanganda darhol SMS boradi"})]}),e.jsx("input",{type:"checkbox",checked:_,onChange:s=>fe(s.target.checked),className:"h-4 w-4 accent-emerald-500 cursor-pointer"})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2",children:[e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("button",{type:"button",onClick:Te,disabled:f,className:"flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-all cursor-pointer disabled:opacity-50",children:[f?e.jsx(c,{className:"h-3.5 w-3.5 animate-spin"}):e.jsx(A,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:f?"Tekshirilmoqda...":"SMS Balansini Tekshirish & Sinash"})]})}),u&&e.jsxs("div",{className:`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl ${u.success?"bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300":"bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"}`,children:[u.success?e.jsx(g,{className:"h-4 w-4 shrink-0"}):e.jsx(Z,{className:"h-4 w-4 shrink-0"}),e.jsx("span",{className:"text-[11px] leading-tight",children:u.message})]})]})]})]})]}),e.jsx("div",{className:`\r
              flex\r
              justify-end\r
              pb-2\r
            `,children:e.jsx("button",{type:"submit",className:`
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

                ${v?`
                      bg-emerald-600
                      shadow-emerald-500/25
                    `:`
                      bg-[#5A0B1C]
                      shadow-sm

                      hover:bg-[#450815]
                    `}
              `,children:v?e.jsxs(e.Fragment,{children:[e.jsx(g,{className:`\r
                      h-4\r
                      w-4\r
                    `}),"Saved ✓"]}):e.jsxs(e.Fragment,{children:[e.jsx(Pe,{className:`\r
                      h-4\r
                      w-4\r
                    `}),"Save Preferences"]})})})]})]})};export{ns as SettingsPage};
