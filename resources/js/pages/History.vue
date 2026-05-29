<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import OperationsLog from '@/components/cascade/history/OperationsLog.vue';

interface HistoryRow {
    id: number;
    kind: string;
    title: string;
    sub: string;
    amount: string;
    sign: string;
    time: string;
    date: string;
}

const props = withDefaults(
    defineProps<{
        totalIncome?: number;
        totalReinvest?: number;
        totalWithdrawn?: number;
        totalOps?: number;
        rows?: HistoryRow[];
    }>(),
    {
        totalIncome: 0,
        totalReinvest: 0,
        totalWithdrawn: 0,
        totalOps: 0,
        rows: () => [],
    },
);

function fmt(n: number, withSign = false): string {
    const s = n.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
    return withSign && n > 0 ? `+ ${s}` : n < 0 ? `− ${s}` : s;
}

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'История', href: '/history' }],
    },
});
</script>

<template>
    <Head title="История" />

    <div
        class="flex h-full flex-1 flex-col gap-[18px] p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
                class="flex flex-col gap-1.5 rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[18px]"
                style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
            >
                <div
                    class="text-[11px] font-semibold tracking-[0.04em] uppercase"
                    style="color: var(--c-fg3)"
                >
                    Доход · 30 дн
                </div>
                <div
                    class="text-[26px] font-bold tracking-[-0.02em]"
                    style="
                        color: var(--c-success);
                        font-family: var(--c-font-display);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    + {{ fmt(props.totalIncome) }}
                    <span
                        class="text-sm font-medium"
                        style="color: var(--c-fg3)"
                        >USDT</span
                    >
                </div>
                <div class="text-[11px]" style="color: var(--c-fg2)">
                    Ячейки и реферальные бонусы
                </div>
            </div>

            <div
                class="flex flex-col gap-1.5 rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[18px]"
                style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
            >
                <div
                    class="text-[11px] font-semibold tracking-[0.04em] uppercase"
                    style="color: var(--c-fg3)"
                >
                    Реинвесты · 30 дн
                </div>
                <div
                    class="text-[26px] font-bold tracking-[-0.02em]"
                    style="
                        color: var(--c-danger);
                        font-family: var(--c-font-display);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    {{ props.totalReinvest }}
                    <span
                        class="text-sm font-medium"
                        style="color: var(--c-fg3)"
                        >шт</span
                    >
                </div>
                <div class="text-[11px]" style="color: var(--c-fg2)">
                    Ручных и авто
                </div>
            </div>

            <div
                class="flex flex-col gap-1.5 rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[18px]"
                style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
            >
                <div
                    class="text-[11px] font-semibold tracking-[0.04em] uppercase"
                    style="color: var(--c-fg3)"
                >
                    Выведено · 30 дн
                </div>
                <div
                    class="text-[26px] font-bold tracking-[-0.02em]"
                    style="
                        color: var(--c-warning);
                        font-family: var(--c-font-display);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    − {{ fmt(props.totalWithdrawn) }}
                    <span
                        class="text-sm font-medium"
                        style="color: var(--c-fg3)"
                        >USDT</span
                    >
                </div>
                <div class="text-[11px]" style="color: var(--c-fg2)">
                    Одобренные выплаты
                </div>
            </div>

            <div
                class="flex flex-col gap-1.5 rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[18px]"
                style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
            >
                <div
                    class="text-[11px] font-semibold tracking-[0.04em] uppercase"
                    style="color: var(--c-fg3)"
                >
                    Операций всего
                </div>
                <div
                    class="text-[26px] font-bold tracking-[-0.02em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    {{ props.totalOps }}
                </div>
                <div class="text-[11px]" style="color: var(--c-fg2)">
                    За последние 30 дней
                </div>
            </div>
        </div>

        <div class="mt-1.5 flex items-baseline gap-3">
            <div
                class="text-[22px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Лента операций
            </div>
            <div class="text-[13px]" style="color: var(--c-fg3)">
                Группировка по дням · с цветовой маркировкой
            </div>
        </div>

        <OperationsLog :rows="props.rows" />
    </div>
</template>
