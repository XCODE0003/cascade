<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    BarChart2,
    Clock,
    Menu,
    Settings,
    ShieldCheck,
    Users,
    Wallet,
} from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

const page = usePage<{ auth: Auth }>();
const { isCurrentUrl } = useCurrentUrl();
const isAdmin = computed<boolean>(
    () => page.props.auth?.user?.is_admin === true,
);

const mainNavItems: NavItem[] = [
    { title: 'Кабинет', href: '/dashboard', icon: BarChart2 },
    { title: 'Кошелёк', href: '/wallet', icon: Wallet },
    { title: 'Партнёры', href: '/partners', icon: Users },
    { title: 'История', href: '/history', icon: Clock },
];

const footerNavItems = computed<NavItem[]>(() => [
    ...(isAdmin.value
        ? [{ title: 'Админка', href: '/admin', icon: ShieldCheck }]
        : []),
    { title: 'Настройки', href: '/settings/profile', icon: Settings },
]);

const mobileNavItems = computed<NavItem[]>(() => [
    { title: 'Кабинет', href: '/dashboard', icon: BarChart2 },
    { title: 'Кошелёк', href: '/wallet', icon: Wallet },
    { title: 'Партнёры', href: '/partners', icon: Users },
    { title: 'История', href: '/history', icon: Clock },
    isAdmin.value
        ? { title: 'Админка', href: '/admin', icon: ShieldCheck }
        : { title: 'Ещё', href: '/settings/profile', icon: Menu },
]);
</script>

<template>
    <div class="hidden md:block">
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" as-child>
                            <Link :href="dashboard()">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain :items="mainNavItems" label="Личный кабинет" />
            </SidebarContent>

            <SidebarFooter>
                <NavMain :items="footerNavItems" label="Сервис" />
                <ThemeToggle />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    </div>

    <nav
        class="fixed right-0 bottom-0 left-0 z-50 border-t px-2 pb-[calc(env(safe-area-inset-bottom)+6px)] md:hidden"
        style="background: var(--c-bg-card); border-color: var(--c-hairline)"
    >
        <div class="grid grid-cols-5 gap-1">
            <Link
                v-for="item in mobileNavItems"
                :key="item.title"
                :href="item.href"
                class="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors"
                :style="
                    isCurrentUrl(item.href)
                        ? 'color: var(--c-accent)'
                        : 'color: var(--c-fg3)'
                "
            >
                <component :is="item.icon" class="h-5 w-5" />
                <span>{{ item.title }}</span>
            </Link>
        </div>
    </nav>
    <slot />
</template>
