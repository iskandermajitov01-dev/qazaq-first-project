import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const Leaderboard = () => {
  const { leaderboard } = useAppContext();
  const [scope, setScope] = useState("kazakhstan");
  const [selectedUser, setSelectedUser] = useState(null);

  const cities = useMemo(
    () => ["kazakhstan", ...Array.from(new Set(leaderboard.map((user) => user.city).filter(Boolean)))],
    [leaderboard]
  );

  const visibleUsers = useMemo(() => {
    const filtered = scope === "kazakhstan" ? leaderboard : leaderboard.filter((user) => user.city === scope);
    return filtered
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, localRank: index + 1 }));
  }, [leaderboard, scope]);

  const podium = visibleUsers.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="cute-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[linear-gradient(135deg,#302c5f_0%,#5f6ad4_45%,#f4c973_100%)] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/65">National Ranking</p>
            <h2 className="mt-3 text-3xl font-black">Leaderboard</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
              Глобальный рейтинг участников по очкам. Можно смотреть весь Казахстан или отдельный город, а по клику открывается мини-профиль.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setScope(city)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    scope === city ? "bg-white text-[#302c5f]" : "bg-white/15 text-white backdrop-blur"
                  }`}
                >
                  {city === "kazakhstan" ? "Казахстан" : city}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-cream p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-bean/60">Top 3</p>
            <div className="mt-4 grid gap-3">
              {podium.map((user, index) => (
                <div key={user.uniqueId} className="rounded-3xl border-2 border-brand-bean/10 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-brand-bean/45">#{index + 1}</p>
                      <h3 className="mt-1 font-bold text-brand-bean">{user.firstName} {user.lastName}</h3>
                      <p className="text-xs text-brand-bean/70">{user.position} • {user.city}</p>
                    </div>
                    <div className="rounded-2xl bg-brand-mint/15 px-4 py-3 text-right">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-brand-bean/50">Points</div>
                      <div className="text-xl font-black text-brand-bean">{user.points}</div>
                    </div>
                  </div>
                </div>
              ))}
              {!podium.length && (
                <p className="rounded-3xl bg-white px-4 py-5 text-sm text-brand-bean/70">Для этого фильтра пока нет участников.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="cute-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-brand-bean">Таблица рейтинга</h3>
            <p className="mt-1 text-sm text-brand-bean/70">
              Сортировка по суммарным очкам: прогресс, выполненные задачи, вклад и подтвержденные достижения.
            </p>
          </div>
          <div className="rounded-2xl bg-brand-bean/5 px-4 py-3 text-sm text-brand-bean">
            {scope === "kazakhstan" ? "Вся страна" : `Город: ${scope}`}
          </div>
        </div>

        <div className="space-y-3">
          {visibleUsers.map((user) => (
            <button
              key={user.uniqueId}
              onClick={() => setSelectedUser(user)}
              className="flex w-full items-center justify-between rounded-3xl border border-brand-bean/10 bg-white px-4 py-4 text-left transition hover:border-brand-bean/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-bean text-sm font-black text-brand-cream">
                  {user.localRank}
                </div>
                <div>
                  <p className="font-semibold text-brand-bean">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-brand-bean/70">{user.uniqueId} • {user.position} • {user.city}</p>
                </div>
              </div>

              <div className="grid min-w-[180px] grid-cols-3 gap-3 text-center text-xs text-brand-bean/70">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em]">Points</div>
                  <div className="mt-1 text-sm font-bold text-brand-bean">{user.points}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em]">Progress</div>
                  <div className="mt-1 text-sm font-bold text-brand-bean">{user.progress}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em]">Tasks</div>
                  <div className="mt-1 text-sm font-bold text-brand-bean">{user.completedTasks}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bean/45 px-4">
          <div className="w-full max-w-2xl rounded-[32px] border-2 border-brand-bean bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-bean/50">Mini Profile</p>
                <h3 className="mt-2 text-2xl font-black text-brand-bean">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="mt-1 text-sm text-brand-bean/70">{selectedUser.uniqueId} • {selectedUser.position} • {selectedUser.city}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="rounded-full border border-brand-bean/20 px-3 py-1 text-sm text-brand-bean">
                Закрыть
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-brand-cream p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-brand-bean/50">Результат</p>
                <div className="mt-3 space-y-2 text-sm text-brand-bean/80">
                  <p><span className="font-semibold text-brand-bean">Очки:</span> {selectedUser.points}</p>
                  <p><span className="font-semibold text-brand-bean">Прогресс:</span> {selectedUser.progress}%</p>
                  <p><span className="font-semibold text-brand-bean">Задачи:</span> {selectedUser.completedTasks}</p>
                  <p><span className="font-semibold text-brand-bean">GitHub:</span> {selectedUser.github || "Не указан"}</p>
                  <p><span className="font-semibold text-brand-bean">Уровень:</span> {selectedUser.level}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-brand-cream p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-brand-bean/50">Описание</p>
                <p className="mt-3 text-sm leading-6 text-brand-bean/80">{selectedUser.bio || "Пользователь пока не заполнил описание."}</p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-[#f3e8da] p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-brand-bean/50">Навыки</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedUser.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-brand-bean/15 bg-white px-3 py-1 text-[11px] text-brand-bean">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
