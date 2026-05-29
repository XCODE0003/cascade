<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

type DepositStatus = 'pending' | 'approved' | 'rejected';

interface Deposit {
    id: string;
    raw_id: number;
    user: string;
    level: number;
    amount: number;
    ref: string;
    age: string;
    status: DepositStatus;
}

type FilterKey = 'pending' | 'approved' | 'all';

const props = defineProps<{ initialRows: Deposit[] }>();

const filters: { key: FilterKey; label: string }[] = [
    { key: 'pending', label: 'Ожидают' },
    { key: 'approved', label: 'Подтверждены' },
    { key: 'all', label: 'Все' },
];

const filter = ref<FilterKey>('pending');

const filtered = computed(() => {
    if (filter.value === 'all') {
        return props.initialRows;
    }

    return props.initialRows.filter((row) => row.status === filter.value);
});

function approve(row: Deposit): void {
    router.post(
        `/admin/deposits/${row.raw_id}/approve`,
        {},
        { preserveScroll: true },
    );
}

function reject(row: Deposit): void {
    router.post(
        `/admin/deposits/${row.raw_id}/reject`,
        {},
        { preserveScroll: true },
    );
}

function formatAmount(amount: number): string {
    return amount.toLocaleString('ru-RU').replace(/,/g, ' ');
}

const pillColors: Record<DepositStatus, [string, string]> = {
    pending: ['var(--c-warning-bg)', 'var(--c-warning-fg)'],
    approved: ['var(--c-success-bg)', 'var(--c-success-fg)'],
    rejected: ['var(--c-danger-bg)', 'var(--c-danger-fg)'],
};

const dotColors: Record<DepositStatus, string> = {
    pending: 'var(--c-warning)',
    approved: 'var(--c-success)',
    rejected: 'var(--c-danger)',
};

const statusLabels: Record<DepositStatus, string> = {
    pending: 'Ожидает',
    approved: 'Подтверждён',
    rejected: 'Отклонён',
};
</script>

<template>
    <div
        class="overflow-hidden rounded-[18px] bg-[var(--c-bg-card)]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-center gap-3.5 px-6 pt-5 pb-3.5">
            <div>
                <div
                    class="text-[20px] font-semibold tracking-[-0.01em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Депозиты
                </div>
                <div class="text-[13px]" style="color: var(--c-fg3)">
                    Подтверждение запускает сплит 10 / 60 / 30 и обновляет
                    очередь
                </div>
            </div>
        </div>

        <div
            class="flex items-center gap-2 px-6 pb-3.5"
            style="border-bottom: 1px solid var(--c-hairline)"
        >
            <div
                class="inline-flex gap-0.5 rounded-[9px] p-0.5"
                style="background: var(--c-bg-elevated)"
            >
                <button
                    v-for="f in filters"
                    :key="f.key"
                    class="rounded-[7px] px-3 py-1.5 text-xs font-semibold"
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

        <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] border-collapse">
                <thead>
                    <tr>
                        <th
                            v-for="(label, i) in [
                                'ID',
                                'Пользователь',
                                'Уровень',
                                'Сумма',
                                'Реферер',
                                'Время',
                                'Статус',
                            ]"
                            :key="i"
                            class="px-6 py-3 text-left text-[11px] font-semibold tracking-[0.04em] uppercase"
                            style="
                                color: var(--c-fg3);
                                border-bottom: 1px solid var(--c-hairline);
                                background: var(--c-bg);
                            "
                        >
                            {{ label }}
                        </th>
                        <th
                            class="px-6 py-3 text-right text-[11px] font-semibold tracking-[0.04em] uppercase"
                            style="
                                color: var(--c-fg3);
                                border-bottom: 1px solid var(--c-hairline);
                                background: var(--c-bg);
                            "
                        >
                            Действие
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in filtered" :key="row.id">
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg2);
                                font-family: var(--c-font-mono);
                                font-variant-numeric: tabular-nums;
                            "
                        >
                            {{ row.id }}
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg1);
                            "
                        >
                            {{ row.user }}
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg1);
                            "
                        >
                            Level {{ row.level }}
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px] font-semibold"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg1);
                                font-family: var(--c-font-mono);
                                font-variant-numeric: tabular-nums;
                            "
                        >
                            {{ formatAmount(row.amount) }} USDT
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg2);
                            "
                        >
                            {{ row.ref }}
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg3);
                            "
                        >
                            {{ row.age }}
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg1);
                            "
                        >
                            <span
                                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-semibold"
                                :style="{
                                    background: pillColors[row.status][0],
                                    color: pillColors[row.status][1],
                                }"
                            >
                                <span
                                    class="h-1.5 w-1.5 rounded-full"
                                    :style="{
                                        background: dotColors[row.status],
                                    }"
                                />
                                {{ statusLabels[row.status] }}
                            </span>
                        </td>
                        <td
                            class="px-6 py-3.5 align-middle text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                                color: var(--c-fg1);
                            "
                        >
                            <div class="flex justify-end gap-1.5">
                                <template v-if="row.status === 'pending'">
                                    <button
                                        class="inline-flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white"
                                        style="background: var(--c-success)"
                                        @click="approve(row)"
                                    >
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
                                            <path d="M5 12l5 5 9-11" />
                                        </svg>
                                        Подтвердить
                                    </button>
                                    <button
                                        class="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg text-white"
                                        style="background: var(--c-danger)"
                                        @click="reject(row)"
                                    >
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
                                            <path d="M6 6l12 12M18 6l-12 12" />
                                        </svg>
                                    </button>
                                </template>
                                <button
                                    v-else
                                    class="inline-flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold"
                                    style="
                                        background: var(--c-bg-elevated);
                                        color: var(--c-fg1);
                                    "
                                >
                                    Детали
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
