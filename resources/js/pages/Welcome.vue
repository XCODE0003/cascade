<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import MarketingFooter from '@/components/cascade/marketing/MarketingFooter.vue';
import MarketingNav from '@/components/cascade/marketing/MarketingNav.vue';
import { register } from '@/routes';

interface Tier {
    level: number;
    entry: number;
    payout: number;
    perCell: number;
    color: string;
}

const tiers: Tier[] = [
    { level: 1, entry: 20, payout: 30, perCell: 6, color: '#5AC8FA' },
    { level: 2, entry: 100, payout: 150, perCell: 30, color: '#007AFF' },
    { level: 3, entry: 700, payout: 1050, perCell: 210, color: '#5856D6' },
    { level: 4, entry: 2000, payout: 3000, perCell: 600, color: '#AF52DE' },
];

const miniQueues = [
    { level: 1, entry: 20, color: '#5AC8FA', filled: 5 },
    { level: 2, entry: 100, color: '#007AFF', filled: 3 },
    { level: 3, entry: 700, color: '#5856D6', filled: 2 },
    { level: 4, entry: 2000, color: '#AF52DE', filled: 1 },
];

const splitBars = [
    { flex: 10, label: '10%', bg: 'var(--c-neutral)' },
    { flex: 60, label: '60%', bg: 'var(--c-success)' },
    { flex: 30, label: '30%', bg: 'var(--c-gold)' },
];

function fmt(n: number): string {
    return n.toLocaleString('ru-RU').replace(/,/g, ' ');
}
</script>

