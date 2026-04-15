import { useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const tabs = ["Submissions", "Evaluation", "Leaderboard", "Audit"];

const mockSubmissions = [
  { id: 1, name: "Нуржан", achievement: "Прошел обучающий трек", status: "pending", submitted: "2 часа назад" },
  { id: 2, name: "Алия", achievement: "Собрала команду", status: "pending", submitted: "4 часа назад" },
  { id: 3, name: "Данияр", achievement: "Выполнил задачу", status: "rejected", submitted: "1 день назад" },
];

const VerifierPanel = () => {
  const { currentUserProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [reviewNotes, setReviewNotes] = useState("");

  return (
    <div className="space-y-6">
      <section className="cute-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-brand-bean">Панель проверяющего</h2>
            <p className="mt-2 text-sm text-brand-bean/70">Оцени достижения и поддерживай честность рейтингов.</p>
          </div>
          <div className="rounded-3xl border-2 border-brand-mint bg-brand-mint/10 px-4 py-3 text-sm text-brand-bean">
            Роль: {currentUserProfile?.role || "verifier"}
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

        {activeTab === "Submissions" && (
          <div className="space-y-4">
            {mockSubmissions.map((item) => (
              <div key={item.id} className="rounded-3xl border border-brand-bean/10 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-brand-bean">{item.name}</h4>
                    <p className="text-xs text-brand-bean/70">{item.achievement}</p>
                  </div>
                  <div className="space-x-2 text-xs">
                    <span className={`rounded-full px-3 py-1 ${item.status === "pending" ? "bg-brand-mint/10 text-brand-bean" : item.status === "verified" ? "bg-brand-bean/10 text-brand-bean" : "bg-red-100 text-red-600"}`}>
                      {item.status}
                    </span>
                    <span className="text-brand-bean/70">{item.submitted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Evaluation" && (
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Выбери подтверждение</h3>
              <p className="mt-3 text-sm text-brand-bean/70">Просмотри детали заявки, проверь репутацию участника и прими решение.</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-bean">Алия — подтверждение достижения</p>
                  <span className="rounded-full bg-brand-mint/10 px-3 py-1 text-xs font-semibold text-brand-bean">просмотр</span>
                </div>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-4 h-28 w-full rounded-3xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                  placeholder="Комментарий к проверке"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="cute-btn rounded-2xl px-4 py-3 text-sm">Принять</button>
                  <button className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">Отклонить</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Leaderboard" && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
              <h3 className="font-semibold text-brand-bean">Топ проверок</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-bean/70">
                <li>1. Алия — 18 подтверждений</li>
                <li>2. Нуржан — 15 подтверждений</li>
                <li>3. Гульнар — 12 подтверждений</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Метрика</h3>
              <p className="mt-3 text-sm text-brand-bean/70">Среднее время проверки: 2.3 часа</p>
              <p className="mt-2 text-sm text-brand-bean/70">Ошибки отклонения: 4%</p>
            </div>
          </div>
        )}

        {activeTab === "Audit" && (
          <div className="rounded-3xl border border-brand-bean/10 bg-white p-5">
            <h3 className="font-semibold text-brand-bean">Аудит достижений</h3>
            <p className="mt-3 text-sm text-brand-bean/70">Переотправляй выборку заявок для второй проверки и проверяй исторические решения.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-4">
                <p className="text-sm font-semibold text-brand-bean">Выборка 12 заявок</p>
                <p className="mt-2 text-xs text-brand-bean/70">Проверить отклонения и ошибки.</p>
              </div>
              <div className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-4">
                <p className="text-sm font-semibold text-brand-bean">Политика</p>
                <p className="mt-2 text-xs text-brand-bean/70">Обновить критерии принятия.</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default VerifierPanel;
