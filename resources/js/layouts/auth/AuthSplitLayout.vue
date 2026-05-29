<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();

const points = [
    '0% комиссии при выводе средств',
    '4 изолированных уровня — ликвидность не пересекается',
    '72-часовой холд на выплаты с возможностью отката',
    'Прозрачность: история операций в кабинете в реальном времени',
];
</script>

<template>
    <div class="relative grid min-h-dvh lg:grid-cols-2">
        <!-- LEFT VISUAL PANEL -->
        <aside
            class="relative hidden flex-col overflow-hidden p-10 text-white lg:flex"
            style="background: #1d1d1f"
        >
            <div
                class="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px]"
                style="
                    background: radial-gradient(
                        closest-side,
                        rgba(0, 122, 255, 0.32),
                        transparent 70%
                    );
                "
            />
            <Link
                :href="home()"
                class="relative flex items-center gap-2.5 no-underline"
            >
                <img src="/glyph.svg" width="22" height="22" alt="" />
                <span class="text-[17px] font-bold tracking-[-0.02em]"
                    >Cascade</span
                >
            </Link>

            <div class="relative my-auto max-w-[460px]">
                <div
                    class="mb-4 text-[11px] font-bold tracking-[0.08em] uppercase"
                    style="color: rgba(255, 255, 255, 0.6)"
                >
                    Прозрачная очередь ликвидности
                </div>
                <div
                    class="text-[40px] leading-[1.1] font-bold tracking-[-0.025em]"
                    style="font-family: var(--c-font-display)"
                >
                    Регистрация — меньше минуты.
                </div>
                <div
                    class="mt-[18px] text-base leading-relaxed"
                    style="color: rgba(255, 255, 255, 0.7)"
                >
                    Один аккаунт даёт доступ ко всем четырём очередям. Начать
                    можно с минимального уровня — 20 USDT.
                </div>

                <ul class="mt-8 flex list-none flex-col gap-3.5 p-0">
                    <li
                        v-for="point in points"
                        :key="point"
                        class="flex items-start gap-3"
                    >
                        <span
                            class="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
                            style="
                                background: rgba(0, 122, 255, 0.18);
                                color: #5ac8fa;
                            "
                        >
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
                                <path d="M5 12l5 5 9-11" />
                            </svg>
                        </span>
                        <span
                            class="text-sm leading-normal"
                            style="color: rgba(255, 255, 255, 0.85)"
                            >{{ point }}</span
                        >
                    </li>
                </ul>
            </div>

            <div
                class="relative mt-auto text-xs"
                style="color: rgba(255, 255, 255, 0.4)"
            >
                © 2026 Cascade. Это не инвестиционный продукт с фиксированным
                процентом.
            </div>
        </aside>

        <!-- RIGHT FORM PANEL -->
        <div class="flex items-center justify-center p-6 sm:p-10">
            <div class="flex w-full max-w-[400px] flex-col">
                <div class="mb-7 flex flex-col gap-2">
                    <h1
                        v-if="title"
                        class="text-[30px] font-bold tracking-[-0.025em]"
                        style="
                            color: var(--c-fg1);
                            font-family: var(--c-font-display);
                        "
                    >
                        {{ title }}
                    </h1>
                    <p
                        v-if="description"
                        class="text-sm"
                        style="color: var(--c-fg2)"
                    >
                        {{ description }}
                    </p>
                </div>
                <slot />
            </div>
        </div>
    </div>
</template>
