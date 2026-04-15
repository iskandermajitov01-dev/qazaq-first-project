import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const tabs = [
  "Team Overview",
  "Analytics",
  "Feedback",
  "Sessions",
  "Talent Pool",
];

const MentorPanel = () => {
  const { talentPool, microTeam, currentUserProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const activeTeam = microTeam.length ? microTeam : talentPool.slice(0, 3);

  const teamStrength = useMemo(
    () => Math.round((activeTeam.reduce((sum, person) => sum + (person.energy || 70), 0) / (activeTeam.length || 1)) * 1),
    [activeTeam]
  );



  return (
    <div className="space-y-6">
      <section className="cute-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-brand-bean">Панель наставника</h2>
            <p className="mt-2 text-sm text-brand-bean/70">Управляй командой, выдавай задачи и развивай участников.</p>
          </div>
          <div className="rounded-3xl border-2 border-brand-mint bg-brand-mint/10 px-4 py-3 text-sm text-brand-bean">
            Роль: {currentUserProfile?.role || "mentor"}
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

        {activeTab === "Team Overview" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="rounded-3xl border-2 border-brand-bean/10 bg-brand-cream p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-bean">Команда</h3>
                  <span className="rounded-full bg-brand-mint/10 px-3 py-1 text-xs font-semibold text-brand-bean">{activeTeam.length} участников</span>
                </div>
                <div className="mt-4 space-y-3">
                  {activeTeam.map((member) => (
                    <div key={member.id} className="rounded-3xl border border-brand-bean/10 bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-semibold text-brand-bean">{member.name}</h4>
                          <p className="text-xs text-brand-bean/70">{member.role} • {member.city}</p>
                        </div>
                        <div className="space-x-2 text-xs text-brand-bean/80">
                          <span>Energy {member.energy}%</span>
                          <span>Skills {member.skills.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="text-sm font-semibold text-brand-bean">Quick metrics</h3>
              <div className="mt-4 space-y-3 text-sm text-brand-bean/80">
                <div className="flex items-center justify-between rounded-2xl bg-white p-3">
                  <span>Средняя активность</span>
                  <span>{teamStrength}%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-3">
                  <span>Текущий уровень</span>
                  <span>{activeTeam.length ? "Стабильный" : "Набираем"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white p-3">
                  <span>Слабое звено</span>
                  <span>{activeTeam.length ? "Детали" : "—"}</span>
                </div>
              </div>
            </div>
          </div>
        )}



        {activeTab === "Analytics" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Кто работает</h3>
              <p className="mt-3 text-sm text-brand-bean/70">{activeTeam.length} активных участников</p>
            </div>
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Кто отстаёт</h3>
              <p className="mt-3 text-sm text-brand-bean/70">Требует внимание к темпу работы</p>
            </div>
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-brand-cream p-5">
              <h3 className="font-semibold text-brand-bean">Слабые места</h3>
              <p className="mt-3 text-sm text-brand-bean/70">Требуется внимание к коммуникации и дизайну.</p>
            </div>
          </div>
        )}

        {activeTab === "Feedback" && (
          <div className="space-y-4">
            <textarea className="w-full rounded-3xl border-2 border-brand-bean/20 bg-white px-4 py-4 text-sm text-brand-bean outline-none" rows={5} placeholder="Написать обратную связь участнику..."></textarea>
            <button className="cute-btn rounded-2xl px-5 py-3 text-sm">Отправить отзыв</button>
          </div>
        )}

        {activeTab === "Sessions" && (
          <div className="space-y-4">
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-white p-5">
              <h3 className="font-semibold text-brand-bean">План встреч</h3>
              <div className="mt-4 space-y-3 text-sm text-brand-bean/70">
                <div className="rounded-2xl bg-brand-cream/90 p-3">
                  <p className="font-semibold">Совещание по стратегии</p>
                  <p>Дата: 2024-04-22 • 17:00</p>
                </div>
                <div className="rounded-2xl bg-brand-cream/90 p-3">
                  <p className="font-semibold">Тестирование прототипа</p>
                  <p>Дата: 2024-04-25 • 14:00</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Talent Pool" && (
          <div className="grid gap-4 md:grid-cols-2">
            {talentPool.slice(0, 6).map((person) => (
              <div key={person.id} className="rounded-3xl border border-brand-bean/10 bg-white p-5">
                <h4 className="font-semibold text-brand-bean">{person.name}</h4>
                <p className="text-xs text-brand-bean/70">{person.role} • {person.city}</p>
                <p className="mt-3 text-[11px] text-brand-bean/80">Навыки: {person.skills.join(", ")}</p>
                <button className="mt-4 rounded-2xl bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-bean">Выбрать в команду</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MentorPanel;
