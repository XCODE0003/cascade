<script setup lang="ts">
import { computed } from 'vue';

type InviteStatus = 'active' | 'grey' | 'empty';

interface Partner {
    id: number;
    name: string;
    level: number | null;
    earned: number;
    joined: string;
    active: boolean;
}

interface Invite {
    user: string;
    level: string;
    earned: string;
    joined: string;
    status: InviteStatus;
}

const props = withDefaults(
    defineProps<{
        partners?: Partner[];
        partnersCount?: number;
        activeCount?: number;
    }>(),
    { partners: () => [], partnersCount: 0, activeCount: 0 },
);

const invites = computed<Invite[]>(() =>
    props.partners.map((p) => ({
        user: 'u_' + p.id,
        level: p.level !== null ? 'Level ' + p.level : 'не куплен',
        earned: p.earned.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        joined: p.joined,
        status: p.active ? 'active' : p.level !== null ? 'grey' : 'empty',
    })),
);

const statusLabel: Record<InviteStatus, string> = {
    active: 'Активен',
    grey: 'Неактивен в очереди',
    empty: 'Не активирован',
};

const pillStyle: Record<InviteStatus, { bg: string; fg: string; dot: string }> =
    {
        active: {
            bg: 'var(--c-success-bg)',
            fg: '#1a6e34',
            dot: 'var(--c-success)',
        },
        grey: {
            bg: 'var(--c-neutral-bg)',
            fg: 'var(--c-fg2)',
            dot: 'var(--c-neutral)',
        },
        empty: {
            bg: 'var(--c-bg-elevated)',
            fg: 'var(--c-fg3)',
            dot: 'var(--c-fg3)',
        },
    };

function avatarStyle(hue: number): Record<string, string> {
    return {
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 70%), hsl(${(hue + 30) % 360}, 70%, 55%))`,
    };
}

function initials(user: string): string {
    return user.slice(2, 4).toUpperCase();
}
</script>

<template>
    <div
        class="overflow-hidden rounded-[18px] bg-white"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-baseline gap-3 px-6 pt-[18px] pb-3.5">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Приглашённые
            </div>
            <div class="text-[12px]" style="color: var(--c-fg3)">
                {{ props.partnersCount }} рефералов · {{ props.activeCount }} активных
            </div>
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="th in [
                            'Пользователь',
                            'Уровень',
                            'Заработано вами',
                            'Присоединился',
                            'Статус',
                        ]"
                        :key="th"
                        class="px-6 py-3 text-left text-[11px] font-semibold tracking-[0.04em] uppercase"
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
                <tr v-for="(row, i) in invites" :key="i">
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg1);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        <div class="flex items-center gap-2.5">
                            <div
                                class="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                                :style="avatarStyle((i * 67) % 360)"
                            >
                                {{ initials(row.user) }}
                            </div>
                            <span style="font-family: var(--c-font-mono)">{{
                                row.user
                            }}</span>
                        </div>
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg1);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        {{ row.level }}
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
                        +{{ row.earned }} USDT
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg2);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        {{ row.joined }}
                    </td>
                    <td
                        class="px-6 py-3.5 text-[13px]"
                        style="
                            color: var(--c-fg1);
                            border-bottom: 1px solid var(--c-hairline-soft);
                        "
                    >
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full px-[9px] py-[3px] text-[11px] font-semibold"
                            :style="{
                                background: pillStyle[row.status].bg,
                                color: pillStyle[row.status].fg,
                            }"
                        >
                            <span
                                class="h-1.5 w-1.5 rounded-full"
                                :style="{
                                    background: pillStyle[row.status].dot,
                                }"
                            />
                            {{ statusLabel[row.status] }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
