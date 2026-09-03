import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export type PaymentProvider = 'payme' | 'click' | 'cash';

export interface PaymentInitiateParams {
  studentId: string;
  studentName: string;
  amount: number;
  academicMonth: string;
  provider: PaymentProvider;
  note?: string;
}

export interface PaymentReceiptData {
  transactionId: string;
  studentName: string;
  studentId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  academicMonth: string;
  date: string;
  centerName?: string;
}

/**
 * Initiates checkout URL for Payme or Click
 */
export async function initiateOnlinePayment(params: PaymentInitiateParams): Promise<{
  success: boolean;
  transactionId: string;
  checkoutUrl?: string;
  error?: string;
}> {
  const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const returnUrl = `${window.location.origin}/#/payment/success?tx=${transactionId}&student=${encodeURIComponent(
    params.studentName
  )}&amount=${params.amount}&provider=${params.provider}&month=${params.academicMonth}`;

  try {
    if (params.provider === 'payme') {
      // Payme checkout parameter encoding
      // m=merchant_id;ac.transaction_id=...;a=amount_in_tiyin;c=callback
      const merchantId = import.meta.env.VITE_PAYME_MERCHANT_ID || '640b8a13c9597391038b43f1';
      const amountInTiyin = Math.round(params.amount * 100);
      const rawParams = `m=${merchantId};ac.transaction_id=${transactionId};ac.student_id=${params.studentId};a=${amountInTiyin};c=${encodeURIComponent(returnUrl)}`;
      const base64 = btoa(rawParams);
      const checkoutUrl = `https://checkout.paycom.uz/${base64}`;

      return { success: true, transactionId, checkoutUrl };
    }

    if (params.provider === 'click') {
      // Click checkout redirect
      const serviceId = import.meta.env.VITE_CLICK_SERVICE_ID || '18923';
      const merchantId = import.meta.env.VITE_CLICK_MERCHANT_ID || '12345';
      const checkoutUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${params.amount}&transaction_param=${transactionId}&return_url=${encodeURIComponent(returnUrl)}`;

      return { success: true, transactionId, checkoutUrl };
    }

    // Cash / Direct
    return { success: true, transactionId };
  } catch (err: any) {
    return { success: false, transactionId, error: err.message || 'Payment initiation failed' };
  }
}

/**
 * Generates an official PDF receipt using jsPDF
 */
export function generatePdfReceipt(data: PaymentReceiptData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  // Background card styling
  doc.setFillColor(248, 249, 250);
  doc.rect(5, 5, 138, 200, 'F');

  // Header banner
  doc.setFillColor(217, 119, 6); // Amber 600
  doc.rect(5, 5, 138, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LUMOS O‘QUV MARKAZI', 74, 15, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('RASMIY TO‘LOV KVITANSIYASI / PAYMENT RECEIPT', 74, 21, { align: 'center' });

  // Receipt meta
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Kvitansiya №: ${data.transactionId}`, 15, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sana: ${data.date}`, 15, 45);
  doc.text(`To‘lov Provayderi: ${data.provider.toUpperCase()}`, 15, 52);

  // Status Badge
  doc.setFillColor(220, 252, 231); // Green soft
  doc.roundedRect(100, 34, 38, 10, 2, 2, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text('TO‘LANGAN (PAID)', 119, 41, { align: 'center' });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 60, 133, 60);

  // Payment Details Table
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);

  let y = 72;
  const addRow = (label: string, value: string, isBold: boolean = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(label, 15, y);

    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(value, 133, y, { align: 'right' });
    y += 9;
  };

  addRow('O‘quvchi F.I.Sh:', data.studentName, true);
  addRow('O‘quvchi ID:', data.studentId);
  addRow('Akademik Oy:', data.academicMonth);
  addRow('Valyuta:', data.currency);
  addRow('To‘lov Turi:', data.provider === 'payme' ? 'Payme Onlayn' : data.provider === 'click' ? 'Click Onlayn' : 'Kassa (Naqd/Terminal)');

  // Divider
  doc.line(15, y + 2, 133, y + 2);
  y += 12;

  // Total Amount Box
  doc.setFillColor(254, 243, 199); // Amber soft
  doc.roundedRect(15, y, 118, 18, 3, 3, 'F');
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('JAMI TO‘LANGAN SUMMA:', 22, y + 11);
  doc.setFontSize(13);
  doc.text(`${data.amount.toLocaleString()} ${data.currency}`, 125, y + 12, { align: 'right' });

  // Footer notes
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Ushbu kvitansiya LUMOS CRM elektron to‘lov tizimi tomonidan avtomatik shakllantirilgan.', 74, 180, { align: 'center' });
  doc.text('Savollar uchun: +998 (71) 200-00-25 | info@lumos.uz', 74, 186, { align: 'center' });

  doc.save(`LUMOS_Receipt_${data.transactionId}.pdf`);
}

/**
 * Triggers confetti animation
 */
export function fireCelebrationConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });
  } catch (e) {
    // ignore
  }
}
