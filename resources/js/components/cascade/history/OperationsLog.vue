<script setup lang="ts">
import { computed, ref } from 'vue';

type OperationKind = string;

interface BackendRow {
    id: number;
    kind: string;
    title: string;
    sub: string;
    amount: string;
    sign: string;
    time: string;
    date: string;
}

interface OperationItem {
    kind: OperationKind;
    time: string;
    amount: string;
    level: string;
    sub: string;
    title: string;
}

interface OperationGroup {
    day: string;
    items: OperationItem[];
}

interface KindMeta {
    dot: string;
    amount: string;
    icon: string;
    label: string;
}

type FilterKey = 'all' | 'ref' | 'cell' | 'reinv' | 'hold';

interface FilterOption {
    key: FilterKey;
    label: string;
    dot: string;
}

const props = withDefaults(defineProps<{ rows?: BackendRow[] }>(), { rows: () => [] });

const KINDS: Record<string, KindMeta> = {
    ref: { dot: '#34C759', amount: '#34C759', icon: '+', label: 'Реферальный бонус' },
    cell: { dot: '#B98900', amount: '#B98900', icon: '●', label: 'Закрашена ячейка' },
    reinv: { dot: '#FF3B30', amount: '#FF3B30', icon: '↻', label: 'Реинвест' },
    autorei: { dot: '#FF3B30', amount: '#FF3B30', icon: '↻', label: 'Авто-реинвест за прогулы' },
    hold: { dot: '#FF9F0A', amount: '#FF9F0A', icon: '⏳', label: 'Заявка на вывод' },
    warn: { dot: '#FF9F0A', amount: '#FF9F0A', icon: '⏳', label: 'Заявка на вывод' },
    payout: { dot: '#FF9F0A', amount: '#FF9F0A', icon: '↑', label: 'Выплата отправлена' },
    neg: { dot: '#FF3B30', amount: '#FF3B30', icon: '↑', label: 'Списание' },
    deposit: { dot: '#007AFF', amount: '#007AFF', icon: '↓', label: 'Депозит' },
    upgrade: { dot: '#5856D6', amount: '#5856D6', icon: '↑', label: 'Апгрейд с баланса' },
    bonus: { dot: '#FFCC00', amount: '#34C759', icon: '★', label: 'Бонусная ячейка' },
    fee: { dot: '#8E8E93', amount: '#8E8E93', icon: '−', label: 'Комиссия сервиса' },
    restore: { dot: '#34C759', amount: '#34C759', icon: '↩', label: 'Возврат средств' },
    neu: { dot: '#007AFF', amount: '#007AFF', icon: '•', label: 'Операция' },
    gold: { dot: '#B98900', amount: '#B98900', icon: '●', label: 'Закрашена ячейка' },
    other: { dot: '#8E8E93', amount: '#8E8E93', icon: '·', label: 'Операция' },
};

const DEFAULT_KIND: KindMeta = { dot: '#8E8E93', amount: '#8E8E93', icon: '·', label: 'Операция' };

function kindMeta(kind: string): KindMeta {
    return KINDS[kind] ?? DEFAULT_KIND;
}

function extractTime(isoDatetime: string): string {
    // "2026-05-27 14:23:00" → "14:23"
    return isoDatetime.slice(11, 16);
}

const groupedLog = computed<OperationGroup[]>(() => {
    const map = new Map<string, OperationItem[]>();

    for (const row of props.rows) {
        if (!map.has(row.date)) {
            map.set(row.date, []);
        }

        map.get(row.date)!.push({
            kind: row.kind,
            time: extractTime(row.time),
            amount: row.amount,
            level: row.sub,
            sub: row.title,
            title: row.title,
        });
    }

    return Array.from(map.entries()).map(([day, items]) => ({ day, items }));
});

const FILTERS: FilterOption[] = [
    { key: 'all', label: 'Все', dot: 'var(--c-fg2)' },
    { key: 'ref', label: 'Бонусы', dot: '#34C759' },
    { key: 'cell', label: 'Ячейки', dot: '#B98900' },
    { key: 'reinv', label: 'Реинвесты', dot: '#FF3B30' },
    { key: 'hold', label: 'Вывод', dot: '#FF9F0A' },
];