<template>
    <Head title="Cascade — прозрачная очередь ликвидности" />

    <div class="min-h-screen" style="background: var(--c-bg)">
        <MarketingNav />

        <!-- HERO -->
        <section class="relative overflow-hidden px-8 pt-20 pb-24">
            <div
                class="pointer-events-none absolute -top-[200px] left-1/2 h-[600px] w-[900px] -translate-x-1/2"
                style="
                    background: radial-gradient(
                        closest-side,
                        rgba(0, 122, 255, 0.1),
                        transparent 70%
                    );
                "
            />
            <div
                class="relative mx-auto flex max-w-[1080px] flex-col items-center gap-6 text-center"
            >
                <div
                    class="inline-flex items-center gap-2 rounded-full py-[5px] pr-3 pl-2 text-xs font-semibold"
                    style="
                        background: var(--c-bg-card);
                        box-shadow:
                            0 1px 0 rgba(0, 0, 0, 0.04),
                            inset 0 0 0 1px var(--c-hairline);
                        color: var(--c-fg2);
                    "
                >
                    <span
                        class="h-1.5 w-1.5 rounded-full"
                        style="background: var(--c-success)"
                    />
                    Платформа распределяет 100% входящих средств
                </div>
                <h1
                    class="max-w-[880px] text-[64px] leading-[1.05] font-bold tracking-[-0.035em]"
                    style="
                        color: var(--c-fg1);
                        font-family: var(--c-font-display);
                    "
                >
                    Прозрачная очередь<br />ликвидности.
                </h1>
                <p
                    class="max-w-[620px] text-[19px] leading-relaxed"
                    style="color: var(--c-fg2)"
                >
                    Cascade — это не инвестиционный проект с фиксированным
                    процентом. Это математическая модель распределения средств
                    между участниками по правилу «живой очереди».
                </p>
                <div class="mt-2 flex flex-wrap justify-center gap-2.5">
                    <Link
                        :href="register()"
                        class="inline-flex h-12 items-center gap-2 rounded-[14px] px-[22px] text-[15px] font-semibold no-underline"
                        style="background: var(--c-fg1); color: var(--c-bg)"
                    >
                        Начать с Level 1 · 20 USDT
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </Link>
                    <a
                        href="#how"
                        class="inline-flex h-12 items-center gap-2 rounded-[14px] px-[22px] text-[15px] font-semibold no-underline"
                        style="
                            color: var(--c-fg1);
                            box-shadow: inset 0 0 0 1px var(--c-hairline-strong);
                        "
                    >
                        Как это работает
                    </a>
                </div>

                <!-- HERO VISUAL -->
                <div
                    class="mt-12 flex w-full max-w-[920px] flex-col gap-4 rounded-3xl bg-[var(--c-bg-card)] px-7 py-6"
                    style="
                        box-shadow:
                            0 24px 64px rgba(0, 0, 0, 0.08),
                            0 2px 6px rgba(0, 0, 0, 0.04);
                    "
                >
                    <div
                        class="flex items-center gap-2.5 pb-3.5"
                        style="border-bottom: 1px solid var(--c-hairline)"
                    >
                        <img src="/glyph.svg" width="20" height="20" alt="" />
                        <span
                            class="text-[17px] font-semibold"
                            style="font-family: var(--c-font-display)"
                            >Активные очереди</span
                        >
                        <span
                            class="ml-auto text-xs"
                            style="
                                font-family: var(--c-font-mono);
                                color: var(--c-fg3);
                            "
                            >4 уровня · изолированные котлы</span
                        >
                    </div>
                    <div class="grid grid-cols-2 gap-3.5 md:grid-cols-4">
                        <div
                            v-for="q in miniQueues"
                            :key="q.level"
                            class="flex flex-col gap-2.5 rounded-[14px] px-3.5 pt-3.5 pb-4"
                            style="background: var(--c-bg)"
                        >
                            <div
                                class="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase"
                                style="color: var(--c-fg2)"
                            >
                                <span
                                    class="h-1.5 w-1.5 rounded-full"
                                    :style="{ background: q.color }"
                                />Level {{ q.level }}
                            </div>
                            <div
                                class="text-[22px] font-bold tracking-[-0.02em]"
                                style="
                                    font-family: var(--c-font-display);
                                    font-variant-numeric: tabular-nums;
                                "
                            >
                                {{ fmt(q.entry)
                                }}<span
                                    class="ml-1 text-xs font-medium"
                                    style="color: var(--c-fg3)"
                                    >USDT</span
                                >
                            </div>
                            <div class="flex gap-[3px]">
                                <div
                                    v-for="i in 5"
                                    :key="i"
                                    class="h-4 flex-1 rounded"
                                    :style="
                                        i <= q.filled
                                            ? 'background: var(--c-success)'
                                            : 'background: var(--c-cell-empty-bg); box-shadow: inset 0 0 0 1px var(--c-cell-empty-ring)'
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PILLARS -->
        <section class="mx-auto max-w-[1200px] px-8 py-24">
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div
                    class="rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[22px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-[30px] font-bold tracking-[-0.02em]"
                        style="
                            font-family: var(--c-font-display);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        10/60/30
                    </div>
                    <div
                        class="mt-1.5 text-[13px] leading-snug"
                        style="color: var(--c-fg2)"
                    >
                        Сплит каждого депозита: сервис · реферер · очередь
                    </div>
                </div>
                <div
                    class="rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[22px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-[30px] font-bold tracking-[-0.02em]"
                        style="
                            font-family: var(--c-font-display);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        5 <span style="color: var(--c-fg3)">/</span> 5
                    </div>
                    <div
                        class="mt-1.5 text-[13px] leading-snug"
                        style="color: var(--c-fg2)"
                    >
                        Ячеек до закрытия цикла. Выплата — 150% от номинала
                    </div>
                </div>
                <div
                    class="rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[22px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-[30px] font-bold tracking-[-0.02em]"
                        style="
                            font-family: var(--c-font-display);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        7
                        <span style="color: var(--c-fg3); font-size: 18px"
                            >дней</span
                        >
                    </div>
                    <div
                        class="mt-1.5 text-[13px] leading-snug"
                        style="color: var(--c-fg2)"
                    >
                        Двойной замок. Минимальное время с момента покупки
                        уровня
                    </div>
                </div>
                <div
                    class="rounded-[18px] bg-[var(--c-bg-card)] px-5 py-[22px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-[30px] font-bold tracking-[-0.02em]"
                        style="
                            font-family: var(--c-font-display);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        0%
                    </div>
                    <div
                        class="mt-1.5 text-[13px] leading-snug"
                        style="color: var(--c-fg2)"
                    >
                        Комиссия при выводе. Получаете ровно сумму баланса
                    </div>
                </div>
            </div>
        </section>

        <!-- HOW IT WORKS -->
        <section id="how" class="mx-auto max-w-[1200px] px-8 py-24">
            <div
                class="mb-3.5 text-xs font-bold tracking-[0.08em] uppercase"
                style="color: var(--c-accent)"
            >
                Как это работает
            </div>
            <h2
                class="max-w-[720px] text-[44px] leading-[1.1] font-bold tracking-[-0.03em]"
                style="font-family: var(--c-font-display)"
            >
                Три шага между депозитом и выплатой.
            </h2>
            <p
                class="mt-3.5 max-w-[640px] text-[17px] leading-relaxed"
                style="color: var(--c-fg2)"
            >
                Cascade не двигает деньги вне очереди. Каждый USDT, поступивший
                на платформу, движется по правилам, видимым в реальном времени
                из кабинета.
            </p>

            <div class="mt-12 grid gap-4 md:grid-cols-3">
                <!-- step 1 -->
                <div
                    class="flex flex-col gap-3 rounded-[20px] bg-[var(--c-bg-card)] px-6 pt-7 pb-[26px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-xs font-bold tracking-[0.06em]"
                        style="
                            font-family: var(--c-font-mono);
                            color: var(--c-fg3);
                        "
                    >
                        01 · ДЕПОЗИТ
                    </div>
                    <div
                        class="mt-1 text-[22px] font-semibold tracking-[-0.01em]"
                        style="font-family: var(--c-font-display)"
                    >
                        Сплит входа
                    </div>
                    <div
                        class="text-sm leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        10% — сервису. 60% — рефереру при соответствии его
                        уровня. 30% — первому в очереди по правилу каскада. При
                        «обрезке» бонус 60% не пропадает, а уходит в очередь.
                    </div>
                    <div class="mt-1.5 flex h-16 items-center">
                        <div class="flex w-full gap-1">
                            <div
                                v-for="bar in splitBars"
                                :key="bar.label"
                                class="flex h-4 items-center justify-center rounded text-[10px] font-bold text-white"
                                :style="{ flex: bar.flex, background: bar.bg }"
                            >
                                {{ bar.label }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- step 2 -->
                <div
                    class="flex flex-col gap-3 rounded-[20px] bg-[var(--c-bg-card)] px-6 pt-7 pb-[26px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-xs font-bold tracking-[0.06em]"
                        style="
                            font-family: var(--c-font-mono);
                            color: var(--c-fg3);
                        "
                    >
                        02 · ОЧЕРЕДЬ
                    </div>
                    <div
                        class="mt-1 text-[22px] font-semibold tracking-[-0.01em]"
                        style="font-family: var(--c-font-display)"
                    >
                        Закрашивание ячеек
                    </div>
                    <div
                        class="text-sm leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        Каждая входящая ячейка заполняет ваш счётчик. Излишек
                        автоматически переходит следующему в очереди — это и
                        есть каскад. 5 ячеек = 150% от вклада.
                    </div>
                    <div class="mt-1.5 flex h-16 items-center">
                        <div class="flex gap-1">
                            <div
                                v-for="i in 5"
                                :key="i"
                                class="h-8 w-[26px] rounded-md"
                                :style="
                                    i <= 3
                                        ? 'background: var(--c-success)'
                                        : i === 4
                                          ? 'background: var(--c-cell-bonus)'
                                          : 'background: var(--c-cell-empty-bg); box-shadow: inset 0 0 0 1px var(--c-cell-empty-ring)'
                                "
                            />
                        </div>
                    </div>
                </div>

                <!-- step 3 -->
                <div
                    class="flex flex-col gap-3 rounded-[20px] bg-[var(--c-bg-card)] px-6 pt-7 pb-[26px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="text-xs font-bold tracking-[0.06em]"
                        style="
                            font-family: var(--c-font-mono);
                            color: var(--c-fg3);
                        "
                    >
                        03 · ВЫВОД
                    </div>
                    <div
                        class="mt-1 text-[22px] font-semibold tracking-[-0.01em]"
                        style="font-family: var(--c-font-display)"
                    >
                        Двойной замок
                    </div>
                    <div
                        class="text-sm leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        Кнопка «Вывод» активируется при выполнении двух условий:
                        5/5 ячеек закрашены И прошло 7 полных суток с момента
                        входа. Холд — 72 часа.
                    </div>
                    <div class="mt-1.5 flex h-16 items-center gap-3">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--c-accent)"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect x="5" y="11" width="14" height="9" rx="2" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                        </svg>
                        <div class="flex-1">
                            <div
                                class="h-1.5 overflow-hidden rounded-full"
                                style="background: var(--c-cell-empty-bg)"
                            >
                                <div
                                    class="h-full"
                                    style="
                                        width: 64%;
                                        background: var(--c-accent);
                                    "
                                />
                            </div>
                            <div
                                class="mt-1.5 text-[11px]"
                                style="
                                    font-family: var(--c-font-mono);
                                    color: var(--c-accent);
                                    font-variant-numeric: tabular-nums;
                                "
                            >
                                4 д 12:32:08 до разблокировки
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TIERS -->
        <section class="mx-auto max-w-[1200px] px-8 py-24">
            <div
                class="mb-3.5 text-xs font-bold tracking-[0.08em] uppercase"
                style="color: var(--c-accent)"
            >
                Тарифы
            </div>
            <h2
                class="max-w-[720px] text-[44px] leading-[1.1] font-bold tracking-[-0.03em]"
                style="font-family: var(--c-font-display)"
            >
                Четыре изолированных уровня.
            </h2>
            <p
                class="mt-3.5 max-w-[640px] text-[17px] leading-relaxed"
                style="color: var(--c-fg2)"
            >
                Ликвидность каждого уровня — отдельный котёл. Депозиты в очереди
                700 закрывают ячейки только участникам очереди 700. Можно
                покупать все уровни одновременно.
            </p>

            <div
                class="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
            >
                <div
                    v-for="t in tiers"
                    :key="t.level"
                    class="relative flex flex-col gap-3 overflow-hidden rounded-[20px] bg-[var(--c-bg-card)] px-[22px] pt-6 pb-[22px]"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="absolute top-0 right-0 left-0 h-[3px]"
                        :style="{ background: t.color }"
                    />
                    <div
                        class="text-xs font-bold tracking-[0.06em] uppercase"
                        style="color: var(--c-fg2)"
                    >
                        Level {{ t.level }}
                    </div>
                    <div
                        class="text-[30px] font-bold tracking-[-0.02em]"
                        style="
                            font-family: var(--c-font-display);
                            font-variant-numeric: tabular-nums;
                        "
                    >
                        {{ fmt(t.entry)
                        }}<span
                            class="ml-1 text-[15px] font-medium"
                            style="color: var(--c-fg3)"
                            >USDT</span
                        >
                    </div>
                    <div>
                        <div
                            class="flex justify-between py-1.5 text-xs"
                            style="border-top: 1px solid var(--c-hairline-soft)"
                        >
                            <span style="color: var(--c-fg3)"
                                >За ячейку (30%)</span
                            >
                            <span
                                style="
                                    color: var(--c-fg1);
                                    font-family: var(--c-font-mono);
                                    font-weight: 600;
                                    font-variant-numeric: tabular-nums;
                                "
                                >{{ t.perCell }} USDT</span
                            >
                        </div>
                        <div
                            class="flex justify-between py-1.5 text-xs"
                            style="border-top: 1px solid var(--c-hairline-soft)"
                        >
                            <span style="color: var(--c-fg3)">Цикл (150%)</span>
                            <span
                                style="
                                    color: var(--c-fg1);
                                    font-family: var(--c-font-mono);
                                    font-weight: 600;
                                    font-variant-numeric: tabular-nums;
                                "
                                >{{ fmt(t.payout) }} USDT</span
                            >
                        </div>
                        <div
                            class="flex justify-between py-1.5 text-xs"
                            style="border-top: 1px solid var(--c-hairline-soft)"
                        >
                            <span style="color: var(--c-fg3)">Замок</span>
                            <span
                                style="
                                    color: var(--c-fg1);
                                    font-family: var(--c-font-mono);
                                    font-weight: 600;
                                    font-variant-numeric: tabular-nums;
                                "
                                >5/5 + 7 д</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECURITY -->
        <section class="mx-auto max-w-[1200px] px-8 py-24">
            <div
                class="mb-3.5 text-xs font-bold tracking-[0.08em] uppercase"
                style="color: var(--c-accent)"
            >
                Безопасность
            </div>
            <h2
                class="max-w-[720px] text-[44px] leading-[1.1] font-bold tracking-[-0.03em]"
                style="font-family: var(--c-font-display)"
            >
                Платформа технически не может уйти в дефицит.
            </h2>
            <p
                class="mt-3.5 max-w-[640px] text-[17px] leading-relaxed"
                style="color: var(--c-fg2)"
            >
                Распределяется только 100% входящих средств. Никаких
                фиксированных процентов, никаких внешних обязательств — только
                математика очереди.
            </p>

            <div class="mt-12 grid gap-4 md:grid-cols-3">
                <div
                    class="flex flex-col gap-2 rounded-[18px] bg-[var(--c-bg-card)] p-6"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="mb-1.5 flex h-9 w-9 items-center justify-center rounded-[10px]"
                        style="
                            background: var(--c-accent-bg);
                            color: var(--c-accent);
                        "
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect x="5" y="11" width="14" height="9" rx="2" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                        </svg>
                    </div>
                    <div
                        class="text-base font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        ACID-транзакции
                    </div>
                    <div
                        class="text-[13px] leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        Каждая финансовая операция атомарна.
                        <code style="font-family: var(--c-font-mono)"
                            >SELECT FOR UPDATE</code
                        >
                        на счётчике ячеек исключает «состояние гонки» — одна
                        ячейка не может быть зачислена двум людям одновременно.
                    </div>
                </div>
                <div
                    class="flex flex-col gap-2 rounded-[18px] bg-[var(--c-bg-card)] p-6"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="mb-1.5 flex h-9 w-9 items-center justify-center rounded-[10px]"
                        style="
                            background: var(--c-accent-bg);
                            color: var(--c-accent);
                        "
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="9" cy="8" r="3.2" />
                            <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
                            <circle cx="17" cy="7" r="2.5" />
                            <path d="M16 13c2.5 0 5 1.5 5 4" />
                        </svg>
                    </div>
                    <div
                        class="text-base font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        Анти-абуз
                    </div>
                    <div
                        class="text-[13px] leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        Самоприглашения и циклические рефералы блокируются по IP
                        и отпечатку браузера. При несоответствии уровней бонус
                        не пропадает — он ускоряет очередь.
                    </div>
                </div>
                <div
                    class="flex flex-col gap-2 rounded-[18px] bg-[var(--c-bg-card)] p-6"
                    style="box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04)"
                >
                    <div
                        class="mb-1.5 flex h-9 w-9 items-center justify-center rounded-[10px]"
                        style="
                            background: var(--c-accent-bg);
                            color: var(--c-accent);
                        "
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M21 12a9 9 0 1 1-3-6.7" />
                            <path d="M21 4v5h-5" />
                        </svg>
                    </div>
                    <div
                        class="text-base font-semibold"
                        style="color: var(--c-fg1)"
                    >
                        Авто-реинвест
                    </div>
                    <div
                        class="text-[13px] leading-relaxed"
                        style="color: var(--c-fg2)"
                    >
                        Если 5/5 закрыто и пользователь не возвращается 3 дня,
                        средства принудительно идут в очередь активным
                        участникам. Касса не зависает на «мёртвых» аккаунтах.
                    </div>
                </div>
            </div>
        </section>

        <!-- FINAL CTA -->
        <section
            class="relative mx-auto mb-24 flex max-w-[1200px] flex-col items-center gap-[18px] overflow-hidden rounded-[28px] px-12 py-16 text-center"
            style="background: #1d1d1f; color: #fff"
        >
            <div
                class="pointer-events-none absolute -top-[120px] -right-[100px] h-[420px] w-[420px]"
                style="
                    background: radial-gradient(
                        closest-side,
                        rgba(0, 122, 255, 0.3),
                        transparent 70%
                    );
                "
            />
            <h2
                class="relative max-w-[640px] text-[44px] leading-[1.1] font-bold tracking-[-0.03em] text-white"
                style="font-family: var(--c-font-display)"
            >
                Начните с минимального уровня.
            </h2>
            <p
                class="relative max-w-[540px] text-[17px] leading-relaxed"
                style="color: rgba(255, 255, 255, 0.7)"
            >
                20 USDT, никаких подписок, никаких комиссий при выводе.
                Регистрация занимает меньше минуты.
            </p>
            <Link
                :href="register()"
                class="relative mt-3 inline-flex h-12 items-center gap-2 rounded-[14px] px-7 text-[15px] font-semibold no-underline"
                style="background: #fff; color: #1d1d1f"
            >
                Создать аккаунт
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M9 6l6 6-6 6" />
                </svg>
            </Link>
        </section>

        <MarketingFooter />
    </div>
</template>
