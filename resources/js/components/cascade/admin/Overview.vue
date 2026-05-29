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
}

const props = defineProps<{ stats: AdminStats }>();

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
        label: 'Баланс пользователей',
        value: money(props.stats.balance_liability) + ' USDT',
        hint: 'Суммарные обязательства платформы',
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
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
            v-for="card in cards"
            :key="card.label"
            class="flex flex-col gap-1.5 rounded-[18px] bg-white px-[22px] py-5"
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
</template>
