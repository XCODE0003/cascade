<script setup lang="ts">
const columns = [
    {
        title: 'Продукт',
        links: ['Как это работает', 'Тарифы', 'Двойной замок', 'Каскад'],
    },
    {
        title: 'Безопасность',
        links: ['Анти-абуз', 'ACID-транзакции', 'Холд 72 ч'],
    },
    {
        title: 'Помощь',
        links: ['FAQ', 'Поддержка', 'Telegram-канал'],
    },
];
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
                <a
                    v-for="link in col.links"
                    :key="link"
                    class="block cursor-pointer py-[5px] text-[13px] font-medium no-underline"
                    style="color: var(--c-fg1)"
                    >{{ link }}</a
                >
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
