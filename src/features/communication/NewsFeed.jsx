import { useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const NewsFeed = () => {
  const { activityLog, addActivity } = useAppContext();
  const [filter, setFilter] = useState("all");

  const getIcon = (text) => {
    if (text.includes("Логин") || text.includes("вход")) return "🔐";
    if (text.includes("задач")) return "✅";
    if (text.includes("команд") || text.includes("micro-team")) return "👥";
    if (text.includes("отчет")) return "📊";
    if (text.includes("приглашен")) return "📨";
    if (text.includes("проблем")) return "🐛";
    if (text.includes("готов")) return "🚀";
    return "📌";
  };

  const filteredNews =
    filter === "all"
      ? activityLog
      : filter === "tasks"
        ? activityLog.filter((log) => log.text.includes("задач"))
        : activityLog.filter((log) => log.text.includes("участник") || log.text.includes("команд"));

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="cute-card p-4">
        <h3 className="font-bold text-brand-bean mb-4">📰 Лента новостей</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold ${
              filter === "all" ? "bg-brand-mint text-brand-bean" : "bg-[#f3e8da] text-brand-bean/70"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("tasks")}
            className={`px-4 py-2 rounded-lg text-xs font-bold ${
              filter === "tasks" ? "bg-brand-mint text-brand-bean" : "bg-[#f3e8da] text-brand-bean/70"
            }`}
          >
            Задачи
          </button>
          <button
            onClick={() => setFilter("team")}
            className={`px-4 py-2 rounded-lg text-xs font-bold ${
              filter === "team" ? "bg-brand-mint text-brand-bean" : "bg-[#f3e8da] text-brand-bean/70"
            }`}
          >
            Команда
          </button>
        </div>
      </div>

      {/* Новости */}
      <div className="space-y-3">
        {filteredNews.length === 0 ? (
          <div className="cute-card p-6 text-center text-brand-bean/50">
            Нет новостей по этому фильтру
          </div>
        ) : (
          filteredNews.map((news) => (
            <div key={news.id} className="cute-card p-4 hover:shadow-lg transition">
              <div className="flex gap-4 items-start">
                <span className="text-3xl">{getIcon(news.text)}</span>
                <div className="flex-1">
                  <p className="text-sm text-brand-bean font-medium">{news.text}</p>
                  <p className="text-xs text-brand-bean/60 mt-2">{news.createdAt}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
