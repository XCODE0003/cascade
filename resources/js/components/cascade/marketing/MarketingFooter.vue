<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterColumn {
    title: string;
    links: FooterLink[];
}

// Telegram channel — replace with the real invite link.
const TELEGRAM_URL = 'https://t.me/cascade';

const columns: FooterColumn[] = [
    {
        title: 'Продукт',
        links: [
            { label: 'Как это работает', href: '/#how' },
            { label: 'Тарифы', href: '/#tiers' },
            { label: 'Двойной замок', href: '/double-lock' },
            { label: 'Каскад', href: '/cascade' },
        ],
    },
    {
        title: 'Безопасность',
        links: [
            { label: 'Анти-абуз', href: '/anti-abuse' },
            { label: 'ACID-транзакции', href: '/acid' },
            { label: 'Холд 72 ч', href: '/hold' },
        ],
    },
    {
        title: 'Помощь',
        links: [
            { label: 'FAQ', href: '/#faq' },
            { label: 'Поддержка', href: '/#support' },
            { label: 'Telegram-канал', href: TELEGRAM_URL },
        ],
    },
];

const isExternal = (href: string): boolean => href.startsWith('http');
const isAnchor = (href: string): boolean => href.includes('#');
</script>

<template>
    <footer
        class="mt-20 px-8 pt-10 pb-8"
        style="border-top: 1px solid var(--c-hairline)"
    >
        <div
            class="mx-auto grid max-w-[1200px] gap-8"
            style="grid-template-columns: 2fr 1fr 1fr 1fr"
        >
            <div>
                <div class="mb-3 flex items-center gap-2.5">
                    <img src="/glyph.svg" width="22" height="22" alt="" />
                    <span
                        class="text-[17px] font-bold tracking-[-0.02em]"
                        style="color: var(--c-fg1)"
                        >Cascade</span
                    >
                </div>
                <div
                    class="max-w-[360px] text-[13px] leading-relaxed font-medium"
                    style="color: var(--c-fg2)"
                >
                    Прозрачная очередь ликвидности. Платформа распределяет 100%
                    входящих средств между участниками по правилу каскада и не
                    может уйти в дефицит.
                </div>
            </div>
            <div v-for="col in columns" :key="col.title">
                <div
                    class="mb-3.5 text-[11px] font-bold tracking-[0.06em] uppercase"
                    style="color: var(--c-fg2)"
                >
                    {{ col.title }}
                </div>
                <template v-for="link in col.links" :key="link.href">
                    <a
                        v-if="isExternal(link.href)"
                        :href="link.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block cursor-pointer py-[5px] text-[13px] font-medium no-underline transition-colors hover:text-[var(--c-accent)]"
                        style="color: var(--c-fg1)"
                        >{{ link.label }}</a
                    >
                    <a
                        v-else-if="isAnchor(link.href)"
                        :href="link.href"
                        class="block cursor-pointer py-[5px] text-[13px] font-medium no-underline transition-colors hover:text-[var(--c-accent)]"
                        style="color: var(--c-fg1)"
                        >{{ link.label }}</a
                    >
                    <Link
                        v-else
                        :href="link.href"
                        class="block cursor-pointer py-[5px] text-[13px] font-medium no-underline transition-colors hover:text-[var(--c-accent)]"
                        style="color: var(--c-fg1)"
                        >{{ link.label }}</Link
                    >
                </template>
            </div>
        </div>
        <div
            class="mx-auto mt-8 flex max-w-[1200px] items-center justify-between pt-5 text-xs font-medium"
            style="
                border-top: 1px solid var(--c-hairline-soft);
                color: var(--c-fg2);
            "
        >
            <span
                >© 2026 Cascade. Это не инвестиционный продукт с фиксированным
                процентом.</span
            >
            <span>v 2.0</span>
        </div>
    </footer>
</template>
