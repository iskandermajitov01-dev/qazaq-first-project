# 🚀 ИНСТРУКЦИЯ: ВКЛЮЧИТЬ РЕАЛЬНЫЙ AI ЧАТБОТ

## ШАГ 1: Проверь API ключ
В файле `.env` должна быть строка:
```
VITE_GROQ_API_KEY=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
```

## ШАГ 2: Перезапусти сервер
```bash
npm run dev
```
Сервер должен быть на http://localhost:5177/

## ШАГ 3: Тестируй в браузере

### Открой: http://localhost:5177/learning

### Вставь в консоль браузера (F12 → Console):
```javascript
// Тест API ключа
console.log("API ключ:", import.meta.env.VITE_GROQ_API_KEY ? "✅ ЕСТЬ" : "❌ НЕТ");

// Тестовый запрос к Groq
fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
  },
  body: JSON.stringify({
    model: "mixtral-8x7b-32768",
    messages: [{role: "user", content: "Привет, робототехника!"}],
    max_tokens: 50
  })
}).then(r => r.json()).then(d => console.log("Ответ:", d.choices[0].message.content));
```

## ШАГ 4: Если работает - тестируй в чате
- Напиши вопрос в AI чате
- Смотри в консоль браузера (F12)
- Должен быть лог "🚀 Using REAL Groq API..."

## ШАГ 5: Если не работает

### Проверь ключ на https://console.groq.com/
1. Зайди в аккаунт
2. Скопируй ключ из "API Keys"
3. Вставь в `.env` файл
4. Перезапусти сервер

### Или создай новый ключ:
1. Нажми "Create API Key"
2. Скопируй новый ключ
3. Замени в `.env`

## 🔧 ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ

Замени весь файл `src/services/groq-ai.js` на:

```javascript
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const askGroqAI = async (question) => {
  if (!GROQ_API_KEY) {
    return "Добавь API ключ в .env файл!";
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "Ты робототехник. Отвечай на русском." },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    } else {
      return `Ошибка API: ${response.status}`;
    }
  } catch (error) {
    return `Ошибка: ${error.message}`;
  }
};
```

## ✅ ГОТОВО!
Теперь AI должен давать реальные ответы!