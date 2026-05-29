<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const passwordInput = useTemplateRef('passwordInput');
</script>

<template>
    <div
        class="flex flex-col gap-5 rounded-[18px] bg-[var(--c-bg-card)] px-6 py-6"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="flex flex-col gap-0.5">
            <div
                class="text-[18px] font-semibold tracking-[-0.01em]"
                style="color: var(--c-fg1); font-family: var(--c-font-display)"
            >
                Удаление аккаунта
            </div>
            <div class="text-[13px]" style="color: var(--c-fg3)">
                Удалить аккаунт и все связанные с ним данные
            </div>
        </div>

        <div
            class="flex flex-col gap-4 rounded-[14px] px-4 py-4"
            style="background: var(--c-danger-bg)"
        >
            <div class="flex flex-col gap-0.5">
                <p class="font-semibold" style="color: var(--c-danger)">
                    Внимание
                </p>
                <p class="text-sm" style="color: var(--c-danger-fg)">
                    Действие необратимо — все данные будут удалены навсегда.
                </p>
            </div>
            <Dialog>
                <DialogTrigger as-child>
                    <button
                        data-test="delete-user-button"
                        class="h-10 self-start rounded-xl border-0 px-4 text-sm font-semibold text-white"
                        style="background: var(--c-danger)"
                    >
                        Удалить аккаунт
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <Form
                        v-bind="ProfileController.destroy.form()"
                        reset-on-success
                        @error="() => passwordInput?.focus()"
                        :options="{
                            preserveScroll: true,
                        }"
                        class="space-y-6"
                        v-slot="{ errors, processing, reset, clearErrors }"
                    >
                        <DialogHeader class="space-y-3">
                            <DialogTitle
                                >Вы уверены, что хотите удалить
                                аккаунт?</DialogTitle
                            >
                            <DialogDescription>
                                После удаления аккаунта все его данные будут
                                безвозвратно удалены. Введите пароль, чтобы
                                подтвердить удаление.
                            </DialogDescription>
                        </DialogHeader>

                        <div class="grid gap-2">
                            <Label for="password" class="sr-only">Пароль</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                ref="passwordInput"
                                placeholder="Пароль"
                            />
                            <InputError :message="errors.password" />
                        </div>

                        <DialogFooter class="gap-2">
                            <DialogClose as-child>
                                <Button
                                    variant="secondary"
                                    @click="
                                        () => {
                                            clearErrors();
                                            reset();
                                        }
                                    "
                                >
                                    Отмена
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                variant="destructive"
                                :disabled="processing"
                                data-test="confirm-delete-user-button"
                            >
                                Удалить аккаунт
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
