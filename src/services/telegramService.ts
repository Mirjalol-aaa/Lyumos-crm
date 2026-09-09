// LUMOS CRM & LMS — Telegram Bot Service

export interface TelegramSendResult {
  success: boolean;
  messageId?: number;
  botName?: string;
  error?: string;
}

/**
 * Send an HTML formatted message through Telegram Bot API
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  htmlText: string
): Promise<TelegramSendResult> {
  const cleanToken = (botToken || '').trim();
  const cleanChatId = (chatId || '').trim();

  if (!cleanToken) {
    return { success: false, error: 'Telegram Bot Token kiritilmagan.' };
  }
  if (!cleanChatId) {
    return { success: false, error: 'Telegram Chat ID (yoki Kanal ID) kiritilmagan.' };
  }

  try {
    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return {
        success: true,
        messageId: data.result?.message_id,
      };
    } else {
      return {
        success: false,
        error: data.description || 'Telegram xabar yuborishda xatolik yuz berdi.',
      };
    }
  } catch (err: any) {
    console.error('Telegram API error:', err);
    return {
      success: false,
      error: err.message || 'Tarmoq xatosi: Telegram serveriga ulanib bo‘lmadi.',
    };
  }
}

/**
 * Test Bot token validity and send a test greeting
 */
export async function testTelegramBot(
  botToken: string,
  chatId?: string
): Promise<TelegramSendResult> {
  const cleanToken = (botToken || '').trim();
  if (!cleanToken) {
    return { success: false, error: 'Iltimos, avval Telegram Bot Tokenini kiriting.' };
  }

  try {
    // 1. Verify token with getMe
    const meRes = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
    const meData = await meRes.json();

    if (!meData.ok) {
      return {
        success: false,
        error: `Bot Token yaroqsiz: ${meData.description || 'Tekshiring'}`,
      };
    }

    const botName = `@${meData.result?.username}` || meData.result?.first_name || 'LumosBot';

    // 2. If chatId provided, send test ping
    if (chatId && chatId.trim()) {
      const pingText = `🚀 <b>LUMOS CRM & LMS:</b> Telegram boti (<b>${botName}</b>) muvaffaqiyatli ulandi!\n\n🕒 Sana: ${new Date().toLocaleString('uz-UZ')}\n✅ Tizim bildirishnomalar yuborishga tayyor.`;
      const sendRes = await sendTelegramMessage(cleanToken, chatId.trim(), pingText);
      if (!sendRes.success) {
        return {
          success: false,
          botName,
          error: `Bot faol (${botName}), lekin Chat ID ga xabar yuborib bo‘lmadi: ${sendRes.error}. (Eslatma: Botga avval /start bosilgan bo‘lishi yoki bot kanal/guruhda admin bo‘lishi kerak).`,
        };
      }
    }

    return {
      success: true,
      botName,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Telegram serveriga ulanishda xatolik yuz berdi.',
    };
  }
}

/**
 * Build elegant payment receipt HTML text for Telegram
 */
export function formatPaymentReceiptMessage(params: {
  studentName: string;
  groupName: string;
  month: string;
  amount: number;
  method: string;
  receiptNo: string;
  dateTime?: string;
  centerPhone?: string;
  centerName?: string;
}): string {
  const {
    studentName,
    groupName,
    month,
    amount,
    method,
    receiptNo,
    dateTime = new Date().toLocaleString('uz-UZ'),
    centerPhone = '+998 (71) 200-00-25',
    centerName = 'LUMOS O‘quv Markazi',
  } = params;

  return `🧾 <b>${centerName.toUpperCase()} — TO‘LOV KVITANSIYASI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>O‘quvchi:</b> ${studentName}
📚 <b>Guruh:</b> ${groupName}
📅 <b>Oy:</b> ${month}
💰 <b>To‘langan summa:</b> ${Number(amount).toLocaleString()} so‘m
💳 <b>To‘lov usuli:</b> ${method}
🔢 <b>Kvitansiya №:</b> <code>${receiptNo}</code>
🕒 <b>Vaqti:</b> ${dateTime}
━━━━━━━━━━━━━━━━━━━━━━━━━
✨ <i>Farzandingiz kelajagiga kiritgan sarmoyangiz uchun tashakkur!</i>
🏛 <b>${centerName}</b> | 📞 ${centerPhone}`;
}

/**
 * Build attendance notice HTML text for Telegram
 */
