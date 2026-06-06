const PAYSTACK_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

export function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }

    const existing = document.querySelector(`script[src="${PAYSTACK_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.PaystackPop));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/**
 * Open Paystack inline checkout. Resolves with payment reference on success.
 */
export async function openPaystackCheckout({
  publicKey,
  email,
  amount,
  currency = 'NGN',
  reference,
  accessCode,
  onClose,
}) {
  const PaystackPop = await loadPaystackScript();

  return new Promise((resolve, reject) => {
    const handler = PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      currency,
      ref: reference,
      access_code: accessCode,
      onClose: () => {
        onClose?.();
        reject(new Error('Payment cancelled'));
      },
      callback: (response) => {
        resolve(response.reference || reference);
      },
    });

    handler.openIframe();
  });
}
