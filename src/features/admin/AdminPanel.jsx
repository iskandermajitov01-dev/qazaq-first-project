import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const tabs = ["Users", "Teams", "System Settings", "Analytics", "Resource Management", "Competitions"];

const AdminPanel = () => {
  const { talentPool, microTeam, currentUserProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const activeUsers = useMemo(() => talentPool.slice(0, 5), [talentPool]);

  return (
    <div className="space-y-6">
      <section className="cute-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-brand-bean">Панель администратора</h2>
            <p className="mt-2 text-sm text-brand-bean/70">Администрируй систему, управляй пользователями и следи за метриками.</p>
          </div>
          <div className="rounded-3xl border-2 border-brand-mint bg-brand-mint/10 px-4 py-3 text-sm text-brand-bean">
            Роль: {currentUserProfile?.role || "admin"}
          </div>
        </div>
      </section>

      <section className="cute-card p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab ? "bg-brand-bean text-brand-cream" : "border border-brand-bean/20 bg-white text-brand-bean"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Users" && (
          <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
            <h3 className="font-semibold text-brand-bean">Пользователи</h3>
            <div className="mt-4 space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="rounded-3xl border border-brand-bean/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-brand-bean">{user.name}</span>
                    <span className="rounded-full bg-brand-mint/10 px-3 py-1 text-xs text-brand-bean">{user.role}</span>
                  </div>
                  <p className="mt-2 text-xs text-brand-bean/70">{user.city} • Рейтинг {user.rating || 78}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Teams" && (
          <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-5">
            <h3 className="font-semibold text-brand-bean">Команды</h3>
            <p className="mt-3 text-sm text-brand-bean/70">Наблюдай за командами, проверяй распределение ролей и активность.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-brand-bean/10 bg-white p-4">
                <p className="font-semibold text-brand-bean">Команда Альфа</p>
                <p className="mt-2 text-xs text-brand-bean/70">5 участников • 82% прогресса</p>
              </div>
              <div className="rounded-3xl border border-brand-bean/10 bg-white p-4">
                <p className="font-semibold text-brand-bean">Команда Бета</p>
                <p className="mt-2 text-xs text-brand-bean/70">4 участника • 68% прогресса</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "System Settings" && (
          <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
            <h3 className="font-semibold text-brand-bean">Настройки системы</h3>
            <div className="mt-4 space-y-3 text-sm text-brand-bean/70">
              <p>Управление ролями, метриками, аудиторией и доступом.</p>
              <p>Список активных модулей: AI-поддержка, проверка достижений, администрирование.</p>
            </div>
          </div>
        )}

        {activeTab === "Analytics" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Общая активность</h3>
              <p className="mt-3 text-sm text-brand-bean/70">Дневной трафик: 1.2k запросов, 240 проверок, 76 новых регистраций.</p>
            </div>
            <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Система</h3>
              <p className="mt-3 text-sm text-brand-bean/70">Аптайм: 99.9% • Последнее обновление: 2024-04-20</p>
            </div>
          </div>
        )}

        {activeTab === "Resource Management" && (
          <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
            <h3 className="font-semibold text-brand-bean">Ресурсы</h3>
            <p className="mt-3 text-sm text-brand-bean/70">Отслеживай доступность инструментов, шаблонов и обучающих материалов.</p>
          </div>
        )}

        {activeTab === "Competitions" && (
          <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
            <h3 className="font-semibold text-brand-bean">Соревнования</h3>
            <p className="mt-3 text-sm text-brand-bean/70">Активные события: Хакатон, Прототип-челлендж, Квесты.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
