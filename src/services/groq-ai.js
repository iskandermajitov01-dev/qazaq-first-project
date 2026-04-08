// Groq API - сверхбыстрый AI (бесплатно!)
// Получи API ключ на https://console.groq.com/

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

console.log("🔑 Groq API Key loaded:", GROQ_API_KEY ? "YES" : "NO");

export const askGroqAI = async (question) => {
  if (!question?.trim()) return "Пожалуйста, напишите вопрос.";

  console.log("🤖 AI Question:", question);
  console.log("🔑 Has API Key:", !!GROQ_API_KEY);

  // ЕСЛИ ЕСТЬ КЛЮЧ - ВСЕГДА ИСПОЛЬЗУЕМ API
  if (GROQ_API_KEY && GROQ_API_KEY.length > 10) {
    console.log("🚀 Using REAL Groq API...");

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          // Заменил устаревшую модель на поддерживаемую
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `Ты опытный инженер по робототехнике. Помогай командам из Казахстана с robotics, программированием, сборкой и стратегией.
Отвечай на русском языке, кратко и практично.
Давай советы по шагам.
Если это про robotics/FTC/FIRST - ты эксперт.`,
            },
            { role: "user", content: question },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      console.log("📡 API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;
        if (answer) {
          console.log("✅ Got real AI answer!");
          return answer;
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
    }

    console.log("⚠️ API failed, using local advice");
  }

  // Локальные советы только если нет ключа или API сломался
  console.log("💡 Using local advice");
  return getLocalRoboticAdvice(question);
};

const getLocalRoboticAdvice = (question) => {
  const lowerQ = question.toLowerCase();

  // Robotics
  if (
    lowerQ.includes("робот") ||
    lowerQ.includes("ftc") ||
    lowerQ.includes("first") ||
    lowerQ.includes("сборка")
  ) {
    if (lowerQ.includes("не едит") || lowerQ.includes("не едет")) {
      return `🤖 Робот не едит? Проверь:
1. ⚡ Питание и батарея (полный заряд?)
2. 📡 Провода на моторах (правильно подключены?)
3. 🔩 Фиксация моторов (не люфтят?)
4. 📊 Откалибруй датчики перед тестом
5. 🖥️ Загрузи свежий код

Если все работает - проверь механику (шестерни не скользят?)`;
    }

    if (lowerQ.includes("собрать")) {
      return `🛠️ Как собрать робота:
Шаг 1: Сборка шасси (мотор-редукторы + рамка)
Шаг 2: Всё соедини через контроллер (микроконтроллер или Arduino)
Шаг 3: Добавь датчики (IR, ultrasonic, гироскоп)
Шаг 4: Проверь каждый датчик отдельно
Шаг 5: Напиши код с тестами
Совет: Начни с простого, потом усложняй!`;
    }

    return `🤖 Совет по robotics:
Используй модульность - отделяй сенсоры, моторы, логику.
Тестируй каждую часть отдельно перед интеграцией.
Документируй код с комментариями.
Используй Git для версионирования.`;
  }

  // Программирование
  if (lowerQ.includes("код") || lowerQ.includes("программ")) {
    if (lowerQ.includes("c++")) {
      return `💻 C++ для robotics:
1. Используй Arduino IDE или PlatformIO
2. Структурируй код: setup() + loop()
3. Используй PWM для моторов (0-255)
4. Используй Serial для отладки
5. Тестируй сначала на плате без мотора
Пример: analogWrite(motorPin, 200);`;
    }

    if (lowerQ.includes("python")) {
      return `🐍 Python для robotics (ROS):
1. Установи ROS или ROS2
2. Используй nodes для разных функций
3. Topics для коммуникации между частями
4. Не забывай обработку ошибок
5. Используй rospy для подписки на сенсоры
Пример: rospy.Subscriber("/sensor", SensorMsg, callback)`;
    }

    return `💻 Общий совет по коду:
- Пиши модульно (функции, классы)
- Логируй всё для отладки
- Тестируй каждый модуль
- Комментируй сложную логику
- Используй версионирование (Git)`;
  }

  // Презентация
  if (lowerQ.includes("презент") || lowerQ.includes("защит")) {
    return `🎤 Как защищать проект:
1. 📝 Рассказ (1-2 мин): Проблема → Решение → Результат
2. 🔧 Демо (1 мин): Покажи рабочий робот
3. 📊 Слайды: Макс 5-7 слайдов
4. 💪 Будь уверен и говори ясно
5. 🧠 Приготовься к вопросам жюри
Совет: Практикуйсь много раз!`;
  }

  // Команда
  if (lowerQ.includes("команд") || lowerQ.includes("team")) {
    return `👥 Как работать в команде:
1. 📋 Распредели роли: программист, механик, капитан
2. ⏰ Спринты по 2-3 часа с целями
3. 📞 Ежедневные стендапы (10 минут)
4. 📊 Отслеживай прогресс в Kanban
5. 🤝 Помогай друг другу
Совет: Коммуникация - ключ к успеху!`;
  }

  // Время/Спешка
  if (lowerQ.includes("дедлайн") || lowerQ.includes("спешу") || lowerQ.includes("время")) {
    return `⏰ Если спешишь:
1. 🎯 Фокусируйся на MVP (minimum viable product)
2. ❌ Отсеки всё лишнее
3. ⚡ Спринты по 2 часа максимум
4. 👥 Разделяй задачи в команде
5. 📹 Лучше готовый MVP чем недоделанное всё
Помни: Работающее простое > Сложное с ошибками`;
  }

  // Обучение
  if (lowerQ.includes("учи") || lowerQ.includes("как начать")) {
    return `📚 Как начать с robotics:
1. Начни с Arduino или LEGO EV3
2. Учи C++ или Python (на практике!)
3. Собери простого робота, потом усложняй
4. Участвуй в соревнованиях (FTC, FIRST)
5. Находи наставника в community
Ресурсы: YouTube, официальные docs, community`;
  }

  // Дефолтный ответ
  return `🤖 Я помогу с robotics! Спросишь про:
- 🛠️ Сборку и механику
- 💻 Программирование (C++, Python, ROS)
- 📊 Электронику и сенсоры
- 👥 Командной работе
- 🎤 Презентации и защите
- ⏰ Управлению временем
- 📚 Обучению с нуля

Задавай вопросы конкретно!`;
};
