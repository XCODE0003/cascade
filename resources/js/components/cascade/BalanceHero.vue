<script setup lang="ts">
defineProps<{
    balance: number;
    canWithdraw: boolean;
}>();

const emit = defineEmits<{
    deposit: [];
    withdraw: [];
}>();

function fmt(n: number): string {
    return n.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
</script>

<template>
    <div
        class="relative overflow-hidden rounded-3xl bg-(--c-bg-card) px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <!-- radial glow -->
        <div
            class="pointer-events-none absolute -top-28 -right-20 h-[360px] w-[360px] rounded-full"
            style="
                background: radial-gradient(
                    closest-side,
                    rgba(0, 122, 255, 0.08),
                    transparent
                );
            "
        />

        <div class="relative z-10 min-w-0">
            <div
                class="text-[13px] font-semibold tracking-[-0.005em]"
                style="color: var(--c-fg2)"
            >
                Внутренний баланс
            </div>
            <div
                class="mt-1.5 text-[42px] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[48px] lg:text-[56px]"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-display);
                    font-variant-numeric: tabular-nums;
                "
            >
                {{ fmt(balance)
                }}<span
                    class="ml-2 text-xl font-medium sm:text-2xl"
                    style="color: var(--c-fg3)"
                    >USDT</span
                >
            </div>
        </div>

        <div class="relative z-10 mt-4 grid grid-cols-2 gap-2.5 sm:flex sm:shrink-0">
            <button
                class="flex h-11 min-w-0 items-center justify-center gap-2 rounded-[14px] px-3 text-[14px] font-semibold transition-transform duration-160 active:scale-95 sm:px-[22px] sm:text-[15px]"
                style="background: var(--c-bg-elevated); color: var(--c-fg1)"
                @click="emit('deposit')"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Пополнить
            </button>
            <button
                :disabled="!canWithdraw"
                class="flex h-11 min-w-0 items-center justify-center gap-2 rounded-[14px] px-3 text-[14px] font-semibold transition-transform duration-160 sm:px-[22px] sm:text-[15px]"
                :class="canWithdraw ? 'active:scale-95' : 'cursor-not-allowed'"
                :style="
                    canWithdraw
                        ? 'background: var(--c-accent); color: #fff'
                        : 'background: var(--c-bg-elevated); color: var(--c-fg3)'
                "
                @click="canWithdraw && emit('withdraw')"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 19V5M6 11l6-6 6 6" />
                </svg>
                Вывод
            </button>
        </div>
    </div>
</template>
