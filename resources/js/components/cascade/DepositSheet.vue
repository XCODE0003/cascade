<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        open: boolean;
        defaultLevel?: number;
        balance?: number;
        walletAddress?: string;
        walletAmount?: number;
    }>(),
    {
        defaultLevel: 2,
        balance: 0,
    },
);

const emit = defineEmits<{
    close: [];
    confirm: [payload: { level: number; method: 'external' | 'internal' }];
}>();

type Method = 'external' | 'internal';

interface LevelOption {
    level: number;
    entry: number;
    payout: number;
    color: string;
}

const levels: LevelOption[] = [
    { level: 1, entry: 20, payout: 30, color: '#5AC8FA' },
    { level: 2, entry: 100, payout: 150, color: '#007AFF' },
    { level: 3, entry: 700, payout: 1050, color: '#5856D6' },
    { level: 4, entry: 2000, payout: 3000, color: '#AF52DE' },
];

const tab = ref<Method>('external');
const picked = ref<number>(props.defaultLevel);

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            picked.value = props.defaultLevel;
            tab.value = 'external';
        }
    },
);

const pickedLevel = computed(
    () => levels.find((l) => l.level === picked.value)!,
);
const insufficient = computed(
    () => tab.value === 'internal' && props.balance < pickedLevel.value.entry,
);

const confirmLabel = computed(() => {
    if (insufficient.value) {
        return 'Недостаточно средств';
    }

    return tab.value === 'external'
        ? 'Сгенерировать адрес'
        : `Списать ${pickedLevel.value.entry} USDT`;
});

function confirm() {
    if (insufficient.value) {
        return;
    }

    emit('confirm', { level: picked.value, method: tab.value });
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
                class="relative max-h-[calc(100vh-12px)] w-full overflow-y-auto rounded-t-[20px] bg-(--c-bg-card) p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] sm:max-h-[calc(100vh-48px)] sm:w-[440px] sm:rounded-[20px] sm:p-6 sm:pb-6"
                style="box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2)"
                @click.stop
            >
                <button
                    class="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg2);
                    "
                    @click="emit('close')"
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
                        <path d="M6 6l12 12M18 6l-12 12" />
                    </svg>
                </button>

                <!-- Step 2: wallet address display after external deposit created -->
                <template v-if="walletAddress">
                    <div
                        class="mb-2 text-[22px] font-semibold tracking-[-0.015em]"
                        style="
                            color: var(--c-fg1);
                            font-family: var(--c-font-display);
                        "
                    >
                        Адрес для оплаты
                    </div>
                    <div
                        class="mb-5 text-[13px] leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        Отправьте ровно
                        <strong style="color: var(--c-fg1)"
                            >{{ walletAmount }} USDT (TRC-20)</strong
                        >
                        на адрес ниже. После подтверждения транзакции
                        администратор активирует уровень.
                    </div>
                    <div
                        class="mb-5 rounded-[14px] px-4 py-4 text-center"
                        style="background: var(--c-bg-elevated)"
                    >
                        <div
                            class="text-sm font-semibold break-all"
                            style="
                                font-family: var(--c-font-mono);
                                color: var(--c-fg1);
                                word-break: break-all;
                            "
                        >
                            {{ walletAddress }}
                        </div>
                    </div>
                    <div
                        class="mb-5 flex gap-3.5 rounded-xl px-4 py-3.5"
                        style="background: var(--c-warning-bg)"
                    >
                        <svg
                            class="shrink-0"
                            width="15"
                            height="15"
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
                            Отправляйте только USDT в сети TRC-20. После
                            отправки средства будут зачислены администратором
                            вручную.
                        </div>
                    </div>
                    <button
                        class="h-11 w-full rounded-xl text-[15px] font-semibold text-white"
                        style="background: var(--c-accent)"
                        @click="emit('close')"
                    >
                        Понятно
                    </button>
                </template>

                <!-- Step 1: level & method selection -->
                <template v-else>
                    <div
                        class="mb-1 text-[22px] font-semibold tracking-[-0.015em]"
                        style="
                            color: var(--c-fg1);
                            font-family: var(--c-font-display);
                        "
                    >
                        Активировать уровень
                    </div>
                    <div class="mb-5 text-[13px]" style="color: var(--c-fg2)">
                        Выберите тариф и способ оплаты
                    </div>

                    <div
                        class="mb-[18px] flex gap-0.5 rounded-[11px] p-[3px]"
                        style="background: var(--c-bg-elevated)"
                    >
                        <button
                            class="flex-1 rounded-[9px] py-2 text-[13px] font-semibold transition-colors"
                            :style="
                                tab === 'external'
                                    ? 'background: var(--c-bg-active); color: var(--c-fg1); box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                                    : 'background: transparent; color: var(--c-fg1)'
                            "
                            @click="tab = 'external'"
                        >
                            Внешний кошелёк
                        </button>
                        <button
                            class="flex-1 rounded-[9px] py-2 text-[13px] font-semibold transition-colors"
                            :style="
                                tab === 'internal'
                                    ? 'background: var(--c-bg-active); color: var(--c-fg1); box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                                    : 'background: transparent; color: var(--c-fg1)'
                            "
                            @click="tab = 'internal'"
                        >
                            С баланса · {{ balance }} USDT
                        </button>
                    </div>

                    <div class="flex flex-col gap-2">
                        <button
                            v-for="l in levels"
                            :key="l.level"
                            class="flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-left transition-all duration-160"
                            :style="
                                picked === l.level
                                    ? `border: 1.5px solid ${l.color}; box-shadow: 0 0 0 4px ${l.color}1A`
                                    : 'border: 1.5px solid transparent; box-shadow: inset 0 0 0 1px var(--c-hairline)'
                            "
                            @click="picked = l.level"
                        >
                            <span
                                class="h-2.5 w-2.5 rounded-full"
                                :style="{ background: l.color }"
                            />
                            <div>
                                <div
                                    class="text-sm font-semibold"
                                    style="color: var(--c-fg1)"
                                >
                                    Level {{ l.level }}
                                </div>
                                <div
                                    class="mt-px text-xs"
                                    style="color: var(--c-fg3)"
                                >
                                    Цикл 150% · выплата {{ l.payout }} USDT
                                </div>
                            </div>
                            <div
                                class="ml-auto text-sm font-semibold"
                                style="
                                    color: var(--c-fg1);
                                    font-family: var(--c-font-mono);
                                "
                            >
                                {{ l.entry }} USDT
                            </div>
                        </button>
                    </div>

                    <div
                        class="mt-3.5 flex gap-2.5 rounded-xl px-3.5 py-3 text-xs leading-snug"
                        style="
                            background: var(--c-accent-bg);
                            color: var(--c-accent-press);
                        "
                    >
                        <svg
                            class="shrink-0"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v.01M12 11v5" />
                        </svg>
                        <span>
                            Комиссия сервиса <strong>10%</strong> удерживается
                            при активации. В очередь поступает
                            <strong>90%</strong> суммы по правилу каскада.
                        </span>
                    </div>

                    <div class="mt-5 flex gap-2">
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
                            :disabled="insufficient"
                            class="h-11 flex-1 rounded-xl text-[15px] font-semibold text-white"
                            style="background: var(--c-accent)"
                            :class="
                                insufficient
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                            "
                            @click="confirm"
                        >
                            {{ confirmLabel }}
                        </button>
                    </div>
                </template>
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
