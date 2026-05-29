<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import BonusStats from '@/components/cascade/partner/BonusStats.vue';
import InvitesTable from '@/components/cascade/partner/InvitesTable.vue';
import MissedEarnings from '@/components/cascade/partner/MissedEarnings.vue';
import RefLinkCard from '@/components/cascade/partner/RefLinkCard.vue';

interface Partner {
    id: number;
    name: string;
    level: number | null;
    earned: number;
    joined: string;
    active: boolean;
}

const props = withDefaults(
    defineProps<{
        referralLink?: string;
        referralActive?: boolean;
        totalEarned?: number;
        totalMissed?: number;
        filledCells?: number;
        maxLevel?: number;
        partnersCount?: number;
        activeCount?: number;
        partners?: Partner[];
    }>(),
    {
        referralLink: '',
        referralActive: false,
        totalEarned: 0,
        totalMissed: 0,
        filledCells: 0,
        maxLevel: 1,
        partnersCount: 0,
        activeCount: 0,
        partners: () => [],
    },
);

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Партнёры', href: '/partners' }],
    },
});
</script>

<template>
    <Head title="Партнёры" />

    <div
        class="flex h-full flex-1 flex-col gap-[18px] p-6 lg:p-8"
        style="background: var(--c-bg)"
    >
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RefLinkCard :active="props.referralActive" :link="props.referralLink" />
            <MissedEarnings :total-missed="props.totalMissed" />
        </div>

        <BonusStats
            :total-earned="props.totalEarned"
            :filled-cells="props.filledCells"
            :max-level="props.maxLevel"
            :active-count="props.activeCount"
        />

        <InvitesTable
            :partners="props.partners"
            :partners-count="props.partnersCount"
            :active-count="props.activeCount"
        />
    </div>
</template>
