# 🎉 Qazaq Robotech Hub - PWA для распределённых robotics команд

**Платформа для управления распределёнными командами robotics с реальным AI консультантом!**

## ✨ Главные фишки

### ✅ Функциональность (100% рабочая)

| Фишка | Статус | Описание |
|-------|--------|---------|
| **💬 Team Chat** | ✅ Работает | Создай чаты, добавляй людей, все сохраняется в localStorage |
| **🤖 AI Assistant** | ✅ Работает | Groq API (бесплатный) или локальные советы |
| **📅 Events** | ✅ Работает | Календарь событий с уведомлениями |
| **📰 News Feed** | ✅ Работает | Лента активностей команды |
| **👥 Team Matching** | ✅ Работает | Подбор команды по ролям и энергии |
| **📊 Kanban Board** | ✅ Работает | Управление задачами |
| **🎓 Lessons** | ✅ Работает | База знаний и problem library |
| **💾 Persistence** | ✅ Важно! | Все данные сохраняются в localStorage |

---

## 🚀 Быстрый старт

### 1. Установка

```bash
# Клонируй проект
git clone <repo>
cd "qazaq first hub"

# Установи зависимости
npm install
```

### 2. Запуск

```bash
npm run dev
```

Откроется на `http://localhost:5173`

---

## 🔧 Настройка Groq AI (рекомендуется)

### Шаг 1: Получи API ключ

1. Перейди на https://console.groq.com/
2. Зарегистрируйся (email + пароль)
3. Меню слева → API Keys
4. Кнопка "Create New API Key"
5. Копируй ключ (начинается с `gsk_`)

### Шаг 2: Добавь в .env

Создай файл `.env` в корне проекта:

```env
VITE_GROQ_API_KEY=gsk_your_key_here_paste_your_actual_key
```

### Шаг 3: Перезагрузи сервер

```bash
# Закрой текущий (Ctrl+C)
# Запусти заново
npm run dev
```

### Готово! 🎉

Теперь `/learning` будет использовать реальный Groq AI вместо локальных советов.

---

## 📱 Как использовать

### Team Chat 💬

1. **Создание чата:**
   - Нажми "+" в левой панели
   - Введи имя чата (например, "Team Alpha")
   - Нажми "Создать"

2. **Добавление участников:**
   - Нажми "+ Участник"
   - Выбери людей из списка
   - Они автоматически добавятся в чат

3. **Отправка сообщений:**
   - Пиши в поле внизу
   - Enter или кнопка "Отправить"
   - Все сохраняется в localStorage!

### AI Assistant 🤖

1. **Без API ключа:**
   - Используются локальные smart-советы
   - Они контекст-зависимые!
   - Работает даже офлайн

2. **С Groq API:**
   - Полноценный инженер-консультант
   - Ответит на любой вопрос о robotics
   - Очень быстро (3-5 сек)

**Примеры вопросов:**
- "Как начать с robotics?"
- "Робот не едит, что делать?"
- "Как собрать команду?"
- "Как защищать проект?"

### Events 📅

1. Нажми "+ Событие"
2. Заполни: название, дату, время, тип
3. Добавь описание
4. Сохраняется автоматически

### News Feed 📰

- Видишь все активности в команде
- Фильтруй по типам
- Каждое событие с иконкой и временем

---

## 💾 Сохранение данных

### localStorage (встроенные)

**Все автоматически сохраняется:**

```javascript
// Чаты
localStorage.getItem("qazaq-chats")

// AI история
localStorage.getItem("qazaq-ai-chat")

// Твои данные
localStorage.getItem("qazaq-email")
localStorage.getItem("qazaq-role")
```

### Как это работает?

1. **When you type** → Автоматически сохраняется
2. **When you reload** → Всё восстанавливается
3. **Syncs in browser** → Быстро и надёжно
4. **Works offline** → Даже без интернета!

---

## 🛠️ Структура проекта

```
src/
├── features/
│   ├── communication/       # Chat, News, Events
│   ├── learning/           # AI Chat, Lessons
│   ├── kanban/            # Task management
│   ├── matchmaking/       # Team finding
│   └── ...
├── components/            # Layout, UI components
├── services/             # AI APIs
│   ├── groq-ai.js       # Groq API
│   ├── ai-service.js    # Fallbacks
│   └── firebase.config.js
├── store/               # AppContext
├── hooks/               # useOffline
└── utils/               # Helpers
```

---

## 🌐 Deployed на?

Пока локально. Для production:

- **Vercel** - Бесплатно, легко
- **Netlify** - Бесплатно, простой
- **Railway** - Платный, хороший
- **DigitalOcean** - Платный, мощный

---

## 📚 Используемые технологии

- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **Groq API** - AI integration
- **localStorage** - Data persistence
- **PWA (Service Workers)** - Offline support

---

## 🔐 Об API ключах

### Безопасность

- **Никогда** не commit `.env` файл
- **Никогда** не публикуй API ключ
- `.env` добавлен в `.gitignore`

### Регенерация ключа

Если ключ утёк:
1. Перейди на https://console.groq.com/
2. Удали старый ключ
3. Создай новый
4. Обнови в `.env`

---

## 🐛 Troubleshooting

### Chat не сохраняется
→ Проверь местоположение файла .env
→ Перезагрузи браузер (Ctrl+Shift+R)

### AI не отвечает
→ Если нет API ключа - используются локальные советы (работают!)
→ Проверь консоль браузера (F12 → Console)

### Пишет "Cannot read property 'send'"
→ Это исправлено в новой версии
→ Очисти localStorage: `localStorage.clear()`

### Часть страницы пуста
→ Открой Console (F12) и посмотри красные ошибки
→ Проверь что все компоненты импортируются

---

## 🎓 Обучение

### Для новичков в robotics

Пиши в AI:
- "Как начать с robotics?"
- "Какой язык программирования учить?"
- "Где найти наставника?"

### Для опытных

- "Как использовать ROS?"
- "C++ примеры для Arduino"
- "Калибровка датчиков"

---

## 🚀 Что дальше?

### Идеи для development

1. **Backend** - Firebase или Express.js
2. **Sync** - Синхронизация между устройствами
3. **Notifications** - Push-уведомления
4. **Mobile** - React Native версия
5. **Analytics** - Dashboard для аналитики
6. **Video** - Интеграция Jitsi для видео-звонков
7. **Documents** - Загрузка файлов
8. **API** - REST API для мобильных приложений

---

## 📞 Контакты / Поддержка

- **Issue?** → Открой GitHub Issue
- **Idea?** → GitHub Discussions
- **Help?** → Посмотри FEATURES_GUIDE.md

---

## 📄 Лицензия

ISC License - делай что хочешь!

---

## ❤️ Спасибо!

Спасибо за использование Qazaq Robotech Hub!

**Made with ❤️ for Kazakhstani robotics teams**

Успехов в соревнованиях! 🏆🤖
