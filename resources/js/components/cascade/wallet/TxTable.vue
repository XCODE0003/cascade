<script setup lang="ts">
import { computed, ref } from 'vue';

type TxKind = 'deposit' | 'withdraw';
type TxStatus = 'done' | 'hold' | 'pending' | 'rejected';
type FilterKey = 'all' | TxKind;

interface Tx {
    id: string;
    kind: TxKind;
    amount: number;
    status: TxStatus;
    date: string;
    hash: string;
}

interface DepositRow {
    id: string;
    level: number;
    amount: number;
    type: string;
    status: string;
    wallet_address: string;
    created: string;
}

interface WithdrawalRow {
    id: string;
    amount: number;
    status: string;
    wallet_address: string;
    hold_until: string | null;
    created: string;
}

// [background, foreground, dot, label]
type PillSpec = [string, string, string, string];

const PILLS: Record<TxStatus, PillSpec> = {
    done: [
        'var(--c-success-bg)',
        'var(--c-success-fg)',
        'var(--c-success)',
        'Подтверждена',
    ],
    hold: [
        'var(--c-accent-bg)',
        'var(--c-accent-press)',
        'var(--c-accent)',
        'Холд 72 ч',
    ],
    pending: [
        'var(--c-warning-bg)',
        'var(--c-warning-fg)',
        'var(--c-warning)',
        'В ожидании',
    ],
    rejected: [
        'var(--c-danger-bg)',
        'var(--c-danger-fg)',
        'var(--c-danger)',
        'Отклонена',
    ],
};

const DEPOSIT_STATUS: Record<string, TxStatus> = {
    approved: 'done',
    pending: 'pending',
    rejected: 'rejected',
};

const WITHDRAWAL_STATUS: Record<string, TxStatus> = {
    approved: 'done',
    hold: 'hold',
    pending: 'pending',
    rejected: 'rejected',
};

const props = withDefaults(
    defineProps<{
        deposits?: DepositRow[];
        withdrawals?: WithdrawalRow[];
    }>(),
    { deposits: () => [], withdrawals: () => [] },
);

const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'deposit', label: 'Депозиты' },
    { key: 'withdraw', label: 'Выводы' },
];

const filter = ref<FilterKey>('all');

const allTxs = computed<Tx[]>(() => {
    const deps: Tx[] = props.deposits.map((d) => ({
        id: d.id,
        kind: 'deposit',
        amount: d.amount,
        status: DEPOSIT_STATUS[d.status] ?? 'pending',
        date: d.created,
        hash: d.wallet_address || '—',
    }));
    const wds: Tx[] = props.withdrawals.map((w) => ({
        id: w.id,
        kind: 'withdraw',
        amount: w.amount,
        status: WITHDRAWAL_STATUS[w.status] ?? 'pending',
        date: w.created,
        hash: w.wallet_address || '—',
    }));
    return [...deps, ...wds];
});

const filtered = computed<Tx[]>(() =>
    filter.value === 'all'
        ? allTxs.value
        : allTxs.value.filter((t) => t.kind === filter.value),
);

function formatAmount(value: number): string {
    return value
        .toLocaleString('ru-RU', { minimumFractionDigits: 2 })
        .replace(/,/g, ' ')
        .replace(/\s(\d{2})$/, ',$1');
}
</script>

<template>
    <div
        class="overflow-hidden rounded-[18px] bg-[var(--c-bg-card)]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-baseline gap-3 px-6 pt-[18px] pb-3.5">
            <div>
                <div
                    class="text-[18px] font-semibold tracking-[-0.01em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Транзакции
                </div>
                <div class="text-xs" style="color: var(--c-fg3)">
                    Депозиты и заявки на вывод
                </div>
            </div>
            <div
                class="ml-auto inline-flex gap-0.5 rounded-[9px] p-0.5"
                style="background: var(--c-bg-elevated)"
            >
                <button
                    v-for="f in filters"
                    :key="f.key"
                    class="rounded-[7px] px-[11px] py-[5px] text-xs font-semibold"
                    style="color: var(--c-fg1)"
                    :style="
                        filter === f.key
                            ? 'background: var(--c-bg-active); box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                            : 'background: transparent'
                    "
                    @click="filter = f.key"
                >
                    {{ f.label }}
                </button>
            </div>
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="header in [
                            'ID',
                            'Тип',
                            'Сумма',
                            'Адрес',
                            'Дата',
                            'Статус',
                        ]"
                        :key="header"
                        class="px-6 py-3 text-left text-[11px] font-semibold tracking-[0.04em] uppercase"
                        style="
                            color: var(--c-fg3);
                            background: var(--c-bg);
                            border-top: 1px solid var(--c-hairline);
                            border-bottom: 1px solid var(--c-hairline);
                        "
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="filtered.length === 0">
                    <td
                        colspan="6"
                        class="px-6 py-8 text-center text-[13px]"
                        style="color: var(--c-fg3)"
                    >
                        Транзакций пока нет
                    </td>
                </tr>
                <tr v-for="t in filtered" :key="t.id">
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg2);
                            font-family: var(--c-font-mono);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        {{ t.id }}
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg1);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        <span class="inline-flex items-center gap-2">
                            <span
                                class="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full"
                                :style="
                                    t.kind === 'deposit'
                                        ? 'background: var(--c-success-bg); color: var(--c-success)'
                                        : 'background: var(--c-accent-bg); color: var(--c-accent)'
                                "
                            >
                                <svg
                                    v-if="t.kind === 'deposit'"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M12 5v14M6 13l6 6 6-6" />
                                </svg>
                                <svg
                                    v-else
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M12 19V5M6 11l6-6 6 6" />
                                </svg>
                            </span>
                            {{ t.kind === 'deposit' ? 'Пополнение' : 'Вывод' }}
                        </span>
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="border-bottom: 1px solid var(--c-hairline-soft)"
                    >
                        <span
                            class="font-semibold"
                            :style="{
                                fontFamily: 'var(--c-font-mono)',
                                fontVariantNumeric: 'tabular-nums',
                                color:
                                    t.kind === 'deposit'
                                        ? 'var(--c-success)'
                                        : 'var(--c-danger)',
                            }"
                        >
                            {{ t.kind === 'deposit' ? '+' : '−'
                            }}{{ formatAmount(t.amount) }} USDT
                        </span>
                    </td>
                    <td
                        class="px-6 py-3.5 text-[11px]"
                        style="
                            color: var(--c-fg3);
                            font-family: var(--c-font-mono);
                            border-bottom: 1px solid var(--c-hairline-soft);
                            max-width: 160px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        "
                    >
                        {{ t.hash }}
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg3);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        {{ t.date }}
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg1);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-[9px] py-[3px] text-[11px] font-semibold"
                            :style="{
                                background: PILLS[t.status][0],
                                color: PILLS[t.status][1],
                            }"
                        >
                            <span
                                class="h-1.5 w-1.5 rounded-full"
                                :style="{ background: PILLS[t.status][2] }"
                            />{{ PILLS[t.status][3] }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
