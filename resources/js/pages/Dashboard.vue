<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import BalanceHero from '@/components/cascade/BalanceHero.vue';
import DepositSheet from '@/components/cascade/DepositSheet.vue';
import HistoryFeed from '@/components/cascade/HistoryFeed.vue';
import type { HistoryRow } from '@/components/cascade/HistoryFeed.vue';
import QueueCard from '@/components/cascade/QueueCard.vue';
import WithdrawSheet from '@/components/cascade/WithdrawSheet.vue';
import { dashboard } from '@/routes';

type QueueStatus = 'ready' | 'locked' | 'inactive' | 'pending';

interface Queue {
    level: number;
    entry: number;
    payout: number;
    filled: number;
    status: QueueStatus;
    timer: string | null;
    auto: boolean;
}

const props = withDefaults(
    defineProps<{
        balance?: number;
        queues?: Queue[];
        history?: HistoryRow[];
        minWithdrawal?: number;
    }>(),
    {
        balance: 1248,
        minWithdrawal: 30,
        queues: () => [
            {
                level: 1,
                entry: 20,
                payout: 30,
                filled: 5,
                status: 'ready',
                timer: null,
                auto: true,
            },
            {
                level: 2,
                entry: 100,
                payout: 150,
                filled: 3,
                status: 'locked',
                timer: '4 д 12:32:08',
                auto: false,
            },
            {
                level: 3,
                entry: 700,
                payout: 1050,
                filled: 0,
                status: 'inactive',
                timer: null,
                auto: false,
            },
            {
                level: 4,
                entry: 2000,
                payout: 3000,
                filled: 2,
                status: 'locked',
                timer: '6 д 03:14:55',
                auto: false,
            },
        ],
        history: () => [
            {
                kind: 'ref',
                title: 'Реферальный бонус',
                sub: 'от user_4821 · Level 2',
                amount: '+60,00',
                sign: 'pos',
                time: '14:23',
            },
            {
                kind: 'cell',
                title: 'Закрашена ячейка',
                sub: 'Очередь 700 · ячейка 3 из 5',
                amount: '+210,00',
                sign: 'gold',
                time: '13:55',
            },
            {
                kind: 'cell',
                title: 'Закрашена ячейка',
                sub: 'Очередь 100 · ячейка 2 из 5',
                amount: '+30,00',
                sign: 'gold',
                time: '12:01',
            },
            {
                kind: 'hold',
                title: 'Заявка на вывод · холд',
                sub: 'Освободится через 36 ч 12 мин',
                amount: '−1 050,00',
                sign: 'warn',
                time: 'вчера',
            },
            {
                kind: 'reinv',
                title: 'Реинвест',
                sub: 'Каскад в Очередь 100',
                amount: '−90,00',
                sign: 'neg',
                time: 'вчера',
            },
            {
                kind: 'deposit',
                title: 'Депозит подтверждён',
                sub: 'Level 3 · 700 USDT',
                amount: '+0,00',
                sign: 'neu',
                time: '2 дн',
            },
            {
                kind: 'ref',
                title: 'Реферальный бонус',
                sub: 'от user_9182 · Level 1',
                amount: '+12,00',
                sign: 'pos',
                time: '2 дн',
            },
        ],
    },
);

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Кабинет', href: dashboard() }],
    },
});

const page = usePage<{
    flash: { deposit_created?: { wallet_address: string; amount: number } };
}>();

const depositOpen = ref(false);
const withdrawOpen = ref(false);
const depositLevel = ref(2);
const walletAddressDismissed = ref(false);

const canWithdraw = computed(() => props.balance >= props.minWithdrawal);

const activeWalletAddress = computed(() =>
    walletAddressDismissed.value
        ? undefined
        : page.props.flash?.deposit_created?.wallet_address,
);
const activeWalletAmount = computed(() =>
    walletAddressDismissed.value
        ? undefined
        : page.props.flash?.deposit_created?.amount,
);

// When flash deposit_created arrives, open the sheet to show step 2
watch(
    () => page.props.flash?.deposit_created?.wallet_address,
    (addr) => {
        if (addr) {
            walletAddressDismissed.value = false;
            depositOpen.value = true;
        }
    },
);

function openDeposit(level: number) {
    depositLevel.value = level;
    walletAddressDismissed.value = true;
    depositOpen.value = true;
}

function openUpgrade(level: number) {
    depositLevel.value = Math.min(level + 1, 4);
    walletAddressDismissed.value = true;
    depositOpen.value = true;
}

function closeDepositSheet() {
    depositOpen.value = false;
    walletAddressDismissed.value = true;
}

function handleDepositConfirm(payload: {
    level: number;
    method: 'external' | 'internal';
}) {
    if (payload.method === 'internal') {
        depositOpen.value = false;
        router.post('/deposits/upgrade', { level_id: payload.level });
    } else {
        router.post('/deposits', { level_id: payload.level });
    }
}

function reinvest(level: number) {
    router.post(`/queue/${level}/reinvest`);
}

function toggleAuto(level: number, current: boolean) {
    router.post(
        `/queue/${level}/auto-reinvest`,
        { enabled: !current },
        { preserveScroll: true },
    );
}

function confirmWithdraw(payload: { wallet_address: string }) {
    withdrawOpen.value = false;
    router.post('/withdrawals', {
        amount: props.balance,
        wallet_address: payload.wallet_address,
    });
}
</script>

<template>
    <Head title="Кабинет" />

    <div
        class="flex h-full flex-1 flex-col gap-[18px] p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <BalanceHero
            :balance="props.balance"
            :can-withdraw="canWithdraw"
            @deposit="openDeposit(2)"
            @withdraw="withdrawOpen = true"
        />

        <div class="mt-1.5 flex items-baseline gap-3">
            <div
                class="text-[22px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Очереди
            </div>
            <div class="text-[13px]" style="color: var(--c-fg3)">
                4 независимых уровня · ликвидность не пересекается
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <QueueCard
                v-for="q in props.queues"
                :key="q.level"
                :level="q.level"
                :entry="q.entry"
                :payout="q.payout"
                :filled="q.filled"
                :status="q.status"
                :timer="q.timer"
                :auto-reinvest="q.auto"
                @activate="openDeposit(q.level)"
                @reinvest="reinvest(q.level)"
                @upgrade="openUpgrade(q.level)"
                @toggle-auto="toggleAuto(q.level, q.auto)"
            />
        </div>

        <div class="mt-1.5 flex items-baseline gap-3">
            <div
                class="text-[22px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Активность
            </div>
            <div class="text-[13px]" style="color: var(--c-fg3)">
                Последние 7 дней
            </div>
        </div>

        <HistoryFeed :rows="props.history" />
    </div>

    <DepositSheet
        :open="depositOpen"
        :default-level="depositLevel"
        :balance="props.balance"
        :wallet-address="activeWalletAddress"
        :wallet-amount="activeWalletAmount"
        @close="closeDepositSheet"
        @confirm="handleDepositConfirm"
    />

    <WithdrawSheet
        :open="withdrawOpen"
        :balance="props.balance"
        @close="withdrawOpen = false"
        @confirm="confirmWithdraw"
    />
</template>
