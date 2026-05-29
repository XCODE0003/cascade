<script setup lang="ts">
import { computed, ref } from 'vue';

interface QrCell {
    x: number;
    y: number;
}

const props = withDefaults(defineProps<{ address?: string | null }>(), {
    address: null,
});

const hasAddress = computed<boolean>(() => !!props.address);
const displayAddress = computed<string>(
    () => props.address ?? 'Адрес генерируется…',
);

const copied = ref(false);

function copy(): void {
    if (!props.address) {
        return;
    }
    navigator.clipboard.writeText(props.address);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 1400);
}

// Deterministic pseudo QR pattern — mirrors the React FakeQR component.
const qrCells = computed<QrCell[]>(() => {
    const cells = 21;
    const result: QrCell[] = [];

    for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
            const inFinder =
                (r < 7 && c < 7) ||
                (r < 7 && c >= cells - 7) ||
                (r >= cells - 7 && c < 7);
            const on = (r * 7 + c * 13 + r * c) % 5 < 2;

            if (on && !inFinder) {
                result.push({ x: c, y: r });
            }
        }
    }

    return result;
});

const finders: { x: number; y: number }[] = [
    { x: 0, y: 0 },
    { x: 14, y: 0 },
    { x: 0, y: 14 },
];
</script>

<template>
    <div
        class="flex flex-col gap-3.5 rounded-[20px] bg-white px-6 pt-6 pb-[22px]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-baseline gap-2.5">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Пополнить · USDT
            </div>
            <div class="text-xs" style="color: var(--c-fg3)">Сеть TRC-20</div>
        </div>

        <div class="flex items-center gap-[18px]">
            <div
                class="h-[124px] w-[124px] shrink-0 rounded-2xl bg-white p-2"
                style="box-shadow: inset 0 0 0 1px var(--c-hairline)"
            >
                <svg
                    viewBox="0 0 21 21"
                    width="100%"
                    height="100%"
                    shape-rendering="crispEdges"
                >
                    <rect
                        v-for="(cell, i) in qrCells"
                        :key="i"
                        :x="cell.x"
                        :y="cell.y"
                        width="1"
                        height="1"
                        fill="#1D1D1F"
                    />
                    <g v-for="f in finders" :key="`f${f.x},${f.y}`">
                        <rect
                            :x="f.x"
                            :y="f.y"
                            width="7"
                            height="7"
                            fill="#1D1D1F"
                        />
                        <rect
                            :x="f.x + 1"
                            :y="f.y + 1"
                            width="5"
                            height="5"
                            fill="#fff"
                        />
                        <rect
                            :x="f.x + 2"
                            :y="f.y + 2"
                            width="3"
                            height="3"
                            fill="#1D1D1F"
                        />
                    </g>
                </svg>
            </div>

            <div class="flex flex-1 flex-col gap-2.5">
                <div class="text-xs font-semibold" style="color: var(--c-fg2)">
                    Ваш адрес для пополнения
                </div>
                <div
                    class="flex items-center gap-2 rounded-[10px] py-2 pr-2 pl-3.5"
                    style="background: var(--c-bg-elevated)"
                >
                    <div
                        class="flex-1 overflow-hidden text-[13px] text-ellipsis whitespace-nowrap"
                        :style="{
                            color: hasAddress ? 'var(--c-fg1)' : 'var(--c-fg3)',
                            fontFamily: 'var(--c-font-mono)',
                        }"
                    >
                        {{ displayAddress }}
                    </div>
                    <button
                        :disabled="!hasAddress"
                        class="inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold"
                        :class="
                            hasAddress ? '' : 'cursor-not-allowed opacity-50'
                        "
                        style="
                            color: var(--c-fg1);
                            box-shadow:
                                0 1px 2px rgba(0, 0, 0, 0.06),
                                0 0 0 0.5px rgba(0, 0, 0, 0.04);
                        "
                        @click="copy"
                    >
                        <template v-if="copied">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--c-success)"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M5 12l5 5 9-11" />
                            </svg>
                            Готово
                        </template>
                        <template v-else>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    x="9"
                                    y="9"
                                    width="11"
                                    height="11"
                                    rx="2"
                                />
                                <rect
                                    x="4"
                                    y="4"
                                    width="11"
                                    height="11"
                                    rx="2"
                                />
                            </svg>
                            Копировать
                        </template>
                    </button>
                </div>
                <div
                    class="flex gap-2.5 rounded-[10px] px-3 py-2.5 text-xs leading-[1.45]"
                    style="
                        background: var(--c-accent-bg);
                        color: var(--c-accent-press);
                    "
                >
                    <svg
                        class="shrink-0"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v.01M12 11v5" />
                    </svg>
                    <span
                        >Переводите только USDT в сети TRC-20. Депозит
                        зачисляется после подтверждения администратором.</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>
