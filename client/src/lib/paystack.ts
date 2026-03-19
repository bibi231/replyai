export function openPaystackPopup(options: {
    reference: string;
    email: string;
    amount: number;
    onSuccess: (ref: string) => void;
    onClose: () => void;
}): void {
    const handler = (window as any).PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: options.email,
        amount: options.amount,
        ref: options.reference,
        currency: 'NGN',
        callback: function (response: any) {
            options.onSuccess(response.reference);
        },
        onClose: function () {
            options.onClose();
        },
    });
    handler.openIframe();
}
