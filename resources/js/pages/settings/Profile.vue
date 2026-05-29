<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import InputError from '@/components/InputError.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Профиль',
                href: edit(),
            },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <Head title="Профиль" />

    <h1 class="sr-only">Настройки профиля</h1>

    <div
        class="flex flex-col gap-5 rounded-[18px] bg-[var(--c-bg-card)] px-6 py-6"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex flex-col gap-0.5">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Профиль
            </div>
            <div class="text-[13px]" style="color: var(--c-fg3)">
                Обновите имя и адрес электронной почты
            </div>
        </div>

        <Form
            v-bind="ProfileController.update.form()"
            class="flex flex-col gap-5"
            v-slot="{ errors, processing }"
        >
            <div class="flex flex-col gap-1.5">
                <label
                    for="name"
                    class="text-xs font-semibold"
                    style="color: var(--c-fg2)"
                    >Имя</label
                >
                <input
                    id="name"
                    name="name"
                    :value="user.name"
                    required
                    autocomplete="name"
                    placeholder="Ваше имя"
                    class="h-11 rounded-[11px] border-0 bg-[var(--c-bg-card)] px-3.5 text-[15px] outline-none"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-text);
                        box-shadow: inset 0 0 0 1px var(--c-input-border);
                    "
                />
                <InputError :message="errors.name" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label
                    for="email"
                    class="text-xs font-semibold"
                    style="color: var(--c-fg2)"
                    >Email</label
                >
                <input
                    id="email"
                    type="email"
                    name="email"
                    :value="user.email"
                    required
                    autocomplete="username"
                    placeholder="email@example.com"
                    class="h-11 rounded-[11px] border-0 bg-[var(--c-bg-card)] px-3.5 text-[15px] outline-none"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-text);
                        box-shadow: inset 0 0 0 1px var(--c-input-border);
                    "
                />
                <InputError :message="errors.email" />
            </div>

            <div v-if="page.props.mustVerifyEmail && !user.email_verified_at">
                <p class="text-[13px]" style="color: var(--c-fg2)">
                    Ваш email не подтверждён.
                    <Link
                        :href="send()"
                        as="button"
                        class="underline underline-offset-4"
                        style="color: var(--c-accent)"
                    >
                        Отправить письмо повторно.
                    </Link>
                </p>

                <div
                    v-if="page.props.status === 'verification-link-sent'"
                    class="mt-2 text-[13px] font-medium"
                    style="color: var(--c-success)"
                >
                    Новая ссылка для подтверждения отправлена на ваш email.
                </div>
            </div>

            <div class="flex items-center gap-4">
                <button
                    type="submit"
                    :disabled="processing"
                    data-test="update-profile-button"
                    class="h-11 rounded-xl border-0 px-5 text-sm font-semibold"
                    :class="
                        processing ? 'cursor-not-allowed' : 'cursor-pointer'
                    "
                    style="background: var(--c-accent); color: #fff"
                >
                    Сохранить
                </button>
            </div>
        </Form>
    </div>

    <DeleteUser />
</template>
