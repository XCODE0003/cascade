<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        totalEarned?: number;
        filledCells?: number;
        maxLevel?: number;
        activeCount?: number;
    }>(),
    {
        totalEarned: 0,
        filledCells: 0,
        maxLevel: 1,
        activeCount: 0,
    },
);

const friends = computed(() =>
    Array.from({ length: 5 }, (_, i) => i < props.activeCount),
);

const cellsPct = computed(() => Math.round((props.filledCells / 5) * 100));

function fmt(n: number): string {
    return n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
            class="flex flex-col gap-1.5 rounded-[18px] bg-white px-[22px] py-5"
            style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
        >
            <div
                class="text-[12px] font-semibold tracking-[0.01em]"
                style="color: var(--c-fg3)"
            >
                Заработано бонусов · всего
            </div>
            <div
                class="text-[30px] font-bold tracking-[-0.02em]"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-display);
                    font-variant-numeric: tabular-nums;
                "
            >
                {{ fmt(props.totalEarned) }}
                <span
                    class="text-[16px] font-medium"
                    style="color: var(--c-fg3)"
                    >USDT</span
                >
            </div>
            <div class="text-[12px]" style="color: var(--c-fg2)">
                Реферальные бонусы за всё время
            </div>
        </div>

        <div
            class="flex flex-col gap-1.5 rounded-[18px] bg-white px-[22px] py-5"
            style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
        >
            <div
                class="text-[12px] font-semibold tracking-[0.01em]"
                style="color: var(--c-fg3)"
            >
                Бонусных ячеек
            </div>
            <div
                class="text-[30px] font-bold tracking-[-0.02em]"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-display);
                    font-variant-numeric: tabular-nums;
                "
            >
                {{ props.filledCells }} / 5
            </div>
            <div class="text-[12px]" style="color: var(--c-fg2)">
                На Level {{ props.maxLevel }} (текущий активный пакет)
            </div>
            <div
                class="mt-2 h-1.5 overflow-hidden rounded-[3px]"
                style="background: var(--c-cell-empty-bg)"
            >
                <div
                    class="h-full rounded-[3px]"
                    :style="{ width: cellsPct + '%', background: 'var(--c-success)' }"
                />
            </div>
        </div>

        <div
            class="flex flex-col gap-1.5 rounded-[18px] bg-white px-[22px] py-5"
            style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
        >
            <div
                class="text-[12px] font-semibold tracking-[0.01em]"
                style="color: var(--c-fg3)"
            >
                Правило 5 друзей
            </div>
            <div
                class="text-[30px] font-bold tracking-[-0.02em]"
                style="
                    color: var(--c-fg1);
                    font-family: var(--c-font-display);
                    font-variant-numeric: tabular-nums;
                "
            >
                {{ props.activeCount }} / 5
            </div>
            <div class="text-[12px]" style="color: var(--c-fg2)">
                <template v-if="props.activeCount < 5">
                    Пригласите ещё {{ 5 - props.activeCount }}, чтобы закрыть
                    цикл
                </template>
                <template v-else>Цикл закрыт ✓</template>
            </div>
            <div class="mt-2 flex gap-1">
                <div
                    v-for="(filled, i) in friends"
                    :key="i"
                    class="h-2.5 flex-1 rounded-[5px]"
                    :style="
                        filled
                            ? 'background: var(--c-success)'
                            : 'background: var(--c-cell-empty-bg); box-shadow: inset 0 0 0 1px var(--c-cell-empty-ring)'
                    "
                />
            </div>
        </div>
    </div>
</template>
