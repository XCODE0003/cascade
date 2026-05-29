<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import DepositPanel from '@/components/cascade/wallet/DepositPanel.vue';
import TxTable from '@/components/cascade/wallet/TxTable.vue';
import WithdrawPanel from '@/components/cascade/wallet/WithdrawPanel.vue';

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

const props = withDefaults(
    defineProps<{
        balance?: number;
        depositAddress?: string | null;
        minWithdrawal?: number;
        totalDeposited?: number;
        totalWithdrawn?: number;
        pendingHolds?: number;
        deposits?: DepositRow[];
        withdrawals?: WithdrawalRow[];
    }>(),
    {
        balance: 0,
        depositAddress: null,
        minWithdrawal: 30,
        totalDeposited: 0,
        totalWithdrawn: 0,
        pendingHolds: 0,
        deposits: () => [],
        withdrawals: () => [],
    },
);

function fmt(n: number): string {
    return n.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

const smallStats = computed(() => [
    { value: '+ ' + fmt(props.totalDeposited), label: 'Пополнено · всего' },
    { value: '− ' + fmt(props.totalWithdrawn), label: 'Выведено · всего' },
    { value: String(props.pendingHolds), label: 'Заявок в холде/ожидании' },
]);

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Кошелёк', href: '/wallet' }],
    },
});
</script>

<template>
    <Head title="Кошелёк" />

    <div
        class="flex h-full flex-1 flex-col gap-[18px] p-4 sm:p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <div
            class="relative overflow-hidden rounded-3xl bg-(--c-bg-card) px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
            style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
        >
            <!-- radial glow -->
            <div
                class="pointer-events-none absolute top-[-120px] -right-20 h-[360px] w-[360px]"
                style="
                    background: radial-gradient(
                        closest-side,
                        rgba(0, 122, 255, 0.08),
                        transparent
                    );
                "
            />

            <div class="relative z-10">
                <div
                    class="mb-1.5 text-[13px] font-semibold"
                    style="color: var(--c-fg2)"
                >
                    Внутренний баланс
                </div>
                <div
                    class="text-[28px] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[38px] lg:text-[48px]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    {{ fmt(props.balance)
                    }}<span
                        class="ml-1.5 text-lg font-medium sm:text-xl"
                        style="color: var(--c-fg3)"
                        >USDT</span
                    >
                </div>
            </div>

            <div
                class="relative z-10 mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3"
                style="border-color: var(--c-hairline)"
            >
                <div v-for="stat in smallStats" :key="stat.label">
                    <div
                        class="text-[18px] font-bold tracking-[-0.015em] sm:text-[22px]"
                        style="
                            color: var(--c-fg1);
                            font-family: var(--c-font-display);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        {{ stat.value }}
                    </div>
                    <div class="mt-0.5 text-xs" style="color: var(--c-fg3)">
                        {{ stat.label }}
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DepositPanel :address="props.depositAddress" />
            <WithdrawPanel
                :balance="props.balance"
                :min-withdrawal="props.minWithdrawal"
            />
        </div>

        <TxTable :deposits="props.deposits" :withdrawals="props.withdrawals" />
    </div>
</template>
