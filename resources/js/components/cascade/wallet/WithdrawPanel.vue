<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';

const props = withDefaults(
    defineProps<{
        balance?: number;
        minWithdrawal?: number;
    }>(),
    {
        balance: 0,
        minWithdrawal: 30,
    },
);

const amount = ref('');
const address = ref('');

const numericAmount = computed<number>(() => parseFloat(amount.value) || 0);

const valid = computed<boolean>(
    () =>
        numericAmount.value >= props.minWithdrawal &&
        numericAmount.value <= props.balance &&
        address.value.length > 4,
);

const submitLabel = computed<string>(() => {
    if (numericAmount.value > 0 && numericAmount.value < props.minWithdrawal) {
        return `Минимум ${props.minWithdrawal} USDT`;
    }

    if (numericAmount.value > props.balance) {
        return 'Недостаточно средств';
    }

    return 'Создать заявку';
});

const formattedBalance = computed<string>(() =>
    props.balance.toLocaleString('ru-RU'),
);

function onAmountInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    amount.value = target.value.replace(/[^0-9.,]/g, '');
}

function setMin(): void {
    amount.value = String(props.minWithdrawal);
}

function setHalf(): void {
    amount.value = String(Math.floor(props.balance / 2));
}

function setAll(): void {
    amount.value = String(props.balance);
}

function submit(): void {
    if (!valid.value) return;
    router.post(
        '/withdrawals',
        { amount: numericAmount.value, wallet_address: address.value },
        {
            preserveScroll: true,
            onSuccess: () => {
                amount.value = '';
                address.value = '';
            },
        },
    );
}
</script>

<template>
    <div
        class="flex min-w-0 flex-col gap-3.5 rounded-[20px] bg-(--c-bg-card) px-4 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-[22px]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-baseline gap-2.5">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Вывод средств
            </div>
            <div class="text-xs" style="color: var(--c-fg3)">
                Без комиссии · TRC-20
            </div>
        </div>

        <div
            class="flex items-center justify-between rounded-xl px-3.5 py-3"
            style="background: var(--c-bg-elevated)"
        >
            <span class="text-xs" style="color: var(--c-fg2)"
                >Доступно к выводу</span
            >
            <span
                class="text-sm font-semibold"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-mono);
                    font-variant-numeric: tabular-nums;
                "
                >{{ formattedBalance }} USDT</span
            >
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold" style="color: var(--c-fg2)"
                >Сумма</label
            >
            <input
                :value="amount"
                class="h-11 rounded-[11px] border-0 bg-(--c-bg-card) px-3.5 text-[18px] font-semibold outline-none"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-mono);
                    font-variant-numeric: tabular-nums;
                    box-shadow: inset 0 0 0 1px var(--c-input-border);
                "
                placeholder="0,00"
                @input="onAmountInput"
            />
            <div class="mt-1.5 flex flex-wrap gap-1.5">
                <button
                    class="rounded-full border-0 px-[11px] py-[5px] text-xs font-semibold"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg1);
                    "
                    @click="setMin"
                >
                    Мин. {{ props.minWithdrawal }}
                </button>
                <button
                    class="rounded-full border-0 px-[11px] py-[5px] text-xs font-semibold"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg1);
                    "
                    @click="setHalf"
                >
                    50%
                </button>
                <button
                    class="rounded-full border-0 px-[11px] py-[5px] text-xs font-semibold"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg1);
                    "
                    @click="setAll"
                >
                    Всё
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold" style="color: var(--c-fg2)"
                >Адрес кошелька</label
            >
            <input
                v-model="address"
                class="h-11 rounded-[11px] border-0 bg-(--c-bg-card) px-3.5 text-[15px] outline-none"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-text);
                    box-shadow: inset 0 0 0 1px var(--c-input-border);
                "
                placeholder="TRC-20 адрес"
            />
        </div>

        <div
            class="flex gap-2.5 rounded-[10px] px-3 py-2.5 text-xs leading-[1.45]"
            style="background: var(--c-warning-bg); color: var(--c-warning-fg)"
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
                Заявка получит статус «В ожидании выплаты», ваши записи в
                очередях перейдут в серый статус. Холд — 72 часа. Минимальная
                сумма — {{ props.minWithdrawal }} USDT.
            </span>
        </div>

        <button
            :disabled="!valid"
            class="mt-1 h-11 rounded-xl border-0 text-sm font-semibold"
            :class="valid ? 'cursor-pointer' : 'cursor-not-allowed'"
            :style="
                valid
                    ? 'background: var(--c-accent); color: #fff'
                    : 'background: var(--c-bg-elevated); color: var(--c-fg3)'
            "
            @click="submit"
        >
            {{ submitLabel }}
        </button>
    </div>
</template>
