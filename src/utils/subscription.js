export const SUBSCRIPTION_BLOCK_CODES = [
  'SUBSCRIPTION_EXPIRED',
  'TRIAL_ENDED',
];

export const isSubscriptionBlockCode = (code) =>
  SUBSCRIPTION_BLOCK_CODES.includes(code);

export const getSubscriptionBlockFromProfile = (profile) => {
  if (!profile?.subscription) {
    return null;
  }
  const { requiresRenewal, code, message, company } = profile.subscription;
  if (!requiresRenewal) {
    return null;
  }
  return {
    code,
    message,
    companyId: profile.companyId,
    isCompanyAdmin: profile.isCompanyAdmin,
    company,
  };
};

export const getSubscriptionBlockFromLogin = (loginResponse) => {
  if (!loginResponse?.subscription?.requiresRenewal) {
    return null;
  }
  const { code, message, company } = loginResponse.subscription;
  return {
    code,
    message,
    companyId: loginResponse.user?.companyId,
    isCompanyAdmin: loginResponse.user?.isCompanyAdmin,
    company,
  };
};

export const formatPlanLabel = (plan) => {
  if (!plan) return '';
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

const CURRENCY_LOCALES = {
  NGN: 'en-NG',
  GBP: 'en-GB',
  USD: 'en-US',
};

export const formatMoney = (amount, currency = 'USD') => {
  if (amount == null) return '';
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
};

export const getRegionDisplay = (subscriptionData) => {
  if (!subscriptionData) return null;
  if (subscriptionData.regionLabel) {
    return subscriptionData.regionLabel;
  }
  if (subscriptionData.company?.regionLabel) {
    return subscriptionData.company.regionLabel;
  }
  const currency = subscriptionData.currency || subscriptionData.company?.currency;
  if (currency === 'NGN') return 'Africa';
  if (currency === 'GBP') return 'United Kingdom';
  return 'United States & International';
};
