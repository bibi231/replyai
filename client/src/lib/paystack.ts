export function openPaystackPopup(options: {
    reference: string;
    email: string;
    amount: number;
    onSuccess: (ref: string) => void;
    onClose: () => void;
}): void {
    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
        alert('Payment gateway still loading. Please wait a moment and try again.');
        return;
    }
    const handler = PaystackPop.setup({
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
