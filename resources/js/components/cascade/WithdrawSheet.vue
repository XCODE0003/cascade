<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    open: boolean;
    balance: number;
}>();

const emit = defineEmits<{
    close: [];
    confirm: [payload: { wallet_address: string }];
}>();

const walletAddress = ref('');

function fmt(n: number): string {
    return n.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function submit() {
    if (!walletAddress.value.trim()) {
        return;
    }

    emit('confirm', { wallet_address: walletAddress.value.trim() });
    walletAddress.value = '';
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-100 flex items-end justify-center sm:items-center"
            style="
                background: rgba(0, 0, 0, 0.32);
                animation: cascade-fade 200ms ease;
            "
            @click="emit('close')"
        >
            <div
                class="relative max-h-[calc(100vh-12px)] w-full overflow-y-auto rounded-t-[20px] bg-(--c-bg-card) p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] sm:max-h-[calc(100vh-48px)] sm:w-[420px] sm:rounded-[20px] sm:p-6 sm:pb-6"
                style="box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2)"
                @click.stop
            >
                <div
                    class="mb-1.5 text-[22px] font-semibold tracking-[-0.015em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Подтвердите вывод
                </div>
                <div
                    class="mb-[18px] text-[13px] leading-relaxed"
                    style="color: var(--c-fg2)"
                >
                    На внешний кошелёк будет отправлено
                    <strong style="color: var(--c-fg1)"
                        >{{ fmt(balance) }} USDT</strong
                    >. Заявка получит статус
                    <strong style="color: var(--c-warning)"
                        >«В ожидании выплаты»</strong
                    >
                    и будет обработана в течение 72&nbsp;часов.
                </div>

                <div
                    class="mb-[18px] flex gap-4 rounded-xl px-4 py-3.5"
                    style="background: var(--c-warning-bg)"
                >
                    <svg
                        class="shrink-0"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--c-warning)"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v.01M12 11v5" />
                    </svg>
                    <div
                        class="text-xs leading-relaxed"
                        style="color: var(--c-warning-fg)"
                    >
                        В момент подачи заявки счётчик ячеек обнулится, ваши
                        записи в очередях получат статус «Неактивен» до
                        подтверждения выплаты.
                    </div>
                </div>

                <div class="mb-5">
                    <label
                        class="mb-1.5 block text-xs font-semibold"
                        style="color: var(--c-fg2)"
                        >Адрес TRC-20 кошелька</label
                    >
                    <input
                        v-model="walletAddress"
                        placeholder="T..."
                        class="w-full rounded-[11px] px-4 py-3 text-[13px] outline-none"
                        style="
                            box-shadow: inset 0 0 0 1px var(--c-input-border);
                            font-family: var(--c-font-mono);
                            color: var(--c-fg1);
                        "
                    />
                </div>

                <div class="flex gap-2">
                    <button
                        class="h-11 flex-1 rounded-xl text-[15px] font-semibold"
                        style="
                            background: var(--c-bg-elevated);
                            color: var(--c-fg1);
                        "
                        @click="emit('close')"
                    >
                        Отмена
                    </button>
                    <button
                        class="h-11 flex-1 rounded-xl text-[15px] font-semibold text-white"
                        style="background: var(--c-accent)"
                        :style="{
                            opacity: walletAddress.trim() ? 1 : 0.5,
                            cursor: walletAddress.trim()
                                ? 'pointer'
                                : 'default',
                        }"
                        :disabled="!walletAddress.trim()"
                        @click="submit"
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
@keyframes cascade-fade {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
