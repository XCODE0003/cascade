<script setup lang="ts">
import { computed, ref } from 'vue';

type HistoryKind = 'ref' | 'cell' | 'reinv' | 'hold' | 'deposit';
type AmountSign = 'pos' | 'neg' | 'gold' | 'warn' | 'neu';

export interface HistoryRow {
    kind: HistoryKind;
    title: string;
    sub: string;
    amount: string;
    sign: AmountSign;
    time: string;
}

const props = withDefaults(
    defineProps<{
        rows?: HistoryRow[];
    }>(),
    {
        rows: () => [],
    },
);

type FilterKey = 'all' | 'income' | 'out' | 'hold';

const filter = ref<FilterKey>('all');

const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'income', label: 'Доходы' },
    { key: 'out', label: 'Расходы' },
    { key: 'hold', label: 'Холд' },
];

const visibleRows = computed(() => {
    if (filter.value === 'all') {
        return props.rows;
    }

    return props.rows.filter((row) => {
        switch (filter.value) {
            case 'income':
                return row.sign === 'pos' || row.sign === 'gold';
            case 'out':
                return row.sign === 'neg';
            case 'hold':
                return row.sign === 'warn' || row.kind === 'hold';
            default:
                return true;
        }
    });
});

const iconBg: Record<HistoryKind, [string, string]> = {
    ref: ['var(--c-success-bg)', 'var(--c-success)'],
    cell: ['var(--c-gold-bg)', 'var(--c-gold)'],
    reinv: ['var(--c-danger-bg)', 'var(--c-danger)'],
    hold: ['var(--c-warning-bg)', 'var(--c-warning)'],
    deposit: ['var(--c-accent-bg)', 'var(--c-accent)'],
};

const iconGlyph: Record<HistoryKind, string> = {
    ref: '+',
    cell: '●',
    reinv: '↻',
    hold: '⏳',
    deposit: '↓',
};

function amountColor(sign: AmountSign): string {
    switch (sign) {
        case 'pos':
            return 'var(--c-success)';
        case 'neg':
            return 'var(--c-danger)';
        case 'gold':
            return 'var(--c-gold)';
        case 'warn':
            return 'var(--c-warning)';
        default:
            return 'var(--c-fg1)';
    }
}
</script>

<template>
    <div
        class="overflow-hidden rounded-[20px] bg-[var(--c-bg-card)]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-center gap-3 px-[22px] pt-[18px] pb-3.5">
            <div
                class="text-[17px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                История операций
            </div>
            <div
                class="ml-auto inline-flex gap-0.5 rounded-[9px] p-0.5"
                style="background: var(--c-bg-elevated)"
            >
                <button
                    v-for="f in filters"
                    :key="f.key"
                    class="rounded-[7px] px-[11px] py-[5px] text-xs font-semibold transition-colors"
                    :style="
                        filter === f.key
                            ? 'background: var(--c-bg-active); color: var(--c-fg1); box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                            : 'background: transparent; color: var(--c-fg1)'
                    "
                    @click="filter = f.key"
                >
                    {{ f.label }}
                </button>
            </div>
        </div>

        <div
            v-if="visibleRows.length === 0"
            class="px-[22px] py-10 text-center text-[13px]"
            style="
                color: var(--c-fg3);
                border-top: 1px solid var(--c-hairline-soft);
            "
        >
            Операций пока нет
        </div>

        <div
            v-for="(row, i) in visibleRows"
            :key="i"
            class="flex items-center gap-3.5 px-[22px] py-3"
            style="border-top: 1px solid var(--c-hairline-soft)"
        >
            <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                :style="{
                    background: iconBg[row.kind][0],
                    color: iconBg[row.kind][1],
                }"
            >
                {{ iconGlyph[row.kind] }}
            </div>
            <div class="min-w-0 flex-1">
                <div
                    class="text-[13px] font-semibold"
                    style="color: var(--c-fg1)"
                >
                    {{ row.title }}
                </div>
                <div class="mt-0.5 text-xs" style="color: var(--c-fg3)">
                    {{ row.sub }}
                </div>
            </div>
            <div
                class="text-sm font-semibold"
                :style="{
                    color: amountColor(row.sign),
                    fontFamily: 'var(--c-font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                }"
            >
                {{ row.amount }} USDT
            </div>
            <div
                class="text-[11px]"
                style="color: var(--c-fg3); font-family: var(--c-font-mono)"
            >
                {{ row.time }}
            </div>
        </div>
    </div>
</template>
