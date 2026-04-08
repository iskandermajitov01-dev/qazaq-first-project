// ТЕСТ GROQ API - вставь в браузерную консоль
// Открой http://localhost:5173/learning → F12 → Console → вставь этот код

console.log("🔍 ТЕСТИРОВАНИЕ GROQ API");

// 1. Проверка API ключа
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
console.log("🔑 API ключ:", apiKey ? "✅ Есть (" + apiKey.substring(0, 10) + "...)" : "❌ Нет");

// 2. Тестовый запрос
async function testAPI() {
  if (!apiKey) {
    console.log("❌ Нет API ключа!");
    return;
  }

  console.log("🚀 Отправляю тестовый запрос...");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "Ты робототехник. Отвечай кратко на русском.",
          },
          {
            role: "user",
            content: "Как собрать простого робота из LEGO?",
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    console.log("📡 Статус ответа:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API работает!");
      console.log("🤖 Ответ:", data.choices[0].message.content);
    } else {
      const error = await response.text();
      console.log("❌ Ошибка API:", error);
    }
  } catch (error) {
    console.log("❌ Ошибка сети:", error.message);
  }
}

testAPI();