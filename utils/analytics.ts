/**
 * Google Ads & Google Tag (gtag.js) Analytics Utility
 * Batimove SaaS
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Google Ads ID configuration with fallback to production ID
export const GOOGLE_ADS_ID: string =
  (import.meta.env.VITE_GOOGLE_ADS_ID as string) || 'AW-18400207296';

// Google Ads Conversion Label for "Lead - Formulaire Devis"
export const GOOGLE_ADS_LEAD_CONVERSION_LABEL: string =
  (import.meta.env.VITE_GOOGLE_ADS_LEAD_CONVERSION_LABEL as string) || '7iQmCIrW8uQcEMDD88VE';

// Deduplication cache to prevent double firing (e.g. re-renders, strict mode, retry)
const processedLeadConversions = new Set<string>();

/**
 * Helper to safely call window.gtag
 */
export const gtag = (...args: any[]): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
  } else {
    // Queue call onto dataLayer if gtag not ready yet
    window.dataLayer.push(arguments);
  }
};

/**
 * Update Google Consent Mode v2
 */
export const updateGoogleConsent = (granted: boolean): void => {
  const status = granted ? 'granted' : 'denied';
  
  gtag('consent', 'update', {
    ad_storage: status,
    analytics_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });

  if (import.meta.env.DEV) {
    console.log('[GoogleAds] Consent updated:', status);
  }
};

/**
 * Track SPA Page Views with Google Ads / Google Tag
 */
export const trackPageView = (path: string): void => {
  if (!GOOGLE_ADS_ID) return;

  gtag('config', GOOGLE_ADS_ID, {
    page_path: path,
  });

  if (import.meta.env.DEV) {
    console.log('[GoogleAds] Page view tracked:', path);
  }
};

export interface LeadConversionOptions {
  leadId?: string;
  value?: number;
  currency?: string;
}

/**
 * Track "Lead - Formulaire Devis" Conversion
 * Primary conversion: SUBMIT_LEAD_FORM (Count: ONE)
 * send_to: AW-18400207296/7iQmCIrW8uQcEMDD88VE
 * 
 * Rules:
 * - Only fires on successful API response
 * - Protected against double submits & duplicate triggers
 * - No PII (personally identifiable information) is logged
 */
export const trackGoogleAdsLeadConversion = (options: LeadConversionOptions = {}): boolean => {
  if (typeof window === 'undefined') return false;

  const { leadId, value, currency = 'CHF' } = options;

  // Deduplication check
  if (leadId) {
    if (processedLeadConversions.has(leadId)) {
      if (import.meta.env.DEV) {
        console.warn('[GoogleAds] Lead conversion already sent for ID:', leadId);
      }
      return false;
    }
    processedLeadConversions.add(leadId);
  }

  // Exact send_to target format: AW-18400207296/7iQmCIrW8uQcEMDD88VE
  const sendTo = GOOGLE_ADS_LEAD_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_CONVERSION_LABEL}`
    : `${GOOGLE_ADS_ID}/7iQmCIrW8uQcEMDD88VE`;

  const conversionPayload: Record<string, any> = {
    send_to: sendTo,
  };

  if (leadId) {
    conversionPayload.transaction_id = leadId;
  }

  if (typeof value === 'number' && !isNaN(value)) {
    conversionPayload.value = value;
    conversionPayload.currency = currency;
  }

  // Call gtag event conversion
  gtag('event', 'conversion', conversionPayload);

  if (import.meta.env.DEV) {
    console.log('[GoogleAds] Lead conversion fired successfully for send_to:', sendTo);
  }

  return true;
};

/**
 * Google Ads Phone Call Tracking (Google Forwarding Number)
 * Snippet: gtag('config', 'AW-18400207296/WzxDCM6v_OYcEMDD88VE', { 'phone_conversion_number': '079 889 64 06' })
 */
export const trackPhoneConversionNumber = (phone: string = '079 889 64 06'): void => {
  gtag('config', 'AW-18400207296/WzxDCM6v_OYcEMDD88VE', {
    phone_conversion_number: phone,
  });

  if (import.meta.env.DEV) {
    console.log('[GoogleAds] Phone call conversion config registered for:', phone);
  }
};

