<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        active?: boolean;
        link?: string;
    }>(),
    {
        active: true,
        link: '',
    },
);

const copied = ref(false);

function copy(): void {
    if (props.link) {
        navigator.clipboard.writeText(props.link).catch(() => {});
    }

    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 1400);
}
</script>

<template>
    <div
        class="flex flex-col gap-4 rounded-[20px] bg-white px-6 py-[22px]"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex items-center gap-3">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Реферальная ссылка
            </div>
            <div
                class="ml-auto inline-flex items-center gap-1.5 rounded-full px-[9px] py-[3px] text-[11px] font-semibold"
                :style="
                    active
                        ? 'background: var(--c-success-bg); color: #1a6e34'
                        : 'background: var(--c-neutral-bg); color: var(--c-fg2)'
                "
            >
                <span
                    class="h-1.5 w-1.5 rounded-full"
                    :style="{
                        background: active
                            ? 'var(--c-success)'
                            : 'var(--c-neutral)',
                    }"
                />
                {{ active ? 'Активна' : 'Неактивна' }}
            </div>
        </div>

        <div
            class="flex h-12 items-center gap-2.5 rounded-xl pr-1.5 pl-4"
            style="background: var(--c-bg-elevated)"
        >
            <div
                class="min-w-0 flex-1 overflow-hidden text-[14px] font-medium text-ellipsis whitespace-nowrap"
                style="color: var(--c-fg1); font-family: var(--c-font-mono)"
            >
                {{ props.link }}
            </div>
            <button
                class="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-white px-3.5 text-[13px] font-semibold"
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
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--c-success)"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M5 12l5 5 9-11" />
                    </svg>
                    Скопировано
                </template>
                <template v-else>
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
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <rect x="4" y="4" width="11" height="11" rx="2" />
                    </svg>
                    Копировать
                </template>
            </button>
        </div>

        <div
            v-if="!active"
            class="flex gap-2.5 rounded-xl px-3.5 py-3 text-[12px] leading-[1.45]"
            style="background: var(--c-warning-bg); color: #8c5400"
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
            <span>
                У вас нет активных пакетов. Линия временно недоступна —
                приглашённые не смогут зарегистрироваться по этой ссылке.
                Активируйте любой уровень, чтобы возобновить работу.
            </span>
        </div>
    </div>
</template>
