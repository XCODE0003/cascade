<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

interface AdminUser {
    id: number;
    tag: string;
    name: string;
    email: string;
    balance: number;
    is_admin: boolean;
    referrer: string | null;
    referrer_name?: string | null;
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

const page = usePage<{ auth: { user: { id: number } } }>();
const currentUserId = computed(() => page.props.auth?.user?.id);

const query = ref('');
const deletingId = ref<number | null>(null);

function canDelete(u: AdminUser): boolean {
    return !u.is_admin && u.id !== currentUserId.value;
}

function destroyUser(u: AdminUser): void {
    if (!canDelete(u)) {
        return;
    }

    if (
        !window.confirm(
            `Удалить пользователя ${u.name} (${u.tag})? Депозиты, выплаты и записи очереди будут удалены безвозвратно.`,
        )
    ) {
        return;
    }

    router.delete(`/admin/users/${u.id}`, {
        preserveScroll: true,
        onStart: () => {
            deletingId.value = u.id;
        },
        onFinish: () => {
            deletingId.value = null;
        },
        onError: (errors) => {
            const first = Object.values(errors)[0];

            if (first) {
                toast.error(first);
            }
        },
    });
}

const filtered = computed<AdminUser[]>(() => {
    const q = query.value.trim().toLowerCase();

    if (!q) {
        return props.users;
    }

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
    if (!addr) {
        return '—';
    }

    return addr.length > 14 ? addr.slice(0, 8) + '…' + addr.slice(-4) : addr;
}

const headers = [
    'Пользователь',
    'Пригласил',
    'Баланс',
    'Уровень',
    'Рефералов',
    'Депозиты',
    'Выплаты',
    'Адрес',
    'Активность',
    'Регистрация',
    '',
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
                                    {{ u.tag }}
                                </span>
                            </div>
                        </td>
                        <td
                            class="px-6 py-3.5 text-[13px] whitespace-nowrap"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            <template v-if="u.referrer">
                                <div
                                    class="font-semibold"
                                    style="color: var(--c-fg1)"
                                >
                                    {{ u.referrer }}
                                </div>
                                <div
                                    v-if="u.referrer_name"
                                    class="text-[11px]"
                                    style="color: var(--c-fg3)"
                                >
                                    {{ u.referrer_name }}
                                </div>
                            </template>
                            <span v-else style="color: var(--c-fg3)"
                                >сам по себе</span
                            >
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
                        <td
                            class="px-6 py-3.5 text-right"
                            style="
                                border-bottom: 1px solid var(--c-hairline-soft);
                            "
                        >
                            <button
                                v-if="canDelete(u)"
                                type="button"
                                :disabled="deletingId === u.id"
                                class="inline-flex h-8 items-center gap-1.5 rounded-[9px] px-3 text-[12px] font-semibold transition-colors disabled:opacity-50"
                                style="
                                    background: var(--c-danger-bg);
                                    color: var(--c-danger-fg);
                                "
                                title="Удалить пользователя"
                                @click="destroyUser(u)"
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M3 6h18" />
                                    <path
                                        d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                    />
                                    <path
                                        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                                    />
                                </svg>
                                {{
                                    deletingId === u.id
                                        ? 'Удаление…'
                                        : 'Удалить'
                                }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
