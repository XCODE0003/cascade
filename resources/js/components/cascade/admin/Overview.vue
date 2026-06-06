<script setup lang="ts">
interface AdminStats {
    users_total: number;
    users_active: number;
    balance_liability: number;
    deposits_pending: number;
    deposits_total: number;
    withdrawals_pending: number;
    withdrawals_total: number;
    queue_active: number;
    service_fees_total: number;
}

interface FeeRow {
    id: number;
    user: string;
    level: number | null;
    amount: number;
    time: string;
}

const props = withDefaults(
    defineProps<{ stats: AdminStats; fees?: FeeRow[] }>(),
    { fees: () => [] },
);

function money(n: number): string {
    return n.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function int(n: number): string {
    return n.toLocaleString('ru-RU');
}

interface Card {
    label: string;
    value: string;
    hint: string;
    accent?: string;
}

const cards: Card[] = [
    {
        label: 'Пользователей',
        value: int(props.stats.users_total),
        hint: `${int(props.stats.users_active)} активных в очередях`,
    },
    {
        label: 'Комиссия сервиса · 10%',
        value: money(props.stats.service_fees_total) + ' USDT',
        hint: 'Удержано со всех входов · учёт, реальные средства — на кошельке проекта',
        accent: 'var(--c-success)',
    },
    {
        label: 'Баланс пользователей',
        value: money(props.stats.balance_liability) + ' USDT',
        hint: 'Суммарные обязательства платформы (баланс всего сайта)',
    },
    {
        label: 'Депозиты на модерации',
        value: int(props.stats.deposits_pending),
        hint: money(props.stats.deposits_total) + ' USDT подтверждено',
        accent: 'var(--c-warning)',
    },
    {
        label: 'Выплаты в очереди',
        value: int(props.stats.withdrawals_pending),
        hint: money(props.stats.withdrawals_total) + ' USDT выплачено',
        accent: 'var(--c-accent)',
    },
    {
        label: 'Активных записей в очередях',
        value: int(props.stats.queue_active),
        hint: 'Все уровни',
    },
];
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="card in cards"
                :key="card.label"
                class="flex flex-col gap-1.5 rounded-[18px] bg-[var(--c-bg-card)] px-[22px] py-5"
                style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
            >
                <div
                    class="text-[12px] font-semibold tracking-[0.01em]"
                    style="color: var(--c-fg3)"
                >
                    {{ card.label }}
                </div>
                <div
                    class="text-[28px] font-bold tracking-[-0.02em]"
                    :style="{
                        color: card.accent ?? 'var(--c-fg1)',
                        fontFamily: 'var(--c-font-display)',
                        fontVariantNumeric: 'tabular-nums',
                    }"
                >
                    {{ card.value }}
                </div>
                <div class="text-[12px]" style="color: var(--c-fg2)">
                    {{ card.hint }}
                </div>
            </div>
        </div>

        <!-- Лента начислений комиссии: сколько и когда упало сервису -->
        <div
            class="overflow-hidden rounded-[18px] bg-[var(--c-bg-card)]"
            style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
        >
            <div class="px-6 pt-[18px] pb-3">
                <div
                    class="text-[18px] font-semibold tracking-[-0.01em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Комиссия сервиса · последние начисления
                </div>
                <div class="text-xs" style="color: var(--c-fg3)">
                    10% с каждого подтверждённого входа
                </div>
            </div>

            <div
                v-for="fee in props.fees"
                :key="fee.id"
                class="flex items-center gap-3 px-6 py-3"
                style="border-top: 1px solid var(--c-hairline-soft)"
            >
                <div class="min-w-0 flex-1">
                    <span
                        class="text-[13px] font-semibold"
                        style="color: var(--c-fg1)"
                        >{{ fee.user }}</span
                    >
                    <span
                        v-if="fee.level"
                        class="ml-2 text-[12px]"
                        style="color: var(--c-fg3)"
                        >Level {{ fee.level }}</span
                    >
                </div>
                <div
                    class="text-[13px] font-semibold"
                    style="
                        color: var(--c-success);
                        font-family: var(--c-font-mono);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    +{{ money(fee.amount) }} USDT
                </div>
                <div
                    class="text-right text-xs"
                    style="color: var(--c-fg3); min-width: 64px"
                >
                    {{ fee.time }}
                </div>
            </div>

            <div
                v-if="props.fees.length === 0"
                class="px-6 py-8 text-center text-sm"
                style="
                    border-top: 1px solid var(--c-hairline-soft);
                    color: var(--c-fg3);
                "
            >
                Начислений пока нет — комиссия появится после первого
                подтверждённого депозита.
            </div>
        </div>
    </div>
</template>
