export const tracking = {
  trackEvent: (category: string, action: string, metadata?: any) => {
    console.log('[TRACKING]', category, action, metadata);
  }
};
