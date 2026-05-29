<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/InputError.vue';
import type { Props as ManageTwoFactorProps } from '@/components/ManageTwoFactor.vue';
import ManageTwoFactor from '@/components/ManageTwoFactor.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManageTwoFactorProps;

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Безопасность',
                href: edit(),
            },
        ],
    },
});

const inputClass =
    'h-11 rounded-[11px] border-0 bg-[var(--c-bg-card)] px-3.5 text-[15px] outline-none';
const inputStyle =
    'color: var(--c-fg1); font-family: var(--c-font-text); box-shadow: inset 0 0 0 1px var(--c-input-border);';
</script>

<template>
    <Head title="Безопасность" />

    <h1 class="sr-only">Настройки безопасности</h1>

    <div
        class="flex flex-col gap-5 rounded-[18px] bg-[var(--c-bg-card)] px-6 py-6"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex flex-col gap-0.5">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Смена пароля
            </div>
            <div class="text-[13px]" style="color: var(--c-fg3)">
                Используйте длинный случайный пароль для защиты аккаунта
            </div>
        </div>

        <Form
            v-bind="SecurityController.update.form()"
            :options="{
                preserveScroll: true,
            }"
            reset-on-success
            :reset-on-error="[
                'password',
                'password_confirmation',
                'current_password',
            ]"
            class="flex flex-col gap-5"
            v-slot="{ errors, processing }"
        >
            <div class="flex flex-col gap-1.5">
                <label
                    for="current_password"
                    class="text-xs font-semibold"
                    style="color: var(--c-fg2)"
                    >Текущий пароль</label
                >
                <PasswordInput
                    id="current_password"
                    name="current_password"
                    :class="inputClass"
                    :style="inputStyle"
                    autocomplete="current-password"
                    placeholder="Текущий пароль"
                />
                <InputError :message="errors.current_password" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label
                    for="password"
                    class="text-xs font-semibold"
                    style="color: var(--c-fg2)"
                    >Новый пароль</label
                >
                <PasswordInput
                    id="password"
                    name="password"
                    :class="inputClass"
                    :style="inputStyle"
                    autocomplete="new-password"
                    placeholder="Новый пароль"
                    :passwordrules="props.passwordRules"
                />
                <InputError :message="errors.password" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label
                    for="password_confirmation"
                    class="text-xs font-semibold"
                    style="color: var(--c-fg2)"
                    >Подтверждение пароля</label
                >
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    :class="inputClass"
                    :style="inputStyle"
                    autocomplete="new-password"
                    placeholder="Повторите пароль"
                    :passwordrules="props.passwordRules"
                />
                <InputError :message="errors.password_confirmation" />
            </div>

            <div class="flex items-center gap-4">
                <button
                    type="submit"
                    :disabled="processing"
                    data-test="update-password-button"
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

    <ManageTwoFactor
        :canManageTwoFactor="canManageTwoFactor"
        :requiresConfirmation="requiresConfirmation"
        :twoFactorEnabled="twoFactorEnabled"
    />
</template>
