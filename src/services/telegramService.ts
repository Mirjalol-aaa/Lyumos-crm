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
