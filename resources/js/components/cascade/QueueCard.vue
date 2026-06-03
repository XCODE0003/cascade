<script setup lang="ts">
import { computed } from 'vue';

type QueueStatus = 'ready' | 'locked' | 'inactive' | 'pending';

const props = withDefaults(
    defineProps<{
        level: number;
        entry: number;
        payout: number;
        filled: number;
        bonus?: number;
        status: QueueStatus;
        timer?: string | null;
        autoReinvest: boolean;
    }>(),
    { bonus: 0 },
);

// Bonus (referral) cells render gold; regular cascade cells render green.
// The gold ones are shown as the last `bonus` of the filled cells.
function cellKind(i: number): 'bonus' | 'filled' | 'empty' {
    if (i > props.filled) {
        return 'empty';
    }

    return i > props.filled - props.bonus ? 'bonus' : 'filled';
}

const emit = defineEmits<{
    activate: [];
    reinvest: [];
    upgrade: [];
    toggleAuto: [];
}>();

const levelColors: Record<number, string> = {
    1: 'var(--c-level-1)',
    2: 'var(--c-level-2)',
    3: 'var(--c-level-3)',
    4: 'var(--c-level-4)',
};

const isReady = computed(() => props.status === 'ready');
const isInactive = computed(() => props.status === 'inactive');
const isLocked = computed(() => props.status === 'locked');
const isPending = computed(() => props.status === 'pending');

const ratio = computed(() => `${props.filled} / 5`);

const timerColor = computed(() => {
    switch (props.status) {
        case 'ready':
            return 'var(--c-success)';
        case 'locked':
            return 'var(--c-accent)';
        case 'inactive':
            return 'var(--c-fg3)';
        default:
            return 'var(--c-fg2)';
    }
});

function fmt(n: number): string {
    return n.toLocaleString('ru-RU').replace(/,/g, ' ');
}
</script>

<template>
    <div
        class="flex flex-col gap-4 rounded-[20px] bg-[var(--c-bg-card)] px-[22px] pt-5 pb-[22px]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <!-- head -->
        <div class="flex items-start justify-between">
            <div
                class="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase"
                style="color: var(--c-fg2)"
            >
                <span
                    class="h-2 w-2 rounded-full"
                    :style="{ background: levelColors[level] }"
                />
                Level {{ level }}
            </div>
            <div
                class="text-[13px] font-semibold"
                style="
                    color: var(--c-fg2);
                    font-family: var(--c-font-mono);
                    font-variant-numeric: tabular-nums;
                "
            >
                {{ isInactive ? 'не активен' : ratio }}
            </div>
        </div>

        <!-- amount -->
        <div>
            <div
                class="text-[28px] font-bold tracking-[-0.02em]"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-display);
                    font-variant-numeric: tabular-nums;
                "
            >
                {{ fmt(entry)
                }}<span
                    class="ml-1.5 text-[15px] font-medium"
                    style="color: var(--c-fg3)"
                    >USDT</span
                >
            </div>
            <div class="mt-0.5 text-xs" style="color: var(--c-fg3)">
                Выплата за цикл: {{ fmt(payout) }} USDT
            </div>
        </div>

        <!-- cells -->
        <div class="flex gap-[5px]">
            <div
                v-for="i in 5"
                :key="i"
                class="h-8 flex-1 rounded-lg transition-all duration-[160ms]"
                :style="
                    cellKind(i) === 'bonus'
                        ? 'background: var(--c-cell-bonus)'
                        : cellKind(i) === 'filled'
                          ? 'background: var(--c-success)'
                          : 'background: var(--c-bg-elevated); box-shadow: inset 0 0 0 1px var(--c-hairline)'
                "
            />
        </div>

        <!-- status row -->
        <div class="flex items-center justify-between text-xs">
            <div
                class="inline-flex items-center gap-1.5 text-[13px] font-medium"
                :style="{ color: timerColor }"
            >
                <template v-if="isReady">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M5 12l5 5 9-11" />
                    </svg>
                    Готов к выводу
                </template>
                <template v-else-if="isLocked">
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    Замок: {{ timer }}
                </template>
                <template v-else-if="isInactive">Не активирован</template>
                <template v-else-if="isPending"
                    >В ожидании: {{ timer }}</template
                >
            </div>
        </div>

        <!-- actions -->
        <div class="mt-1 flex gap-2">
            <button
                v-if="isInactive"
                class="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[13px] font-semibold text-white transition-transform duration-[160ms] active:scale-95"
                style="background: var(--c-accent)"
                @click="emit('activate')"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Активировать
            </button>
            <template v-else>
                <button
                    :disabled="isLocked"
                    class="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[13px] font-semibold transition-transform duration-[160ms]"
                    :class="isLocked ? 'cursor-not-allowed' : 'active:scale-95'"
                    :style="
                        isReady
                            ? 'background: var(--c-success); color: #fff'
                            : isLocked
                              ? 'background: var(--c-bg-elevated); color: var(--c-fg3)'
                              : 'background: var(--c-bg-elevated); color: var(--c-fg1)'
                    "
                    @click="!isLocked && emit('reinvest')"
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M21 12a9 9 0 1 1-3-6.7" />
                        <path d="M21 4v5h-5" />
                    </svg>
                    Реинвест
                </button>
                <button
                    class="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[13px] font-semibold transition-transform duration-[160ms] active:scale-95"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg1);
                    "
                    @click="emit('upgrade')"
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 19V5M6 11l6-6 6 6" />
                    </svg>
                    Апгрейд
                </button>
            </template>
        </div>

        <!-- auto toggle -->
        <div
            v-if="!isInactive"
            class="mt-0.5 flex items-center gap-2.5 pt-3"
            style="border-top: 1px solid var(--c-hairline-soft)"
        >
            <span class="flex-1 text-[13px]" style="color: var(--c-fg2)"
                >Авто-вход после цикла</span
            >
            <button
                class="relative h-[22px] w-9 rounded-full transition-colors duration-[160ms]"
                :style="
                    autoReinvest
                        ? 'background: var(--c-success)'
                        : 'background: #e5e5ea'
                "
                @click="emit('toggleAuto')"
            >
                <span
                    class="absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-[var(--c-knob)] transition-transform duration-[160ms]"
                    style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15)"
                    :style="
                        autoReinvest
                            ? 'transform: translateX(14px)'
                            : 'transform: translateX(0)'
                    "
                />
            </button>
        </div>
    </div>
</template>
