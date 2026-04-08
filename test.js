// ТЕСТ: Проверка Groq API ключа
// Открой браузер, нажми F12 → Console → вставь этот код

console.log("🔍 Проверка Groq API...");

// 1. Проверка что ключ загружен в браузере
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
console.log("🔑 API ключ в браузере:", apiKey ? "✅ Есть" : "❌ Нет");
console.log("Длина ключа:", apiKey ? apiKey.length : 0);

// 2. Тестовый запрос к Groq API
async function testGroqAPI() {
  if (!apiKey) {
    console.log("❌ Нет API ключа - будет локальный ответ");
    return;
  }

  console.log("🚀 Тестирую Groq API...");

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
            content: "Привет! Как собрать простого робота?",
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      console.log("✅ Groq API работает!");
      console.log("Ответ:", answer);
    } else {
      const error = await response.json();
      console.log("❌ Ошибка API:", error);
    }
  } catch (error) {
    console.log("❌ Ошибка сети:", error.message);
  }
}

// Запускаем тест
testGroqAPI();

console.log("✅ Проверка завершена!");
