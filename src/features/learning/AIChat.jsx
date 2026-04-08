import { useState, useEffect } from "react";
import { askGroqAI } from "../../services/groq-ai.js";
import { useAppContext } from "../../store/AppContext.jsx";

const AIChat = () => {
  const { chats, addMessage } = useAppContext();

  // Поиск или создание AI чата
  const aiChat = chats.find((c) => c.id === "ai-assistant") || null;

  const [messages, setMessages] = useState(() => {
    // Загружаем сообщения из localStorage AI чата
    try {
      const saved = localStorage.getItem("qazaq-ai-chat");
      return saved ? JSON.parse(saved) : [
        {
          id: 0,
          role: "bot",
          text: `Салем! 🤖 Я твой AI-инженер. Я помогу с robotics, программированием, сборкой и стратегией. Спроси что угодно!\n\n${import.meta.env.VITE_GROQ_API_KEY ? '🔗 API подключен - реальные ответы!' : '💡 Добавь GROQ API ключ для реальных ответов'}`,
        },
      ];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Сохраняем сообщения в localStorage
  useEffect(() => {
    localStorage.setItem("qazaq-ai-chat", JSON.stringify(messages));
  }, [messages]);

  const send = async () => {
    if (!text.trim() || loading) return;
    
    const userText = text;
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    try {
      const reply = await askGroqAI(userText);
      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: reply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "❌ Ошибка соединения. Попробуй ещё раз.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[75vh]">
      {/* Информация и быстрые кнопки */}
      <div className="cute-card p-4">
        <h2 className="font-bold text-brand-bean mb-3">🤖 AI Robotics Assistant</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setText("Как начать с robotics?")}
            className="rounded bg-brand-bean px-2 py-1 text-[10px] text-brand-cream hover:shadow-md transition"
          >
            🚀 Начало
          </button>
          <button
            onClick={() => setText("Робот не едит, что делать?")}
            className="rounded bg-brand-bean px-2 py-1 text-[10px] text-brand-cream hover:shadow-md transition"
          >
            🐛 Дебаг
          </button>
          <button
            onClick={() => setText("Как собрать team?")}
            className="rounded bg-brand-bean px-2 py-1 text-[10px] text-brand-cream hover:shadow-md transition"
          >
            👥 Команда
          </button>
          <button
            onClick={() => setText("Как защищать проект?")}
            className="rounded bg-brand-bean px-2 py-1 text-[10px] text-brand-cream hover:shadow-md transition"
          >
            🎤 Защита
          </button>
        </div>
      </div>

      {/* Чат */}
      <div className="cute-card flex-1 flex flex-col overflow-hidden">
        <div className="custom-scrollbar flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl border-2 border-brand-bean p-3 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-brand-mint text-brand-bean"
                    : "bg-[#f3e8da] text-brand-bean"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#f3e8da] border-2 border-brand-bean rounded-2xl p-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-brand-bean rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-brand-bean rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-brand-bean rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ввод */}
        <div className="border-t-2 border-brand-bean bg-[#f3e8da] p-4">
          <div className="relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
              className="w-full rounded-xl border-2 border-brand-bean bg-brand-cream px-4 py-3 pr-20 text-sm text-brand-bean outline-none disabled:opacity-50"
              placeholder="Спроси про robotics, код, сборку…"
            />
            <button
              onClick={send}
              disabled={loading}
              className="absolute right-2 top-2 cute-btn px-3 py-2 text-xs disabled:opacity-50"
            >
              {loading ? "..." : "Отправить"}
            </button>
          </div>

          <p className="text-xs text-brand-bean/60 mt-2">
            ℹ️ AI использует локальные советы. Для реальных ответов добавь VITE_GROQ_API_KEY в .env
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;