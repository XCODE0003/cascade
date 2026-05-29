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
        class="flex h-full flex-1 flex-col gap-[18px] p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <div
            class="relative flex items-center gap-8 overflow-hidden rounded-3xl bg-[var(--c-bg-card)] px-8 py-7"
            style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
        >
            <!-- radial glow -->
            <div
                class="pointer-events-none absolute -top-[120px] -right-20 h-[360px] w-[360px]"
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
                    class="text-[48px] leading-[1.05] font-bold tracking-[-0.03em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                        font-variant-numeric: tabular-nums;
                    "
                >
                    {{ fmt(props.balance)
                    }}<span
                        class="ml-1.5 text-xl font-medium"
                        style="color: var(--c-fg3)"
                        >USDT</span
                    >
                </div>
            </div>

            <div
                class="mx-1 self-stretch"
                style="width: 1px; background: var(--c-hairline)"
            />

            <div
                v-for="stat in smallStats"
                :key="stat.label"
                class="relative z-10"
            >
                <div
                    class="text-[22px] font-bold tracking-[-0.015em]"
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

        <div class="grid grid-cols-2 gap-4">
            <DepositPanel :address="props.depositAddress" />
            <WithdrawPanel
                :balance="props.balance"
                :min-withdrawal="props.minWithdrawal"
            />
        </div>

        <TxTable :deposits="props.deposits" :withdrawals="props.withdrawals" />
    </div>
</template>
