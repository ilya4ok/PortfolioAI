export type Lang = 'EN' | 'UA'

export const t = {
  EN: {
    nav: {
      home: 'Home', cases: 'Cases', about: 'About', contact: 'Contact',
    },
    hero: {
      role: 'AI Automation Specialist',
      line1: 'I build systems that run',
      line2: 'without you',
      cta_primary: 'Get a free audit',
      cta_secondary: 'View Cases',
      tools: ['Make', 'n8n', 'Claude API', 'No-code'],
      stats: [
        { value: '6+', label: 'Automations built' },
        { value: '90%', label: 'Avg. time saved' },
        { value: '< 1 week', label: 'Brief to production' },
      ],
    },
    cases: {
      heading: 'Cases',
      coming: 'Coming',
    },
    contact: {
      heading: 'Get in touch',
      sub: "Tell me about a process you'd like to automate. I'll tell you if and how AI can help — no commitment.",
      label_name: 'Name',
      label_email: 'Email',
      label_message: 'Message',
      ph_name: 'Your name',
      ph_email: 'you@company.com',
      ph_message: "Tell me about the process you'd like to automate…",
      submit: 'Send message',
      success: "Got it — I'll be in touch within 24 hours.",
      error: 'Something went wrong. Try again or email directly.',
    },
    footer: {
      cta_heading: "Got a process that's eating your time?",
      cta_sub: "Let's automate it — usually done in under a week.",
      cta_btn: "Let's talk →",
      copy: 'Built with AI',
    },
  },

  UA: {
    nav: {
      home: 'Головна', cases: 'Кейси', about: 'Про мене', contact: 'Контакт',
    },
    hero: {
      role: 'Спеціаліст з AI автоматизації',
      line1: 'Будую системи що працюють',
      line2: 'без тебе',
      cta_primary: 'Безкоштовний аудит',
      cta_secondary: 'Переглянути кейси',
      tools: ['Make', 'n8n', 'Claude API', 'Без коду'],
      stats: [
        { value: '6+', label: 'Автоматизацій' },
        { value: '90%', label: 'Середній час зекономлено' },
        { value: '< 1 тижня', label: 'Від брифу до продакшну' },
      ],
    },
    cases: {
      heading: 'Кейси',
      coming: 'Очікуйте',
    },
    contact: {
      heading: "Зв'яжіться зі мною",
      sub: 'Розкажіть про процес який хочете автоматизувати. Скажу чи може допомогти AI — без зобов\'язань.',
      label_name: "Ім'я",
      label_email: 'Email',
      label_message: 'Повідомлення',
      ph_name: "Ваше ім'я",
      ph_email: 'ви@компанія.com',
      ph_message: 'Розкажіть про процес який хочете автоматизувати…',
      submit: 'Надіслати',
      success: 'Отримав — відповім протягом 24 годин.',
      error: 'Щось пішло не так. Спробуйте ще раз або напишіть напряму.',
    },
    footer: {
      cta_heading: 'Є процес що поглинає час?',
      cta_sub: 'Автоматизуємо — зазвичай готово менш ніж за тиждень.',
      cta_btn: 'Поговоримо →',
      copy: 'Створено з AI',
    },
  },
} as const
