<script setup lang="ts">
import { computed, ref } from 'vue';

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

const props = withDefaults(defineProps<{ users?: AdminUser[] }>(), {
    users: () => [],
});

const query = ref('');

const filtered = computed<AdminUser[]>(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return props.users;
    return props.users.filter(
        (u) =>
            u.tag.toLowerCase().includes(q) ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.deposit_address?.toLowerCase().includes(q) ?? false),
    );
});

function money(n: number): string {
    return n.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function short(addr: string | null): string {
    if (!addr) return '—';
    return addr.length > 14 ? addr.slice(0, 8) + '…' + addr.slice(-4) : addr;
}

const headers = [
    'Пользователь',
    'Баланс',
    'Уровень',
    'Рефералов',
    'Депозиты',
    'Выплаты',
    'Адрес',
    'Активность',
    'Регистрация',
];
</script>

<template>
    <div
        class="overflow-hidden rounded-[18px] bg-[var(--c-bg-card)]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-center gap-3 px-6 pt-[18px] pb-3.5">
            <div>
                <div
                    class="text-[18px] font-semibold tracking-[-0.01em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Пользователи
                </div>
                <div class="text-xs" style="color: var(--c-fg3)">
                    {{ filtered.length }} из {{ props.users.length }}
                </div>
            </div>
            <input
                v-model="query"
                placeholder="Поиск по id, имени, email, адресу"
                class="ml-auto h-9 w-72 rounded-[10px] border-0 bg-[var(--c-bg-card)] px-3.5 text-[13px] outline-none"
                style="
                    color: var(--c-fg1);
                    box-shadow: inset 0 0 0 1px var(--c-input-border);
                "
            />
        </div>

        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th
                            v-for="th in headers"
                            :key="th"
                            class="px-6 py-3 text-left text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase"
                            style="
                                color: var(--c-fg3);
                                background: var(--c-bg);
                                border-top: 1px solid var(--c-hairline);
                                border-bottom: 1px solid var(--c-hairline);
                            "
                        >
                            {{ th }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filtered.length === 0">
                        <td
                            :colspan="headers.length"
                            class="px-6 py-8 text-center text-[13px]"
                            style="color: var(--c-fg3)"
                        >
                            Пользователи не найдены
                        </td>
                    </tr>
                    <tr v-for="u in filtered" :key="u.id">
                        <td
                            class="px-6 py-3.5 text-[13px]"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            <div class="flex flex-col">
                                <span
                                    class="flex items-center gap-1.5 font-semibold"
                                    style="color: var(--c-fg1)"
                                >
                                    {{ u.name }}
                                    <span
                                        v-if="u.is_admin"
                                        class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                        style="
                                            background: var(--c-accent-bg);
                                            color: var(--c-accent-press);
                                        "
                                        >admin</span
                                    >
                                </span>
                                <span
                                    class="text-[12px]"
                                    style="color: var(--c-fg3)"
                                    >{{ u.email }}</span
                                >
                                <span
                                    class="text-[11px]"
                                    style="
                                        color: var(--c-fg3);
                                        font-family: var(--c-font-mono);
                                    "
                                >
                                    {{ u.tag
                                    }}<template v-if="u.referrer">
                                        · ← {{ u.referrer }}</template
                                    >
                                </span>
                            </div>
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px] font-semibold"
                            style="
                                color: var(--c-fg1);
                                font-family: var(--c-font-mono);
                                font-variant-numeric: tabular-nums;
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ money(u.balance) }}
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px]"
                            style="
                                color: var(--c-fg1);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            <span v-if="u.max_level">L{{ u.max_level }}</span>
                            <span v-else style="color: var(--c-fg3)">—</span>
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px]"
                            style="
                                color: var(--c-fg2);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ u.referrals_count }}
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px] whitespace-nowrap"
                            style="
                                color: var(--c-fg2);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ u.deposits_count }} ·
                            <span style="color: var(--c-success)">{{
                                money(u.deposits_sum)
                            }}</span>
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px]"
                            style="
                                color: var(--c-fg2);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ u.withdrawals_count }}
                        </td>
                        <td
                            class="px-6 py-3.5 text-[11px]"
                            style="
                                color: var(--c-fg3);
                                font-family: var(--c-font-mono);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ short(u.deposit_address) }}
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px] whitespace-nowrap"
                            style="
                                color: var(--c-fg3);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ u.last_seen ?? '—' }}
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px] whitespace-nowrap"
                            style="
                                color: var(--c-fg3);
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            {{ u.joined }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
