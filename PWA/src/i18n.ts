export const locale = 'ru' as const;

export const translations = {
  ru: {
    appName: 'Финансы',
    personalDashboard: 'Личная панель',
    dashboard: 'Панель',
    overview: 'Обзор',
    accounts: 'Счета',
    myAccounts: 'Мои счета',
    operations: 'Операции',
    categories: 'Категории',
    analytics: 'Аналитика',
    profile: 'Профиль',
    logout: 'Выйти',
    welcomeBack: 'С возвращением',
    createAccount: 'Создать аккаунт',
    signIn: 'Войти',
    login: 'Войти',
    register: 'Регистрация',
    email: 'Электронная почта',
    name: 'Имя',
    password: 'Пароль',
    loginSubtitle: 'Войдите в свою персональную финансовую панель.',
    registerSubtitle: 'Начните отслеживать ваш денежный поток.',
    addAccount: 'Добавить счёт',
    type: 'Тип',
    currency: 'Валюта',
    initialBalance: 'Начальный баланс',
    saveCategory: 'Сохранить категорию',
    createCategory: 'Создать категорию',
    incomeAndExpenses: 'Доходы и расходы',
    totalBalance: 'Общий баланс',
    income: 'Доход',
    expenses: 'Расходы',
    expense: 'Расход',
    difference: 'Разница',
    incomeVsExpenses: 'Доходы и расходы',
    expenseCategories: 'Категории расходов',
    statistics: 'Статистика',
    monthlyReport: 'Ежемесячный отчёт',
    balanceDynamics: 'Динамика баланса',
    newOperation: 'Новая операция',
    recentOperations: 'Последние операции',
    account: 'Счёт',
    category: 'Категория',
    amount: 'Сумма',
    date: 'Дата',
    description: 'Описание',
    noCategory: 'Без категории',
    selectAccount: 'Выберите счёт',
    loading: 'Загрузка...',
    memberSince: 'Участник с',
    status: 'Статус',
    active: 'Активен',
    now: 'Сейчас',
    user: 'Пользователь',
    accountDetails: 'Детали аккаунта',
    cash: 'Наличные',
    card: 'Карта',
    bank: 'Банковский счёт',
    savings: 'Сбережения',
    other: 'Другое',
    noDescription: 'Операция',
  },
} as const;

export const t = translations.ru;

export const accountTypeLabels = {
  CASH: t.cash,
  CARD: t.card,
  BANK: t.bank,
  SAVINGS: t.savings,
  OTHER: t.other,
} as const;

export const categoryTypeLabels = {
  INCOME: t.income,
  EXPENSE: t.expense,
} as const;

export const formatAccountType = (value: string) => accountTypeLabels[value as keyof typeof accountTypeLabels] ?? value;
export const formatCategoryType = (value: string) => categoryTypeLabels[value as keyof typeof categoryTypeLabels] ?? value;
