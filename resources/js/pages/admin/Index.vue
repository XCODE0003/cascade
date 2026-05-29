<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import DepositsTable from '@/components/cascade/admin/DepositsTable.vue';
import Overview from '@/components/cascade/admin/Overview.vue';
import QueueManager from '@/components/cascade/admin/QueueManager.vue';
import Settings from '@/components/cascade/admin/Settings.vue';
import UsersTable from '@/components/cascade/admin/UsersTable.vue';
import WithdrawalsTable from '@/components/cascade/admin/WithdrawalsTable.vue';

type TabKey =
    | 'overview'
    | 'users'
    | 'deposits'
    | 'withdrawals'
    | 'queues'
    | 'settings';

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

interface AdminUser {
    id: number;
    tag: string;
    name: string;
    email: string;
    balance: number;
    is_admin: boolean;
    referrer: string | null;
    referrals_count: number;
    deposits_count: number;
    deposits_sum: number;
    withdrawals_count: number;
    max_level: number;
    deposit_address: string | null;
    last_seen: string | null;
    joined: string;
}

interface DepositRow {
    id: string;
    raw_id: number;
    user: string;
    level: number;
    amount: number;
    ref: string;
    age: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface WithdrawalRow {
    id: string;
    raw_id: number;
    user: string;
    amount: number;
    holdLeft: number | null;
    total: number;
    status: 'hold' | 'pending' | 'approved' | 'rejected';
    created: string;
}

interface QueueRow {
    raw_id: number;
    pos: number;
    user: string;
    filled: number;
    status: 'ready' | 'locked' | 'grey';
    timer: string;
    joined: string;
}

interface AdminSettings {
    hold_hours: string;
    double_lock_days: string;
    auto_reinvest_days: string;
    min_withdrawal: string;
    westwallet_base_url: string;
    westwallet_public_key: string;
    westwallet_private_key: string;
    westwallet_currency: string;
    westwallet_ipn_secret: string;
    westwallet_auto_payout: boolean;
}

const props = defineProps<{
    stats: AdminStats;
    users: AdminUser[];
    deposits: DepositRow[];
    withdrawals: WithdrawalRow[];
    queues: Record<string, QueueRow[]>;
    settings: AdminSettings;
}>();

const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'users', label: 'Пользователи' },
    { key: 'deposits', label: 'Депозиты' },
    { key: 'withdrawals', label: 'Выплаты' },
    { key: 'queues', label: 'Очереди' },
    { key: 'settings', label: 'Настройки' },
];

const tab = ref<TabKey>('overview');

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Админка', href: '/admin' }],
    },
});
</script>

<template>
    <Head title="Админка" />

    <div
        class="flex h-full flex-1 flex-col gap-[18px] p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <div
            class="inline-flex gap-0.5 self-start rounded-[9px] p-0.5"
            style="background: var(--c-bg-elevated)"
        >
            <button
                v-for="t in tabs"
                :key="t.key"
                class="rounded-[7px] px-3.5 py-2 text-[13px] font-semibold transition-colors"
                style="color: var(--c-fg1)"
                :style="
                    tab === t.key
                        ? 'background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                        : 'background: transparent'
                "
                @click="tab = t.key"
            >
                {{ t.label }}
            </button>
        </div>

        <Overview v-if="tab === 'overview'" :stats="stats" />
        <UsersTable v-else-if="tab === 'users'" :users="users" />
        <DepositsTable
            v-else-if="tab === 'deposits'"
            :initial-rows="deposits"
        />
        <WithdrawalsTable
            v-else-if="tab === 'withdrawals'"
            :initial-rows="withdrawals"
        />
        <QueueManager v-else-if="tab === 'queues'" :initial-queues="queues" />
        <Settings v-else-if="tab === 'settings'" :initial-settings="settings" />
    </div>
</template>