export function formatAttendanceAlertMessage(params: {
  studentName: string;
  groupName: string;
  date: string;
  status: 'Absent' | 'Late' | 'Excused' | 'Present';
  note?: string;
  centerPhone?: string;
  centerName?: string;
}): string {
  const {
    studentName,
    groupName,
    date,
    status,
    note,
    centerPhone = '+998 (71) 200-00-25',
    centerName = 'LUMOS O‘quv Markazi',
  } = params;

  let statusText = 'Keldi';
  let statusEmoji = '🟢';

  if (status === 'Absent') {
    statusText = 'Darsga kelmadi';
    statusEmoji = '🔴';
  } else if (status === 'Late') {
    statusText = 'Darsga kechikib keldi';
    statusEmoji = '🟡';
  } else if (status === 'Excused') {
    statusText = 'Sababli qatnashmadi';
    statusEmoji = '🔵';
  }

  return `🔔 <b>${centerName.toUpperCase()} — DAVOMAT XABARNOMASI</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
Hurmatli ota-ona!

Farzandingiz <b>${studentName}</b> bugun (${date}) <b>${groupName}</b> darsida:
⚠️ <b>Holati:</b> ${statusText} ${statusEmoji}
${note ? `📝 <b>Sabab / Izoh:</b> ${note}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Qo‘shimcha savollar bo‘lsa: ${centerPhone}
🏛 <b>${centerName}</b>`;
}

/**
 * Build daily attendance report for management
 */
export function formatAttendanceSummaryMessage(params: {
  groupName: string;
  teacherName: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
}): string {
  const {
    groupName,
    teacherName,
    date,
    totalStudents,
    presentCount,
    absentCount,
    lateCount,
  } = params;

  return `📊 <b>KUNLIK DAVOMAT HISOBOTI — LUMOS</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
📚 <b>Guruh:</b> ${groupName}
👨‍🏫 <b>Ustoz:</b> ${teacherName}
📅 <b>Sana:</b> ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Jami o‘quvchilar:</b> ${totalStudents} nafar
🟢 <b>Kelganlar:</b> ${presentCount} nafar
🔴 <b>Kelmaganlar:</b> ${absentCount} nafar
🟡 <b>Kechikkanlar:</b> ${lateCount} nafar
━━━━━━━━━━━━━━━━━━━━━━━━━
🏛 <b>LUMOS CRM Boshqaruvi</b>`;
}

/**
 * Direct Telegram Share link (works without bot token through user's Telegram app)
 */
export function getTelegramShareUrl(text: string): string {
  return `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
}

/**
 * Send an HTML formatted message with Custom Reply Keyboard
 */
