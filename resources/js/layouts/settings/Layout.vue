<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    { title: 'Профиль', href: editProfile() },
    { title: 'Безопасность', href: editSecurity() },
];

const { isCurrentOrParentUrl } = useCurrentUrl();
</script>

<template>
    <div
        class="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <div class="flex flex-col gap-0.5">
            <h1
                class="text-[26px] font-bold tracking-[-0.02em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Настройки
            </h1>
            <p class="text-[14px]" style="color: var(--c-fg3)">
                Управление профилем и параметрами аккаунта
            </p>
        </div>

        <div class="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <aside class="w-full shrink-0 lg:w-56">
                <nav
                    class="flex flex-row gap-1 lg:flex-col"
                    aria-label="Настройки"
                >
                    <Link
                        v-for="item in sidebarNavItems"
                        :key="String(item.href)"
                        :href="item.href"
                        class="rounded-[10px] px-3.5 py-2.5 text-[14px] font-semibold transition-colors"
                        :style="
                            isCurrentOrParentUrl(item.href)
                                ? 'background: var(--c-bg-active); color: var(--c-fg1); box-shadow: 0 1px 2px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.04)'
                                : 'background: transparent; color: var(--c-fg2)'
                        "
                    >
                        {{ item.title }}
                    </Link>
                </nav>
            </aside>

            <div class="min-w-0 flex-1">
                <div class="flex flex-col gap-6">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>
