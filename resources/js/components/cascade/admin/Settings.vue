<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { reactive } from 'vue';

interface AdminSettings {
    hold_hours: string;
    double_lock_days: string;
    auto_reinvest_days: string;
    min_withdrawal: string;
    westwallet_base_url: string;
    westwallet_public_key: string;
    westwallet_private_key: string;
    westwallet_currency: string;
    westwallet_ipn_secret: string;
    westwallet_auto_payout: boolean;
}

interface ToggleSetting {
    title: string;
    sub: string;
    on: boolean;
}

const props = defineProps<{ initialSettings: AdminSettings }>();

interface TimingSetting {
    key: keyof AdminSettings;
    title: string;
    sub: string;
    value: string;
    unit: string;
}

const timings = reactive<TimingSetting[]>([
    {
        key: 'hold_hours',
        title: 'Холд на вывод',
        sub: 'Заявка остаётся в статусе «В ожидании» этот срок до начала выплаты. 0 — без холда (для теста). Сокращение применяется и к текущим заявкам.',
        value: props.initialSettings.hold_hours,
        unit: 'часов',
    },
    {
        key: 'double_lock_days',
        title: 'Двойной замок',
        sub: 'Минимальное количество дней с момента покупки уровня до возможности вывода (даже при 5/5). 0 — без замка (для теста). Сокращение применяется и к текущим записям в очередях.',
        value: props.initialSettings.double_lock_days,
        unit: 'дней',
    },
    {
        key: 'auto_reinvest_days',
        title: 'Авто-реинвест за прогулы',
        sub: 'Если пользователь не зашёл после выполнения «Двойного замка» — система запускает реинвест за него.',
        value: props.initialSettings.auto_reinvest_days,
        unit: 'дней',
    },
]);

const minWithdraw = reactive({ value: props.initialSettings.min_withdrawal });

const westwallet = reactive({
    base_url: props.initialSettings.westwallet_base_url ?? '',
    public_key: props.initialSettings.westwallet_public_key ?? '',
    private_key: props.initialSettings.westwallet_private_key ?? '',
    currency: props.initialSettings.westwallet_currency ?? '',
    ipn_secret: props.initialSettings.westwallet_ipn_secret ?? '',
    auto_payout: props.initialSettings.westwallet_auto_payout ?? false,
});

interface WalletField {
    key: 'base_url' | 'public_key' | 'private_key' | 'currency' | 'ipn_secret';
    title: string;
    sub: string;
    secret: boolean;
    placeholder: string;
}

const walletFields: WalletField[] = [
    {
        key: 'base_url',
        title: 'API URL',
        sub: 'Базовый адрес WestWallet API.',
        secret: false,
        placeholder: 'https://api.westwallet.io',
    },
    {
        key: 'public_key',
        title: 'Public Key',
        sub: 'Публичный ключ API (X-API-KEY).',
        secret: false,
        placeholder: '—',
    },
    {
        key: 'private_key',
        title: 'Private Key',
        sub: 'Приватный ключ для подписи запросов. Хранится в БД.',
        secret: true,
        placeholder: '—',
    },
    {
        key: 'currency',
        title: 'Валюта',
        sub: 'Код валюты для генерации адресов (USDT TRC-20 → USDTTRC).',
        secret: false,
        placeholder: 'USDTTRC',
    },
    {
        key: 'ipn_secret',
        title: 'IPN — разрешённые IP',
        sub: 'IP-адреса WestWallet для приёма IPN (через запятую). По умолчанию 5.188.51.47.',
        secret: false,
        placeholder: '5.188.51.47',
    },
];

const financialToggles = reactive<ToggleSetting[]>([
    {
        title: 'Авто-реинвест включён',
        sub: 'Принудительный реинвест за прогулы. Защищает кассу от «мёртвых» балансов.',
        on: true,
    },
]);

const securityToggles = reactive<ToggleSetting[]>([
    {
        title: 'Проверка IP / Fingerprint',
        sub: 'Блокировать регистрацию по реферальной ссылке при совпадении отпечатка браузера.',
        on: true,
    },
    {
        title: 'Проверка циклических связей',
        sub: 'Не допускать ситуаций, где A пригласил B, а B — A. База отвергает такие записи.',
        on: true,
    },
]);

function toggle(setting: ToggleSetting): void {
    setting.on = !setting.on;
}

function save(): void {
    router.post(
        '/admin/settings',
        {
            hold_hours: timings[0].value,
            double_lock_days: timings[1].value,
            auto_reinvest_days: timings[2].value,
            min_withdrawal: minWithdraw.value,
            westwallet_base_url: westwallet.base_url,
            westwallet_public_key: westwallet.public_key,
            westwallet_private_key: westwallet.private_key,
            westwallet_currency: westwallet.currency,
            westwallet_ipn_secret: westwallet.ipn_secret,
            westwallet_auto_payout: westwallet.auto_payout,
        },
        { preserveScroll: true },
    );
}