export async function sendTelegramMessageWithKeyboard(
  botToken: string,
  chatId: string,
  htmlText: string,
  keyboard: string[][]
): Promise<TelegramSendResult> {
  const cleanToken = (botToken || '').trim();
  const cleanChatId = (chatId || '').trim();

  if (!cleanToken || !cleanChatId) {
    return { success: false, error: 'Token yoki Chat ID yetarli emas.' };
  }

  try {
    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          keyboard: keyboard.map((row) => row.map((text) => ({ text }))),
          resize_keyboard: true,
          one_time_keyboard: false,
        },
      }),
    });

    const data = await response.json();
    return {
      success: data.ok,
      messageId: data.result?.message_id,
      error: data.ok ? undefined : data.description,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Build rich lead application notification for Telegram management group
 */
export function formatLeadApplicationMessage(params: {
  fullName: string;
  phone: string;
  subject?: string;
  source?: string;
  dateTime?: string;
  centerName?: string;
}): string {
  const {
    fullName,
    phone,
    subject = 'Umumiy kurs',
    source = 'LUMOS Asosiy Veb-sayti',
    dateTime = new Date().toLocaleString('uz-UZ'),
    centerName = 'LUMOS O‘quv Markazi',
  } = params;

  return `🔥 <b>YANGI ARIZA TUSHDI! (${centerName})</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz (O‘quvchi):</b> ${fullName}
📞 <b>Telefon:</b> <code>${phone}</code>
📚 <b>Tanlagan kursi:</b> ${subject}
🌐 <b>Manba:</b> ${source}
🕒 <b>Vaqti:</b> ${dateTime}
━━━━━━━━━━━━━━━━━━━━━━━━━
⚡️ <i>Mijoz bilan zudlik bilan bog‘lanib, sinov darsiga taklif qiling!</i>
👉 Qo‘ng‘iroq qilish: <a href="tel:${phone.replace(/[^\d+]/g, '')}">${phone}</a>`;
}

/**
 * Build daily cashflow financial report for management
 */
export function formatDailyCashflowMessage(params: {
  date: string;
  totalCollected: number;
  paymentsCount: number;
  centerName?: string;
}): string {
  const {
    date,
    totalCollected,
    paymentsCount,
    centerName = 'LUMOS O‘quv Markazi',
  } = params;

  return `💰 <b>KUNLIK KASSA HISOBOTI — ${centerName}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
📅 <b>Sana:</b> ${date}
💵 <b>Jami tushum:</b> ${Number(totalCollected || 0).toLocaleString('uz-UZ')} so‘m
🧾 <b>Qabul qilingan to‘lovlar:</b> ${paymentsCount} ta chek
━━━━━━━━━━━━━━━━━━━━━━━━━
🏛 <b>LUMOS CRM & Moliya</b>`;
}

/**
 * Setup default interactive menu for users in Telegram Bot
 */
export async function setupBotMainMenu(
  botToken: string,
  chatId: string,
  centerName = 'LUMOS O‘quv Markazi'
): Promise<TelegramSendResult> {
  const welcomeText = `👋 <b>Assalomu alaykum! ${centerName} rasmiy botiga xush kelibsiz!</b>\n\nQuyidagi menyu tugmalaridan birini tanlang yoki savolingizni yozing:`;
  return sendTelegramMessageWithKeyboard(botToken, chatId, welcomeText, [
    ['📅 Dars Jadvalim', '💳 To‘lov & Balansim'],
    ['📊 Davomatim', '📍 Manzil & Bog‘lanish'],
    ['📞 Admin bilan bog‘lanish'],
  ]);
}

/**
 * Handle incoming Telegram updates and generate intelligent automated replies
 */
export async function processTelegramUpdates({
  botToken,
  students = [],
  groups = [],
  centerName = 'LUMOS O‘quv Markazi',
  centerPhone = '+998 (71) 200-00-25',
}: {
  botToken: string;
  students?: any[];
  groups?: any[];
  centerName?: string;
  centerPhone?: string;
}): Promise<number> {
  const cleanToken = (botToken || '').trim();
  if (!cleanToken) return 0;

  const storageKey = 'lumos_tg_last_update_id';
  const lastUpdateId = Number(localStorage.getItem(storageKey) || 0);

  try {
    const url = `https://api.telegram.org/bot${cleanToken}/getUpdates?offset=${lastUpdateId + 1}&limit=10&timeout=0`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.ok || !Array.isArray(data.result) || data.result.length === 0) {
      return 0;
    }

    let maxId = lastUpdateId;

    for (const update of data.result) {
      if (update.update_id > maxId) maxId = update.update_id;

      const message = update.message;
      if (!message || !message.text) continue;

      const chatId = String(message.chat.id);
      const rawText = message.text.trim();
      const lower = rawText.toLowerCase();

      // 1. /start or salom
      if (lower.startsWith('/start') || lower === 'salom' || lower === 'menyu') {
        await setupBotMainMenu(cleanToken, chatId, centerName);
        continue;
      }

      // 2. Dars jadvali
      if (lower.includes('jadval') || lower.includes('dars jadvalim')) {
        let scheduleText = `📅 <b>${centerName.toUpperCase()} — DARS JADVALLARI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        if (groups.length > 0) {
          groups.forEach((g) => {
            scheduleText += `📚 <b>${g.name}</b>\n👨‍🏫 Ustoz: ${g.teacherName}\n🗓 Kunlar: ${g.scheduleDays}\n⏰ Vaqt: ${g.scheduleTime}\n🚪 Xona: ${g.room}\n\n`;
          });
        } else {
          scheduleText += `📚 <b>Matematika (Hadicha ustoz):</b> Dush, Chor, Juma | 14:00 - 16:00 | 101-xona\n\n📚 <b>Ingliz tili (Hasanboy ustoz):</b> Sesh, Pay, Shan | 15:30 - 17:30 | 102-xona\n`;
        }
        scheduleText += `━━━━━━━━━━━━━━━━━━━━━━━━━\n📞 Ma'lumot uchun: ${centerPhone}`;
        await sendTelegramMessage(cleanToken, chatId, scheduleText);
        continue;
      }

      // 3. To'lov & Balans
      if (lower.includes('to‘lov') || lower.includes('tolov') || lower.includes('balans')) {
        const balanceInfo = `💳 <b>${centerName.toUpperCase()} — TO‘LOV MA’LUMOTLARI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `💰 <b>Standart oylik to‘lov:</b> 250 000 so‘m / oy\n` +
          `💳 <b>To‘lov usullari:</b> Naqd, Click, Payme\n` +
          `📅 <b>To‘lov muddati:</b> Har oyning 5-sanasigacha\n\n` +
          `🔎 <i>Shaxsiy to‘lov holatingizni tekshirish uchun telefon raqamingizni (masalan: <code>998901234567</code>) yozib yuboring!</i>\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━\n📞 Moliya bo‘limi: ${centerPhone}`;
        await sendTelegramMessage(cleanToken, chatId, balanceInfo);
        continue;
      }

      // 4. Manzil va Bog'lanish
      if (lower.includes('manzil') || lower.includes('bog‘lanish') || lower.includes('boglanish')) {
        const contactInfo = `📍 <b>${centerName.toUpperCase()} BIZNING MANZIL:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `🏢 <b>Manzil:</b> Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi 42\n` +
          `🕒 <b>Ish vaqti:</b> Dushanba - Shanba: 08:30 - 20:00\n` +
          `📞 <b>Telefon:</b> ${centerPhone}\n` +
          `🌐 <b>Veb-sayt:</b> <a href="https://mirjalol-aaa.github.io/Lyumos-crm/">LUMOS Platformasi</a>\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━\nKelishingizdan xursand bo‘lamiz! ✨`;
        await sendTelegramMessage(cleanToken, chatId, contactInfo);
        continue;
      }

      // 5. Admin command: /kassa
      if (lower === '/kassa') {
        const todayStr = new Date().toISOString().split('T')[0];
        let todaySum = 0;
        let count = 0;
        students.forEach((s) => {
          Object.values(s.payments || {}).forEach((p: any) => {
            if (p.paymentDate === todayStr && p.status === 'Paid') {
              todaySum += Number(p.amountPaid || 0);
              count++;
            }
          });
        });
        const msg = formatDailyCashflowMessage({
          date: todayStr,
          totalCollected: todaySum,
          paymentsCount: count,
          centerName,
        });
        await sendTelegramMessage(cleanToken, chatId, msg);
        continue;
      }

      // 6. Check if user typed a phone number to check their student balance
      const digitsOnly = rawText.replace(/[^\d]/g, '');
      if (digitsOnly.length >= 7) {
        const matched = students.find(
          (s) =>
            s.phone.replace(/[^\d]/g, '').includes(digitsOnly) ||
            (s.parentPhone && s.parentPhone.replace(/[^\d]/g, '').includes(digitsOnly))
        );

        if (matched) {
          const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
          const payment = matched.payments?.[currentMonth] || matched.payments?.['September'];
          const isPaid = payment?.status === 'Paid' || payment?.status === 'Discount';

          const cardText = `👤 <b>O‘QUVCHI MA’LUMOTNOMASI:</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `👨‍🎓 <b>Ism:</b> ${matched.fullName}\n` +
            `📚 <b>Guruh:</b> ${matched.groupName}\n` +
            `👨‍🏫 <b>Ustoz:</b> ${matched.teacherName}\n` +
            `💰 <b>Kelishilgan to‘lov:</b> ${Number(matched.monthlyFee).toLocaleString()} so‘m\n` +
            `💳 <b>${currentMonth} oyi holati:</b> ${isPaid ? 'To‘langan ✅' : 'To‘lov kutilmoqda ⏳'}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📞 Aloqa: ${centerPhone}`;
          await sendTelegramMessage(cleanToken, chatId, cardText);
          continue;
        }
      }

      // Fallback response with menu
      await sendTelegramMessage(
        cleanToken,
        chatId,
        `Savolingiz uchun rahmat! Ma’murlarimiz tez orada siz bilan bog‘lanadi. Shoshilinch savollar bo‘lsa: ${centerPhone}`
      );
    }

    localStorage.setItem(storageKey, String(maxId));
    return data.result.length;
  } catch (err) {
    console.warn('[Telegram Updates Error]:', err);
    return 0;
  }
}
