<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { register } from '@/routes';

interface ConceptFact {
    label: string;
    value: string;
}

interface ConceptBlock {
    heading: string;
    body: string[];
}

defineProps<{
    eyebrow: string;
    title: string;
    lead: string;
    facts?: ConceptFact[];
    blocks: ConceptBlock[];
}>();
</script>

<template>
    <article class="mx-auto max-w-[820px] px-8 pt-20 pb-24">
        <a
            href="/"
            class="inline-flex items-center gap-1.5 text-sm font-medium no-underline"
            style="color: var(--c-fg2)"
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
                <path d="M15 6l-6 6 6 6" />
            </svg>
            На главную
        </a>

        <div
            class="mt-8 mb-3.5 text-xs font-bold tracking-[0.08em] uppercase"
            style="color: var(--c-accent)"
        >
            {{ eyebrow }}
        </div>
        <h1
            class="text-[44px] leading-[1.1] font-bold tracking-[-0.03em]"
            style="font-family: var(--c-font-display); color: var(--c-fg1)"
        >
            {{ title }}
        </h1>
        <p
            class="mt-4 text-[18px] leading-relaxed font-medium"
            style="color: var(--c-fg2)"
        >
            {{ lead }}
        </p>

        <div
            v-if="facts && facts.length"
            class="mt-10 grid gap-3"
            :style="`grid-template-columns: repeat(${facts.length}, minmax(0, 1fr))`"
        >
            <div
                v-for="fact in facts"
                :key="fact.label"
                class="rounded-[16px] bg-[var(--c-bg-card)] px-5 py-4"
                style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
            >
                <div
                    class="text-[22px] font-bold tracking-[-0.02em]"
                    style="
                        font-family: var(--c-font-display);
                        color: var(--c-fg1);
                    "
                >
                    {{ fact.value }}
                </div>
                <div
                    class="mt-1 text-[12px] font-medium"
                    style="color: var(--c-fg3)"
                >
                    {{ fact.label }}
                </div>
            </div>
        </div>

        <section v-for="block in blocks" :key="block.heading" class="mt-12">
            <h2
                class="text-[24px] font-semibold tracking-[-0.02em]"
                style="font-family: var(--c-font-display); color: var(--c-fg1)"
            >
                {{ block.heading }}
            </h2>
            <p
                v-for="(paragraph, i) in block.body"
                :key="i"
                class="mt-3 text-[16px] leading-relaxed"
                style="color: var(--c-fg2)"
            >
                {{ paragraph }}
            </p>
        </section>

        <div
            class="mt-14 flex flex-col items-start gap-4 rounded-[20px] px-7 py-8"
            style="
                background: var(--c-bg-card);
                box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
            "
        >
            <div
                class="text-[20px] font-semibold tracking-[-0.01em]"
                style="font-family: var(--c-font-display); color: var(--c-fg1)"
            >
                Готовы начать?
            </div>
            <p class="text-[15px] leading-relaxed" style="color: var(--c-fg2)">
                Регистрация занимает меньше минуты. Старт с Level 1 — 20 USDT,
                никаких комиссий при выводе.
            </p>
            <Link
                :href="register()"
                class="inline-flex h-11 items-center gap-2 rounded-[14px] px-[22px] text-[15px] font-semibold no-underline"
                style="background: var(--c-fg1); color: var(--c-bg)"
            >
                Создать аккаунт
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
                    <path d="M9 6l6 6-6 6" />
                </svg>
            </Link>
        </div>
    </article>
</template>
