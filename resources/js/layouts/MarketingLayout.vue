<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import MarketingFooter from '@/components/cascade/marketing/MarketingFooter.vue';
import MarketingNav from '@/components/cascade/marketing/MarketingNav.vue';

defineProps<{
    title?: string;
}>();
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen" style="background: var(--c-bg)">
        <MarketingNav />
        <slot />
        <MarketingFooter />
    </div>
</template>
