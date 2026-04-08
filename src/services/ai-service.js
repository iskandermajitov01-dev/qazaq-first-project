// Используй свой API ключ от OpenAI, Cohere, или другого сервиса
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || "demo-key";

const localTips = [
  "Проверь питание и общий GND перед отладкой.",
  "Сначала прогоняй модульные тесты по датчикам.",
  "Разбей задачу на маленькие спринты по 30 минут.",
  "Сними короткий видео-репорт и залей в Progress Feed.",
];

export const askAIAssistant = async (question) => {
  if (!question?.trim()) return "Опиши задачу подробнее.";

  try {
    // Если нет API ключа, используй локальные советы
    if (AI_API_KEY === "demo-key" || !AI_API_KEY) {
      return getLocalResponse(question);
    }

    // Интеграция с OpenAI (опционально)
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${AI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       {
    //         role: "system",
    //         content: "Ты опытный наставник по robotics. Помогай кратко и практично на русском языке.",
    //       },
    //       { role: "user", content: question },
    //     ],
    //     max_tokens: 150,
    //   }),
    // });

    // const data = await response.json();
    // return data.choices?.[0]?.message?.content || "Не смог получить ответ.";

    return getLocalResponse(question);
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Ошибка соединения. Попробуй ещё раз позже.";
  }
};

const getLocalResponse = (question) => {
  const lowerQ = question.toLowerCase();

  // Контекст-зависимые ответы
  if (lowerQ.includes("собрать") || lowerQ.includes("team")) {
    return "✅ Для сборки team:\n1. Определи роли (программист, механик, капитан)\n2. Выбери людей с максимальной энергией\n3. Проверь наличие навыков\n4. Начни с малого спринта на 1-2 дня";
  }

  if (lowerQ.includes("робот") || lowerQ.includes("не едет")) {
    return "🤖 Робот не едит?\n1. Проверь питание и батарею\n2. Откалибруй датчики (IR, ultrasonic)\n3. Проверь моторы отдельно\n4. Запусти debug скрипт\n5. Если не помогает - снми видео и покажи ментору";
  }

  if (lowerQ.includes("код") || lowerQ.includes("программ")) {
    return "💻 Совет по коду:\n1. Используй модульность (отделяй сенсоры, моторы)\n2. Добавь логирование для отладки\n3. Пиши unit tests\n4. Комментируй сложную логику\n5. Используй Git для версионирования";
  }

  if (lowerQ.includes("презент")) {
    return "🎤 Создание презентации:\n1. Максимум 5 слайдов\n2. Проблема → Решение → Результат\n3. Одно видео или демо\n4. Звучи уверенно\n5. Подготовься к вопросам жюри";
  }

  if (lowerQ.includes("время") || lowerQ.includes("спешу")) {
    return "⏰ Спешишь с дедлайном?\n• Приоритизируй MVP (minimum viable product)\n• Отсеки все лишнее\n• Работай по спринтам 2-4 часа\n• Делись подзадачами в команде\n• Лучше готовый MVP чем недоделанное всё";
  }

  // Генерик советы
  return `💡 Совет: ${localTips[Math.floor(Math.random() * localTips.length)]}\n\nМожешь спросить о:\n• Сборке робота\n• Коде и программировании\n• Презентации\n• Командной работе\n• Дедлайнах`;
};