function reset(): void {
    timings[0].value = props.initialSettings.hold_hours;
    timings[1].value = props.initialSettings.double_lock_days;
    timings[2].value = props.initialSettings.auto_reinvest_days;
    minWithdraw.value = props.initialSettings.min_withdrawal;
    westwallet.base_url = props.initialSettings.westwallet_base_url ?? '';
    westwallet.public_key = props.initialSettings.westwallet_public_key ?? '';
    westwallet.private_key = props.initialSettings.westwallet_private_key ?? '';
    westwallet.currency = props.initialSettings.westwallet_currency ?? '';
    westwallet.ipn_secret = props.initialSettings.westwallet_ipn_secret ?? '';
    westwallet.auto_payout =
        props.initialSettings.westwallet_auto_payout ?? false;
}
</script>

<template>
    <div
        class="rounded-[18px] bg-(--c-bg-card) px-4 py-5 sm:px-7 sm:py-6"
        style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
    >
        <div class="mb-7">
            <div
                class="mb-3 text-[11px] font-bold tracking-[0.06em] uppercase"
                style="color: var(--c-fg3)"
            >
                Тайминги
            </div>
            <div
                v-for="(row, i) in timings"
                :key="row.key"
                class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                :style="
                    i === 0
                        ? ''
                        : 'border-top: 1px solid var(--c-hairline-soft)'
                "
            >
                <div class="flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        {{ row.title }}
                    </div>
                    <div
                        class="mt-0.5 text-xs leading-[1.45]"
                        style="color: var(--c-fg3)"
                    >
                        {{ row.sub }}
                    </div>
                </div>
                <input
                    v-model="row.value"
                    class="h-9 w-full rounded-[9px] bg-(--c-bg-card) px-3 text-left text-sm font-semibold outline-none sm:w-24 sm:text-right"
                    style="
                        box-shadow: inset 0 0 0 1px var(--c-input-border);
                        font-family: var(--c-font-mono);
                        color: var(--c-fg1);
                    "
                />
                <span
                    class="text-xs sm:ml-1.5"
                    style="color: var(--c-fg3); min-width: 40px"
                >
                    {{ row.unit }}
                </span>
            </div>
        </div>

        <div class="mb-7">
            <div
                class="mb-3 text-[11px] font-bold tracking-[0.06em] uppercase"
                style="color: var(--c-fg3)"
            >
                Финансовые лимиты
            </div>
            <div class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                <div class="flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        Минимальная сумма вывода
                    </div>
                    <div
                        class="mt-0.5 text-xs leading-[1.45]"
                        style="color: var(--c-fg3)"
                    >
                        Кнопка «Вывод» в кабинете заблокирована, если итоговый
                        баланс ниже этого порога.
                    </div>
                </div>
                <input
                    v-model="minWithdraw.value"
                    class="h-9 w-full rounded-[9px] bg-(--c-bg-card) px-3 text-left text-sm font-semibold outline-none sm:w-24 sm:text-right"
                    style="
                        box-shadow: inset 0 0 0 1px var(--c-input-border);
                        font-family: var(--c-font-mono);
                        color: var(--c-fg1);
                    "
                />
                <span
                    class="text-xs sm:ml-1.5"
                    style="color: var(--c-fg3); min-width: 40px"
                >
                    USDT
                </span>
            </div>
            <div
                v-for="row in financialToggles"
                :key="row.title"
                class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                style="border-top: 1px solid var(--c-hairline-soft)"
            >
                <div class="flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        {{ row.title }}
                    </div>
                    <div
                        class="mt-0.5 text-xs leading-[1.45]"
                        style="color: var(--c-fg3)"
                    >
                        {{ row.sub }}
                    </div>
                </div>
                <div
                    class="relative cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
                    style="width: 51px; height: 31px"
                    :style="{
                        background: row.on
                            ? 'var(--c-success)'
                            : 'var(--c-neutral-bg)',
                    }"
                    @click="toggle(row)"
                >
                    <div
                        class="absolute rounded-full bg-(--c-knob) transition-transform duration-200 ease-in-out"
                        style="
                            top: 2px;
                            left: 2px;
                            width: 27px;
                            height: 27px;
                            box-shadow:
                                0 3px 8px rgba(0, 0, 0, 0.15),
                                0 1px 1px rgba(0, 0, 0, 0.06);
                        "
                        :style="{
                            transform: row.on
                                ? 'translateX(20px)'
                                : 'translateX(0)',
                        }"
                    />
                </div>
            </div>
        </div>

        <div class="mb-7">
            <div
                class="mb-3 text-[11px] font-bold tracking-[0.06em] uppercase"
                style="color: var(--c-fg3)"
            >
                Безопасность · анти-абуз
            </div>
            <div
                v-for="(row, i) in securityToggles"
                :key="row.title"
                class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                :style="
                    i === 0
                        ? ''
                        : 'border-top: 1px solid var(--c-hairline-soft)'
                "
            >
                <div class="flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        {{ row.title }}
                    </div>
                    <div
                        class="mt-0.5 text-xs leading-[1.45]"
                        style="color: var(--c-fg3)"
                    >
                        {{ row.sub }}
                    </div>
                </div>
                <div
                    class="relative cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
                    style="width: 51px; height: 31px"
                    :style="{
                        background: row.on
                            ? 'var(--c-success)'
                            : 'var(--c-neutral-bg)',
                    }"
                    @click="toggle(row)"
                >
                    <div
                        class="absolute rounded-full bg-(--c-knob) transition-transform duration-200 ease-in-out"
                        style="
                            top: 2px;
                            left: 2px;
                            width: 27px;
                            height: 27px;
                            box-shadow:
                                0 3px 8px rgba(0, 0, 0, 0.15),
                                0 1px 1px rgba(0, 0, 0, 0.06);
                        "
                        :style="{
                            transform: row.on
                                ? 'translateX(20px)'
                                : 'translateX(0)',
                        }"
                    />
                </div>
            </div>
        </div>

        <div class="mb-7">
            <div
                class="mb-3 text-[11px] font-bold tracking-[0.06em] uppercase"
                style="color: var(--c-fg3)"
            >
                Платёжный шлюз · WestWallet
            </div>

            <div
                v-for="(field, i) in walletFields"
                :key="field.key"
                class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                :style="
                    i === 0
                        ? ''
                        : 'border-top: 1px solid var(--c-hairline-soft)'
                "
            >
                <div class="flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        {{ field.title }}
                    </div>
                    <div
                        class="mt-0.5 text-xs leading-[1.45]"
                        style="color: var(--c-fg3)"
                    >
                        {{ field.sub }}
                    </div>
                </div>
                <input
                    v-model="westwallet[field.key]"
                    :type="field.secret ? 'password' : 'text'"
                    :placeholder="field.placeholder"
                    autocomplete="off"
                    class="h-9 w-full rounded-[9px] bg-(--c-bg-card) px-3 text-sm outline-none sm:w-64"
                    style="
                        box-shadow: inset 0 0 0 1px var(--c-input-border);
                        font-family: var(--c-font-mono);
                        color: var(--c-fg1);
                    "
                />
            </div>

            <div
                class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                style="border-top: 1px solid var(--c-hairline-soft)"
            >
                <div class="flex-1">
                    <div
                        class="text-sm font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        Авто-выплата при подтверждении
                    </div>
                    <div
                        class="mt-0.5 text-xs leading-[1.45]"
                        style="color: var(--c-fg3)"
                    >
                        Отправлять USDT на кошелёк автоматически при одобрении
                        заявки. Если выключено — администратор выплачивает
                        вручную.
                    </div>
                </div>
                <div
                    class="relative cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
                    style="width: 51px; height: 31px"
                    :style="{
                        background: westwallet.auto_payout
                            ? 'var(--c-success)'
                            : 'var(--c-neutral-bg)',
                    }"
                    @click="westwallet.auto_payout = !westwallet.auto_payout"
                >
                    <div
                        class="absolute rounded-full bg-(--c-knob) transition-transform duration-200 ease-in-out"
                        style="
                            top: 2px;
                            left: 2px;
                            width: 27px;
                            height: 27px;
                            box-shadow:
                                0 3px 8px rgba(0, 0, 0, 0.15),
                                0 1px 1px rgba(0, 0, 0, 0.06);
                        "
                        :style="{
                            transform: westwallet.auto_payout
                                ? 'translateX(20px)'
                                : 'translateX(0)',
                        }"
                    />
                </div>
            </div>
        </div>

        <div
            class="mt-7 flex flex-col-reverse gap-2.5 pt-5 sm:flex-row sm:justify-end"
            style="border-top: 1px solid var(--c-hairline)"
        >
            <button
                class="h-10 rounded-[11px] px-5 text-sm font-semibold sm:w-auto"
                style="background: var(--c-bg-elevated); color: var(--c-fg1)"
                @click="reset"
            >
                Сбросить
            </button>
            <button
                class="h-10 rounded-[11px] px-5 text-sm font-semibold text-white sm:w-auto"
                style="background: var(--c-accent)"
                @click="save"
            >
                Сохранить
            </button>
        </div>
    </div>
</template>
