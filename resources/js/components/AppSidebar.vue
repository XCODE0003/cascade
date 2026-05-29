<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    BarChart2,
    Clock,
    Settings,
    ShieldCheck,
    Users,
    Wallet,
} from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

const page = usePage<{ auth: Auth }>();
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
</script>

<template>
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
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
