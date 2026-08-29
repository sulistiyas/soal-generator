export interface DonationConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrisImageUrl: string;
  saweriaUsername: string;
  saweriaUrl: string;
  gopayNumber?: string;
  gopayName?: string;
  gopayUrl?: string;
}

export const DONATION_CONFIG: DonationConfig = {
  bankName: process.env.NEXT_PUBLIC_DONATION_BANK_NAME || 'BCA (Bank Central Asia)',
  accountName: process.env.NEXT_PUBLIC_DONATION_ACCOUNT_NAME || 'Sulistiya Nugroho',
  accountNumber: process.env.NEXT_PUBLIC_DONATION_BANK_ACCOUNT || '7540194755',
  qrisImageUrl: process.env.NEXT_PUBLIC_DONATION_QRIS_IMAGE || '/images/QR Gopay.jpeg',
  saweriaUsername: process.env.NEXT_PUBLIC_DONATION_SAWERIA_USERNAME || 'sulistiyanugroho',
  saweriaUrl:
    process.env.NEXT_PUBLIC_DONATION_SAWERIA_URL ||
    `https://saweria.co/${process.env.NEXT_PUBLIC_DONATION_SAWERIA_USERNAME || 'sulistiyanugroho'}`,
  gopayNumber: process.env.NEXT_PUBLIC_DONATION_GOPAY_NUMBER || '0858-6789-1234',
  gopayName: process.env.NEXT_PUBLIC_DONATION_GOPAY_NAME || 'Sulistiya Nugroho',
  gopayUrl: process.env.NEXT_PUBLIC_DONATION_GOPAY_URL || 'https://gopay.co.id/',
};
