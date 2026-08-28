export interface DonationConfig {
  bankName: string;
  accountName: string;
  accountNumber?: string;
  qrisImageUrl: string;
  saweriaUsername: string;
  saweriaUrl: string;
  gopayNumber: string;
  gopayName: string;
  gopayUrl: string;
}

export const DONATION_CONFIG: DonationConfig = {
  bankName: process.env.NEXT_PUBLIC_DONATION_BANK_NAME || 'BCA / Seluruh Bank & E-Wallet',
  accountName: process.env.NEXT_PUBLIC_DONATION_ACCOUNT_NAME || 'Sulistiyo',
  accountNumber: process.env.NEXT_PUBLIC_DONATION_BANK_ACCOUNT || '',
  qrisImageUrl: process.env.NEXT_PUBLIC_DONATION_QRIS_IMAGE || '/images/qris-donation.svg',
  saweriaUsername: process.env.NEXT_PUBLIC_DONATION_SAWERIA_USERNAME || 'sulistiyas',
  saweriaUrl:
    process.env.NEXT_PUBLIC_DONATION_SAWERIA_URL ||
    `https://saweria.co/${process.env.NEXT_PUBLIC_DONATION_SAWERIA_USERNAME || 'sulistiyas'}`,
  gopayNumber: process.env.NEXT_PUBLIC_DONATION_GOPAY_NUMBER || '0858-6789-1234',
  gopayName: process.env.NEXT_PUBLIC_DONATION_GOPAY_NAME || 'Sulistiyo',
  gopayUrl: process.env.NEXT_PUBLIC_DONATION_GOPAY_URL || 'https://gopay.co.id/',
};
