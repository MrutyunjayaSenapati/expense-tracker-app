import { Linking, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

export interface UpiPaymentDetails {
  upiId: string;
  payeeName: string;
  amount: number;
  note?: string;
}

/**
 * Generates a standardized Indian UPI deep link
 * Format: upi://pay?pa={upiId}&pn={name}&am={amount}&tn={note}&cu=INR
 */
export function generateUpiUrl(details: UpiPaymentDetails): string {
  const params = new URLSearchParams({
    pa: details.upiId.trim(),
    pn: details.payeeName.trim(),
    am: details.amount.toFixed(2),
    tn: details.note?.trim() || 'Split Expense Payment',
    cu: 'INR',
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Creates a clean text message for sharing via WhatsApp, SMS, or Share Sheet
 */
export function generateSplitShareMessage(params: {
  billTitle: string;
  yourName: string;
  amountOwed: number;
  yourUpiId?: string;
}): string {
  const upiLink = params.yourUpiId ? generateUpiUrl({
    upiId: params.yourUpiId,
    payeeName: params.yourName,
    amount: params.amountOwed,
    note: `Split: ${params.billTitle}`,
  }) : '';

  let msg = `Hi! Here is the split request for "${params.billTitle}".\n`;
  msg += `Your share is: ₹${params.amountOwed.toLocaleString('en-IN')}.\n`;

  if (params.yourUpiId) {
    msg += `\nPay via UPI (GPay / PhonePe / Paytm):\n${upiLink}\n`;
  }

  msg += `\nSent via Expense Tracker`;
  return msg;
}

/**
 * Opens WhatsApp or native Share Sheet with the payment request
 */
export async function sharePaymentRequest(params: {
  billTitle: string;
  yourName: string;
  participantName: string;
  phoneOrUpi?: string;
  amountOwed: number;
  yourUpiId?: string;
}): Promise<void> {
  const message = generateSplitShareMessage({
    billTitle: params.billTitle,
    yourName: params.yourName,
    amountOwed: params.amountOwed,
    yourUpiId: params.yourUpiId,
  });

  // 1. If phone number is available, attempt to open WhatsApp directly
  if (params.phoneOrUpi && /^\+?[0-9]{10,13}$/.test(params.phoneOrUpi.replace(/\s+/g, ''))) {
    const cleanPhone = params.phoneOrUpi.replace(/[^0-9]/g, '');
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}&text=${encodeURIComponent(message)}`;
    
    const canOpen = await Linking.canOpenURL(whatsappUrl).catch(() => false);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return;
    }
  }

  // 2. Fallback to SMS or Native Share / Clipboard
  const smsUrl = `sms:${params.phoneOrUpi || ''}?body=${encodeURIComponent(message)}`;
  const canSms = await Linking.canOpenURL(smsUrl).catch(() => false);
  if (canSms) {
    await Linking.openURL(smsUrl);
    return;
  }

  // 3. Fallback to Web/System Share API if available
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).share) {
    await (navigator as any).share({
      title: `Split Request for ${params.billTitle}`,
      text: message,
    });
  }
}
