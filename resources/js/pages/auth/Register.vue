<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

defineProps<{
    passwordRules: string;
}>();

// Lightweight browser fingerprint for anti-abuse (TЗ 7.1). Not a security
// boundary on its own — combined server-side with the signup IP.
const fingerprint = computed<string>(() => {
    const parts = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency ?? '',
    ].join('|');

    let hash = 0;
    for (let i = 0; i < parts.length; i++) {
        hash = (hash << 5) - hash + parts.charCodeAt(i);
        hash |= 0;
    }
    return 'fp_' + Math.abs(hash).toString(36);
});

defineOptions({
    layout: {
        title: 'Создание аккаунта',
        description:
            'После регистрации вы попадёте в кабинет и сможете активировать любой уровень',
    },
});
</script>

<template>
    <Head title="Регистрация" />

    <Form
        v-bind="store.form()"
        :reset-on-success="['password', 'password_confirmation']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6"
    >
        <input type="hidden" name="fingerprint" :value="fingerprint" />
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="name">Имя</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="name"
                    name="name"
                    placeholder="Ваше имя"
                />
                <InputError :message="errors.name" />
            </div>

            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    :tabindex="2"
                    autocomplete="email"
                    name="email"
                    placeholder="email@example.com"
                />
                <InputError :message="errors.email" />
            </div>

            <div class="grid gap-2">
                <Label for="password">Пароль</Label>
                <PasswordInput
                    id="password"
                    required
                    :tabindex="3"
                    autocomplete="new-password"
                    name="password"
                    placeholder="Минимум 8 символов"
                    :passwordrules="passwordRules"
                />
                <InputError :message="errors.password" />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">Повторите пароль</Label>
                <PasswordInput
                    id="password_confirmation"
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    name="password_confirmation"
                    placeholder="Повторите пароль"
                    :passwordrules="passwordRules"
                />
                <InputError :message="errors.password_confirmation" />
            </div>

            <Button
                type="submit"
                class="mt-2 w-full"
                tabindex="5"
                :disabled="processing"
                data-test="register-user-button"
            >
                <Spinner v-if="processing" />
                Создать аккаунт
            </Button>
        </div>

        <div class="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?
            <TextLink
                :href="login()"
                class="underline underline-offset-4"
                :tabindex="6"
                >Войти</TextLink
            >
        </div>
    </Form>
</template>
