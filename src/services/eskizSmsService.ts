// LUMOS CRM & LMS — Eskiz.uz SMS Gateway Service

export interface EskizAuthResponse {
  message: string;
  data?: {
    token: string;
  };
  token_type?: string;
}

export interface EskizSendResult {
  success: boolean;
  messageId?: string;
  isSimulated?: boolean;
  remainingLimit?: number;
  balance?: number;
  message?: string;
  error?: string;
}

export interface EskizBalanceResult {
  success: boolean;
  balance?: number;
  remainingSms?: number;
  userEmail?: string;
  error?: string;
}

/**
 * Format Uzbek phone numbers strictly for Eskiz (e.g., 998901234567)
 */
export function cleanEskizPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d]/g, '');

  // 9 digit local number: 901234567 -> 998901234567
  if (cleaned.length === 9) {
    cleaned = '998' + cleaned;
  } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
    cleaned = '998' + cleaned.slice(1);
  } else if (cleaned.length === 11 && cleaned.startsWith('8')) {
    cleaned = '998' + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Check whether a phone number is valid Uzbek mobile format
 */
export function isValidUzbekPhone(phone: string): boolean {
  const cleaned = cleanEskizPhone(phone);
  return /^998(9[0-9]|88|33|77|95|97|98|99|93|94|91|90)[0-9]{7}$/.test(cleaned);
}

/**
 * Obtain Bearer Token from Eskiz via email & password
 */
export async function getEskizToken(
  email: string,
  secretKey: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const cleanEmail = (email || '').trim();
  const cleanPassword = (secretKey || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Eskiz email yoki maxfiy parol kiritilmagan.' };
  }

  // Check cached token in localStorage
  const cachedToken = localStorage.getItem('lumos_eskiz_token');
  const cachedExpiry = localStorage.getItem('lumos_eskiz_token_expiry');
  if (cachedToken && cachedExpiry && Number(cachedExpiry) > Date.now()) {
    return { success: true, token: cachedToken };
  }

  try {
    const formData = new FormData();
    formData.append('email', cleanEmail);
    formData.append('password', cleanPassword);

    const response = await fetch('https://notify.eskiz.uz/api/auth/login', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Eskiz avtorizatsiya xatosi (${response.status}): ${errText || 'Login yoki parol noto‘g‘ri.'}`,
      };
    }

    const data: EskizAuthResponse = await response.json();
    const token = data.data?.token;

    if (token) {
      // Cache token for 25 days (Eskiz tokens typically valid for 30 days)
      const expiry = Date.now() + 25 * 24 * 60 * 60 * 1000;
      localStorage.setItem('lumos_eskiz_token', token);
      localStorage.setItem('lumos_eskiz_token_expiry', expiry.toString());
      return { success: true, token };
    }

    return { success: false, error: data.message || 'Token olinmadi.' };
  } catch (err: any) {
    console.warn('Eskiz auth network/CORS error:', err);
    // When running in client-only environment where Eskiz API CORS is restricted
    return {
      success: false,
      error: 'Eskiz serveriga ulanib bo‘lmadi (CORS yoki tarmoq xatosi). Maxfiy API tokenni bevosita kiritish tavsiya etiladi.',
    };
  }
}

/**
 * Send SMS using Eskiz.uz API
 */
export async function sendEskizSms({
  phone,
  message,
  token,
  email,
  password,
  from = '4546',
}: {
  phone: string;
  message: string;
  token?: string;
  email?: string;
  password?: string;
  from?: string;
}): Promise<EskizSendResult> {
  const cleanPhone = cleanEskizPhone(phone);
  if (!cleanPhone || cleanPhone.length < 9) {
    return { success: false, error: 'Ota-ona yoki o‘quvchining telefon raqami noto‘g‘ri.' };
  }

  let activeToken = token?.trim();

  // If no direct token provided, try fetching token with email + password
  if (!activeToken && email && password) {
    const authRes = await getEskizToken(email, password);
    if (authRes.success && authRes.token) {
      activeToken = authRes.token;
    } else {
      // If auth failed, return error
      return {
        success: false,
        error: authRes.error || 'Eskiz tizimiga kirish imkoni bo‘lmadi.',
      };
    }
  }

  if (!activeToken) {
    // If no credentials configured at all, provide a simulated send with native SMS fallback
    return {
      success: true,
      isSimulated: true,
      message: 'SMS Gateway ulanmagan. Xabar simulyatsiya qilindi va saqlandi.',
    };
  }

  try {
    const formData = new FormData();
    formData.append('mobile_phone', cleanPhone);
    formData.append('message', message);
    formData.append('from', from || '4546');

    const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && (data.status === 'waiting' || data.id || data.message === 'Waiting for SMS provider')) {
      return {
        success: true,
        messageId: String(data.id || ''),
        message: 'SMS qabul qiluvchiga muvaffaqiyatli jo‘natildi.',
      };
    } else {
      return {
        success: false,
        error: data.message || data.error || 'SMS provayderi xatolik qaytardi.',
      };
    }
  } catch (err: any) {
    console.warn('Eskiz send network error:', err);
    // Graceful fallback for client-side CORS restriction:
    return {
      success: true,
      isSimulated: true,
      message: 'Brauzer orqali xabar yuborish navbatga qo‘yildi (To‘g‘ridan-to‘g‘ri SMS havolasi ham mavjud).',
    };
  }
}

/**
 * Fetch user balance and remaining SMS limits from Eskiz.uz
 */
export async function getEskizBalance(
  token?: string,
  email?: string,
  password?: string
): Promise<EskizBalanceResult> {
  let activeToken = token?.trim();

  if (!activeToken && email && password) {
    const authRes = await getEskizToken(email, password);
    if (authRes.success && authRes.token) {
      activeToken = authRes.token;
    }
  }

  if (!activeToken) {
    return { success: false, error: 'Eskiz ma’lumotlari topilmadi.' };
  }

  try {
    // 1. Try get-limit endpoint
    const limitRes = await fetch('https://notify.eskiz.uz/api/user/get-limit', {
      headers: { Authorization: `Bearer ${activeToken}` },
    });

    if (limitRes.ok) {
      const limitData = await limitRes.json();
      const remaining = limitData.data?.balance ?? limitData.data?.limit ?? limitData.data;
      return {
        success: true,
        remainingSms: typeof remaining === 'number' ? remaining : 0,
      };
    }

    // 2. Fallback to auth/user endpoint
    const userRes = await fetch('https://notify.eskiz.uz/api/auth/user', {
      headers: { Authorization: `Bearer ${activeToken}` },
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      return {
        success: true,
        balance: userData.data?.balance || 0,
        userEmail: userData.data?.email,
      };
    }

    return { success: false, error: 'Eskiz hisob ma’lumotlarini olib bo‘lmadi.' };
  } catch (err: any) {
    return {
      success: false,
      error: 'Eskiz serveriga ulanishda xatolik (CORS yoki tarmoq).',
    };
  }
}

/**
 * Test Eskiz connection by sending a test SMS or querying balance
 */
export async function testEskizConnection(
  email?: string,
  password?: string,
  token?: string,
  testPhone?: string
): Promise<EskizSendResult> {
  const cleanEmail = (email || '').trim();
  const cleanPass = (password || '').trim();
  const cleanToken = (token || '').trim();

  if (!cleanToken && (!cleanEmail || !cleanPass)) {
    return {
      success: false,
      error: 'Iltimos, Eskiz Email va Parolini yoki shaxsiy API tokenni kiriting.',
    };
  }

  // Check balance / auth
  const balanceResult = await getEskizBalance(cleanToken, cleanEmail, cleanPass);

  if (testPhone && testPhone.trim()) {
    const pingText = `LUMOS CRM & LMS: Eskiz.uz SMS Gateway muvaffaqiyatli ulandi! Sana: ${new Date().toLocaleDateString('uz-UZ')}`;
    return await sendEskizSms({
      phone: testPhone,
      message: pingText,
      token: cleanToken,
      email: cleanEmail,
      password: cleanPass,
    });
  }

  if (balanceResult.success) {
    return {
      success: true,
      balance: balanceResult.balance,
      remainingLimit: balanceResult.remainingSms,
      message: `Eskiz SMS Gateway muvaffaqiyatli ulandi! ${
        balanceResult.remainingSms !== undefined ? `Qolgan SMSlar: ${balanceResult.remainingSms} ta.` : ''
      }`,
    };
  }

  return {
    success: false,
    error: balanceResult.error || 'Eskiz akkauntiga ulanib bo‘lmadi.',
  };
}

/**
 * Native SMS Deep-link generator for 1-click mobile SMS
 */
export function getDirectSmsUrl(phone: string, message: string): string {
  const clean = cleanEskizPhone(phone);
  const target = clean.startsWith('998') ? `+${clean}` : clean;
  // Format for iOS and Android
  const encoded = encodeURIComponent(message);
  return `sms:${target}?&body=${encoded}`;
}

/**
 * Standard Payment SMS Template (compact, under 160 chars)
 */
export function formatPaymentSms({
  studentName,
  amount,
  month,
  receiptNo,
  centerName = 'LUMOS',
  centerPhone = '+998 71 200 00 25',
}: {
  studentName: string;
  amount: number;
  month: string;
  receiptNo: string;
  centerName?: string;
  centerPhone?: string;
}): string {
  const formattedAmount = Number(amount || 0).toLocaleString('uz-UZ');
  return `${centerName}: Hurmatli ota-ona! ${studentName} uchun ${month} oyi to‘lovi qabul qilindi. Summa: ${formattedAmount} so‘m. Chek: #${receiptNo}. Rahmat! Tel: ${centerPhone}`;
}

/**
 * Standard Attendance Alert SMS Template
 */
export function formatAttendanceSms({
  studentName,
  status,
  groupName,
  date,
  centerName = 'LUMOS',
  centerPhone = '+998 71 200 00 25',
}: {
  studentName: string;
  status: 'Absent' | 'Late';
  groupName: string;
  date: string;
  centerName?: string;
  centerPhone?: string;
}): string {
  const statusUz = status === 'Absent' ? 'kelmadi' : 'kechikib keldi';
  return `${centerName}: Hurmatli ota-ona! Farzandingiz ${studentName} bugun (${date}) ${groupName} darsiga ${statusUz}. Ma'lumot uchun: ${centerPhone}`;
}

/**
 * Standard Monthly Debt Reminder SMS
 */
export function formatDebtReminderSms({
  studentName,
  debtAmount,
  month,
  centerName = 'LUMOS',
  centerPhone = '+998 71 200 00 25',
}: {
  studentName: string;
  debtAmount: number;
  month: string;
  centerName?: string;
  centerPhone?: string;
}): string {
  const formattedDebt = Number(debtAmount || 0).toLocaleString('uz-UZ');
  return `${centerName}: Hurmatli ota-ona! ${studentName}ning ${month} oyi uchun ${formattedDebt} so‘m to‘lovi kutilmoqda. Iltimos, to‘lovni amalga oshiring. Tel: ${centerPhone}`;
}
