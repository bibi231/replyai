export function openPaystackPopup(options) {
    const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: options.email,
        amount: options.amount,
        ref: options.reference,
        currency: 'NGN',
        callback: function (response) {
            options.onSuccess(response.reference);
        },
        onClose: function () {
            options.onClose();
        },
    });
    handler.openIframe();
}
