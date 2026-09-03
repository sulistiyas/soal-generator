/**
 * Helper Pelacakan Google Analytics 4 (GA4) & Custom Events
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-22467Q8ZFB';

/**
 * Kirim Pageview ke Google Analytics
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) return;
  try {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  } catch (err) {
    console.debug('[GA] pageview tracking error:', err);
  }
}

/**
 * Kirim Custom Event ke Google Analytics
 * @param action Nama event (misal: 'generate_exam', 'export_docx', 'share_link')
 * @param params Parameter tambahan (misal: { subject: 'Matematika', grade: 'Kelas 4' })
 */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean | undefined | null>
) {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) return;
  try {
    window.gtag('event', action, params);
  } catch (err) {
    console.debug('[GA] event tracking error:', err);
  }
}
