<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Moon, Sun } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAppearance } from '@/composables/useAppearance';
import { login, register } from '@/routes';

const links = ['Как это работает', 'Тарифы', 'Безопасность', 'FAQ'];

const { resolvedAppearance, updateAppearance } = useAppearance();

const isDark = computed(() => resolvedAppearance.value === 'dark');

function toggleTheme(): void {
    updateAppearance(isDark.value ? 'light' : 'dark');
}
</script>

<template>
    <nav
        class="sticky top-0 z-20 flex h-16 items-center px-8"
        style="
            background: var(--c-nav-bg);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid var(--c-hairline);
        "
    >
        <div class="mx-auto flex w-full max-w-[1200px] items-center gap-8">
            <Link href="/" class="flex items-center gap-2.5 no-underline">
                <img src="/glyph.svg" width="22" height="22" alt="" />
                <span
                    class="text-[17px] font-bold tracking-[-0.02em]"
                    style="color: var(--c-fg1)"
                    >Cascade</span
                >
            </Link>
            <div class="ml-6 hidden gap-6 md:flex">
                <span
                    v-for="link in links"
                    :key="link"
                    class="cursor-pointer text-sm font-medium"
                    style="color: var(--c-fg2)"
                    >{{ link }}</span
                >
            </div>
            <div class="ml-auto flex items-center gap-2.5">
                <button
                    type="button"
                    @click="toggleTheme"
                    :aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'"
                    :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--c-bg-elevated)]"
                    style="color: var(--c-fg1)"
                >
                    <component
                        :is="isDark ? Sun : Moon"
                        class="h-[18px] w-[18px]"
                    />
                </button>
                <Link
                    :href="login()"
                    class="px-3 py-2 text-sm font-medium no-underline"
                    style="color: var(--c-fg1)"
                    >Войти</Link
                >
                <Link
                    :href="register()"
                    class="inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold no-underline"
                    style="background: var(--c-fg1); color: var(--c-bg)"
                    >Регистрация</Link
                >
            </div>
        </div>
    </nav>
</template>
