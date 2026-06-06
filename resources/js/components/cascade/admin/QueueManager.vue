<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

type QueueRowStatus = 'ready' | 'locked' | 'grey';

interface QueueRow {
    raw_id: number;
    pos: number;
    user: string;
    filled: number;
    bonus?: number;
    status: QueueRowStatus;
    timer: string;
    joined: string;
}

// Как в кабинете: зелёные ячейки — 60% от прямых рефералов,
// жёлтые — 30% из общей очереди.
function cellStyle(row: QueueRow, i: number): string {
    if (i > row.filled) {
        return 'background: var(--c-cell-empty-bg); box-shadow: inset 0 0 0 1px var(--c-cell-empty-ring)';
    }

    return i <= (row.bonus ?? 0)
        ? 'background: var(--c-success)'
        : 'background: var(--c-cell-bonus)';
}

const props = defineProps<{ initialQueues: Record<string, QueueRow[]> }>();

const TIERS: { id: string; color: string; label: string }[] = [
    { id: '1', color: 'var(--c-level-1)', label: 'Очередь 20' },
    { id: '2', color: 'var(--c-level-2)', label: 'Очередь 100' },
    { id: '3', color: 'var(--c-level-3)', label: 'Очередь 700' },
    { id: '4', color: 'var(--c-level-4)', label: 'Очередь 2000' },
];

const visibleTiers = computed(() =>
    TIERS.filter((t) => t.id in props.initialQueues),
);

const tier = ref<string>(visibleTiers.value[0]?.id ?? '1');

const data = computed(() => props.initialQueues[tier.value] ?? []);

function moveToFront(row: QueueRow): void {
    router.post(
        `/admin/queue/${row.raw_id}/move-front`,
        {},
        { preserveScroll: true },
    );
}

function moveToBack(row: QueueRow): void {
    router.post(
        `/admin/queue/${row.raw_id}/move-back`,
        {},
        { preserveScroll: true },
    );
}

function remove(row: QueueRow): void {
    router.post(
        `/admin/queue/${row.raw_id}/remove`,
        {},
        { preserveScroll: true },
    );
}

function timerColor(status: QueueRowStatus): string {
    switch (status) {
        case 'ready':
            return 'var(--c-success)';
        case 'locked':
            return 'var(--c-accent)';
        case 'grey':
            return 'var(--c-fg3)';
        default:
            return 'var(--c-fg2)';
    }
}
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
                    Очереди
                </div>
                <div class="text-[13px]" style="color: var(--c-fg3)">
                    Каждый уровень — изолированный «котёл». Ликвидность не
                    пересекается между тарифами.
                </div>
            </div>
        </div>

        <div
            class="px-6 pb-3.5"
            style="border-bottom: 1px solid var(--c-hairline)"
        >
            <div
                class="inline-flex gap-[3px] rounded-[11px] p-[3px]"
                style="background: var(--c-bg-elevated)"
            >
                <button
                    v-for="t in visibleTiers"
                    :key="t.id"
                    class="inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[13px] font-semibold"
                    style="color: var(--c-fg1)"
                    :style="
                        tier === t.id
                            ? 'background: var(--c-bg-active); box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)'
                            : 'background: transparent'
                    "
                    @click="tier = t.id"
                >
                    <span
                        class="h-2 w-2 rounded-full"
                        :style="{ background: t.color }"
                    />
                    {{ t.label }}
                    <span
                        class="ml-1 text-[11px]"
                        style="
                            color: var(--c-fg3);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        {{ (initialQueues[t.id] ?? []).length }}
                    </span>
                </button>
            </div>
        </div>

        <div
            v-for="row in data"
            :key="row.raw_id"
            class="flex items-center gap-3.5 px-6 py-3.5"
            style="border-bottom: 1px solid var(--c-hairline-soft)"
        >
            <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-xs font-bold"
                style="font-family: var(--c-font-mono)"
                :style="
                    row.pos === 1
                        ? 'background: var(--c-accent-bg); color: var(--c-accent-press)'
                        : 'background: var(--c-bg-elevated); color: var(--c-fg2)'
                "
            >
                {{ row.pos }}
            </div>

            <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold" style="color: var(--c-fg1)">
                    {{ row.user }}
                </div>
                <div class="mt-0.5 text-xs" style="color: var(--c-fg3)">
                    В очереди с {{ row.joined }}
                </div>
            </div>

            <div class="flex gap-[3px]">
                <div
                    v-for="i in 5"
                    :key="i"
                    class="h-[22px] w-[18px] rounded-[4px]"
                    :style="cellStyle(row, i)"
                />
            </div>

            <div
                class="text-right text-xs font-medium"
                :style="{
                    color: timerColor(row.status),
                    fontFamily: 'var(--c-font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '110px',
                }"
            >
                <template v-if="row.status === 'ready'">● Готов</template>
                <template v-else-if="row.status === 'locked'">{{
                    row.timer
                }}</template>
                <template v-else-if="row.status === 'grey'">⊘ Серый</template>
            </div>

            <div class="flex gap-1.5">
                <button
                    class="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg2);
                    "
                    title="В начало"
                    @click="moveToFront(row)"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 19V5M6 11l6-6 6 6" />
                    </svg>
                </button>
                <button
                    class="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg2);
                    "
                    title="В конец"
                    @click="moveToBack(row)"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                </button>
                <button
                    class="inline-flex h-[30px] w-[30px] items-center justify-center rounded-lg"
                    style="
                        background: var(--c-bg-elevated);
                        color: var(--c-fg2);
                    "
                    title="Удалить"
                    @click="remove(row)"
                >
                    <svg
                        width="14"
                        height="14"
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
            </div>
        </div>

        <div
            v-if="data.length === 0"
            class="px-6 py-10 text-center text-sm"
            style="color: var(--c-fg3)"
        >
            Очередь пуста
        </div>
    </div>
</template>
