import { router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import type { FlashToast } from '@/types/ui';

type FlashBag = {
    success?: string | null;
    error?: string | null;
    toast?: FlashToast;
};

/**
 * Surface server flash messages as toasts. Inertia fires a `success` event on
 * every completed (non-failed) visit, including the redirect that carries
 * `flash.success` / `flash.error` after a POST. Reading the resolved page props
 * here covers deposits, withdrawals, reinvests, and all admin actions with a
 * single listener.
 */
export function initializeFlashToast(): void {
    router.on('success', (event) => {
        const flash = (event as CustomEvent).detail?.page?.props?.flash as
            | FlashBag
            | undefined;

        if (!flash) {
            return;
        }

        if (flash.toast?.message) {
            toast[flash.toast.type](flash.toast.message);
        }

        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    });
}