const filter = ref<FilterKey>('all');

function matchFilter(kind: OperationKind): boolean {
    if (filter.value === 'all') {
        return true;
    }

    if (filter.value === 'ref') {
        return kind === 'ref' || kind === 'bonus';
    }

    if (filter.value === 'reinv') {
        return kind === 'reinv' || kind === 'autorei' || kind === 'upgrade';
    }

    if (filter.value === 'hold') {
        return kind === 'hold' || kind === 'withdraw' || kind === 'deposit';
    }

    return kind === filter.value;
}

const visibleGroups = computed(() =>
    groupedLog.value
        .map((group) => ({
            day: group.day,
            items: group.items.filter((item) => matchFilter(item.kind)),
        }))
        .filter((group) => group.items.length > 0),
);
</script>

<template>
    <div
        class="overflow-hidden rounded-[18px] bg-white"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div
            class="flex items-center gap-2.5 px-6 py-4"
            style="border-bottom: 1px solid var(--c-hairline)"
        >
            <input
                class="h-9 max-w-[320px] flex-1 rounded-[10px] border-0 px-3.5 text-[13px] outline-none"
                style="
                    background: var(--c-bg-elevated);
                    color: var(--c-fg1);
                    font-family: inherit;
                "
                placeholder="Поиск по ID, кошельку, сумме…"
            />
            <div class="ml-auto inline-flex gap-1.5">
                <div
                    class="inline-flex gap-0.5 rounded-[9px] p-0.5"
                    style="background: var(--c-bg-elevated)"
                >
                    <button
                        v-for="f in FILTERS"
                        :key="f.key"
                        class="inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-xs font-semibold"
                        style="font-family: inherit; color: var(--c-fg1)"
                        :style="
                            filter === f.key
                                ? 'background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                                : 'background: transparent'
                        "
                        @click="filter = f.key"
                    >
                        <span
                            v-if="f.key !== 'all'"
                            class="h-2 w-2 rounded-full"
                            :style="{ background: f.dot }"
                        />
                        {{ f.label }}
                    </button>
                </div>
            </div>
        </div>

        <template v-for="group in visibleGroups" :key="group.day">
            <div
                class="px-6 pt-3.5 pb-2 text-[11px] font-bold tracking-[0.06em] uppercase"
                style="
                    color: var(--c-fg3);
                    background: var(--c-bg);
                    border-top: 1px solid var(--c-hairline);
                    border-bottom: 1px solid var(--c-hairline-soft);
                "
            >
                {{ group.day }}
            </div>
            <div
                v-for="(item, i) in group.items"
                :key="i"
                class="flex items-center gap-4 px-6 py-3.5"
                style="border-bottom: 1px solid var(--c-hairline-soft)"
            >
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold"
                    :style="{
                        background: `${kindMeta(item.kind).dot}26`,
                        color: kindMeta(item.kind).dot,
                    }"
                >
                    {{ kindMeta(item.kind).icon }}
                </div>
                <div class="min-w-0 flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        {{ kindMeta(item.kind).label }}
                    </div>
                    <div class="mt-0.5 text-xs" style="color: var(--c-fg3)">
                        {{ item.sub }}
                    </div>
                </div>
                <span
                    class="rounded-full px-2 py-[3px] text-[11px] font-bold tracking-[0.04em]"
                    style="
                        color: var(--c-fg2);
                        background: var(--c-bg-elevated);
                    "
                >
                    {{ item.level }}
                </span>
                <div
                    class="min-w-[130px] text-right text-sm font-semibold"
                    :style="{
                        color: kindMeta(item.kind).amount,
                        fontFamily: 'var(--c-font-mono)',
                        fontVariantNumeric: 'tabular-nums',
                    }"
                >
                    {{ item.amount }} USDT
                </div>
                <div
                    class="min-w-[50px] text-right text-[11px]"
                    style="color: var(--c-fg3); font-family: var(--c-font-mono)"
                >
                    {{ item.time }}
                </div>
            </div>
        </template>
    </div>
</template>
