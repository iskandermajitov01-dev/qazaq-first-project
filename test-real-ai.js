// 🚀 ТЕСТ РЕАЛЬНОГО AI - вставь в браузерную консоль
// Открой http://localhost:5177/learning → F12 → Console

console.log("🔍 ТЕСТИРОВАНИЕ РЕАЛЬНОГО AI");

// 1. Проверка ключа
const key = import.meta.env.VITE_GROQ_API_KEY;
console.log("🔑 API ключ:", key ? "✅ ЕСТЬ" : "❌ НЕТ");

// 2. Тестовый запрос
if (key) {
  console.log("🚀 Тестирую Groq API...");

  fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: "Ты робототехник. Отвечай кратко на русском." },
        { role: "user", content: "Как собрать простого робота?" }
      ],
      temperature: 0.7,
      max_tokens: 100
    })
  })
  .then(r => {
    console.log("📡 Статус:", r.status);
    return r.json();
  })
  .then(d => {
    if (d.choices && d.choices[0]) {
      console.log("✅ РЕАЛЬНЫЙ AI ОТВЕТ:", d.choices[0].message.content);
    } else {
      console.log("❌ Ошибка в ответе:", d);
    }
  })
  .catch(e => console.log("❌ Ошибка:", e));
} else {
  console.log("❌ Нет API ключа! Добавь в .env файл");
}