<script setup lang="ts">
const props = withDefaults(defineProps<{ totalMissed?: number }>(), {
    totalMissed: 0,
});

function fmt(n: number): string {
    return n.toLocaleString('ru-RU').replace(/,/g, ' ');
}
</script>

<template>
    <div
        class="relative flex flex-col gap-3.5 overflow-hidden rounded-[20px] bg-[var(--c-bg-card)] px-6 py-[22px]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div
            class="pointer-events-none absolute -top-20 -right-[60px] h-60 w-60"
            style="
                background: radial-gradient(
                    closest-side,
                    rgba(255, 159, 10, 0.1),
                    transparent
                );
            "
        />

        <div class="relative flex items-baseline justify-between">
            <div>
                <div
                    class="text-[18px] font-semibold tracking-[-0.01em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Упущенная прибыль
                </div>
                <div class="text-[12px]" style="color: var(--c-fg3)">
                    Бонусы, ушедшие в очередь из-за «обрезки»
                </div>
            </div>
        </div>

        <div
            class="relative text-[38px] font-bold tracking-[-0.02em]"
            style="
                color: var(--c-warning);
                font-family: var(--c-font-display);
                font-variant-numeric: tabular-nums;
            "
        >
            {{ fmt(props.totalMissed) }}
            <span
                class="ml-1.5 text-[18px] font-medium"
                style="color: var(--c-fg3)"
                >USDT</span
            >
        </div>

        <div
            v-if="props.totalMissed === 0"
            class="text-[13px]"
            style="color: var(--c-fg3)"
        >
            Упущенных бонусов нет
        </div>
    </div>
</template>
