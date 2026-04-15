import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const roleTabs = ["All", "Программист", "Инженер", "Дизайнер", "Капитан"];

const explainAddResult = (result) => {
  switch (result.reason) {
    case "team-not-found":
      return "Сначала создайте команду, чтобы приглашать участников.";
    case "user-not-found":
      return "Пользователь с таким Talent ID не найден.";
    case "already-in-team":
      return "Этот участник уже состоит в другой команде.";
    case "duplicate-member":
      return "Участник уже добавлен в вашу команду.";
    default:
      return "Не удалось добавить участника.";
  }
};

const TalentFinder = () => {
  const {
    inviteCandidate,
    userDirectory,
    directoryStats,
    currentTeam,
    currentTeamMembers,
    createTeam,
    addUserToTeamById,
    buildSuggestedTeam,
  } = useAppContext();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [suggestedTeam, setSuggestedTeam] = useState([]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return userDirectory.filter((user) => {
      const matchesRole = filter === "All" || user.position === filter;
      const haystack = [
        user.uniqueId,
        user.firstName,
        user.lastName,
        user.city,
        user.position,
        user.github,
        ...(user.skills || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesRole && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [filter, query, userDirectory]);

  const handleCreateTeam = () => {
    const result = createTeam(teamName);
    if (result.ok) {
      setFeedback(`Команда "${result.team.name}" создана. Теперь можно добавлять участников по Talent ID.`);
      setTeamName("");
      return;
    }
    setFeedback(result.reason === "duplicate" ? "Команда с таким названием уже существует." : "Введите корректное название команды.");
  };

  const handleAddById = () => {
    const result = addUserToTeamById(memberId);
    if (result.ok) {
      setFeedback(`${result.candidate.name} добавлен(а) в команду ${currentTeam?.name || ""}.`);
      setMemberId("");
      return;
    }
    setFeedback(explainAddResult(result));
  };

  const handleSuggestTeam = () => {
    const suggestion = buildSuggestedTeam();
    setSuggestedTeam(suggestion);
    setFeedback("Система собрала рекомендуемый состав команды по навыкам и балансу ролей.");
  };

  return (
    <div className="space-y-8">
      <section className="cute-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-[linear-gradient(135deg,#17324d_0%,#245b6f_40%,#8be0c8_100%)] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">Team Builder</p>
            <h2 className="mt-3 text-3xl font-black">Talent Directory</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
              Здесь можно искать участников по Talent ID, городу, навыкам и роли. Экран уже готов для демо-набора в команды по всему Казахстану.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Участники</p>
                <p className="mt-2 text-2xl font-black">{directoryStats.totalParticipants}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Города</p>
                <p className="mt-2 text-2xl font-black">{directoryStats.totalCities}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">В командах</p>
                <p className="mt-2 text-2xl font-black">{directoryStats.inTeams}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Свободны</p>
                <p className="mt-2 text-2xl font-black">{directoryStats.freeAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-cream p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-bean/60">Current Team</p>
            <h3 className="mt-3 text-2xl font-black text-brand-bean">{currentTeam?.name || "Команда еще не создана"}</h3>
            <p className="mt-2 text-sm text-brand-bean/75">
              {currentTeam
                ? `В команде сейчас ${currentTeamMembers.length} участник(ов). Можно добавлять людей вручную по Talent ID или через smart-отбор.`
                : "Создай команду, и система начнет собирать состав вокруг твоего профиля."}
            </p>

            <div className="mt-5 space-y-3">
              <input
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                className="w-full rounded-2xl border-2 border-brand-bean/20 bg-white px-4 py-3 text-sm text-brand-bean outline-none"
                placeholder="Название команды"
              />
              <button onClick={handleCreateTeam} className="cute-btn w-full py-3 text-sm">
                Создать команду
              </button>
              <input
                value={memberId}
                onChange={(event) => setMemberId(event.target.value.toUpperCase())}
                className="w-full rounded-2xl border-2 border-brand-bean/20 bg-white px-4 py-3 text-sm text-brand-bean outline-none"
                placeholder="Talent ID, например QFH-ALA-1234"
              />
              <button onClick={handleAddById} className="rounded-2xl border-2 border-brand-bean bg-white px-4 py-3 text-sm font-semibold text-brand-bean">
                Добавить по ID
              </button>
              <button onClick={handleSuggestTeam} className="rounded-2xl border-2 border-brand-bean bg-brand-rose/20 px-4 py-3 text-sm font-semibold text-brand-bean">
                Smart Team Builder
              </button>
              {feedback && <p className="rounded-2xl bg-brand-bean/5 px-4 py-3 text-sm text-brand-bean/80">{feedback}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="cute-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-bold text-brand-bean">Поиск участников</h3>
                <p className="mt-1 text-sm text-brand-bean/70">Ищи людей по городу, навыкам, GitHub username или Talent ID.</p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none lg:w-80"
                  placeholder="Поиск по ID, городу, навыку..."
                />
                <div className="flex flex-wrap gap-2">
                  {roleTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        filter === tab ? "bg-brand-mint text-brand-bean" : "bg-brand-cream text-brand-bean/70"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredUsers.map((user) => (
              <article key={user.uniqueId} className="cute-card p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-brand-bean/50">{user.uniqueId}</p>
                    <h3 className="mt-2 text-lg font-bold text-brand-bean">{user.firstName} {user.lastName}</h3>
                    <p className="text-xs text-brand-bean/70">{user.position} • {user.city}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-mint/15 px-3 py-2 text-right">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-brand-bean/50">Score</div>
                    <div className="text-sm font-bold text-brand-bean">{user.score}</div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {user.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full border border-brand-bean/15 bg-brand-cream px-3 py-1 text-[11px] text-brand-bean">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-xs text-brand-bean/70">
                  <div className="rounded-2xl bg-brand-bean/5 px-3 py-3">
                    <div className="text-[10px] uppercase tracking-[0.15em]">Progress</div>
                    <div className="mt-1 text-sm font-semibold text-brand-bean">{user.progress}%</div>
                  </div>
                  <div className="rounded-2xl bg-brand-bean/5 px-3 py-3">
                    <div className="text-[10px] uppercase tracking-[0.15em]">GitHub</div>
                    <div className="mt-1 truncate text-sm font-semibold text-brand-bean">{user.github || "Not set"}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 rounded-2xl border-2 border-brand-bean bg-white px-4 py-3 text-sm font-semibold text-brand-bean"
                  >
                    Мини-профиль
                  </button>
                  <button
                    onClick={() => {
                      inviteCandidate(user);
                      setFeedback(`${user.firstName} ${user.lastName} добавлен(а) в short-list.`);
                    }}
                    className="cute-btn flex-1 py-3 text-sm"
                  >
                    В short-list
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="cute-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-bean">Состав команды</h3>
              <span className="rounded-full bg-brand-bean/5 px-3 py-1 text-xs text-brand-bean">{currentTeamMembers.length} members</span>
            </div>

            <div className="mt-4 space-y-3">
              {currentTeamMembers.length ? (
                currentTeamMembers.map((member) => (
                  <div key={member.uniqueId} className="rounded-2xl border border-brand-bean/15 bg-brand-cream p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-brand-bean/50">{member.uniqueId}</p>
                        <p className="font-semibold text-brand-bean">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-brand-bean/70">{member.position} • {member.city}</p>
                      </div>
                      <div className="rounded-2xl bg-white px-3 py-2 text-right">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-brand-bean/50">Score</div>
                        <div className="text-sm font-bold text-brand-bean">{member.score}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-brand-bean/5 px-4 py-4 text-sm text-brand-bean/70">
                  После создания команды здесь появится текущий состав.
                </p>
              )}
            </div>
          </section>

          <section className="cute-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-bean">Smart suggestion</h3>
              <button onClick={handleSuggestTeam} className="text-xs font-semibold text-brand-bean/70 underline underline-offset-4">
                Обновить
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {suggestedTeam.length ? (
                suggestedTeam.map((member) => (
                  <div key={member.uniqueId} className="rounded-2xl border border-brand-bean/15 bg-[#eef8f3] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-brand-bean/50">{member.slot}</p>
                        <p className="mt-1 font-semibold text-brand-bean">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-brand-bean/70">{member.position} • {member.uniqueId}</p>
                      </div>
                      <button
                        onClick={() => {
                          const result = addUserToTeamById(member.uniqueId);
                          setFeedback(result.ok ? `${member.firstName} добавлен(а) в команду.` : explainAddResult(result));
                        }}
                        className="rounded-xl bg-brand-mint px-3 py-2 text-xs font-semibold text-brand-bean"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-brand-bean/5 px-4 py-4 text-sm text-brand-bean/70">
                  Нажми Smart Team Builder, чтобы получить рекомендуемый состав.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bean/45 px-4">
          <div className="w-full max-w-2xl rounded-[32px] border-2 border-brand-bean bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-bean/50">{selectedUser.uniqueId}</p>
                <h3 className="mt-2 text-2xl font-black text-brand-bean">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="mt-1 text-sm text-brand-bean/70">{selectedUser.position} • {selectedUser.city}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="rounded-full border border-brand-bean/20 px-3 py-1 text-sm text-brand-bean">
                Закрыть
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-brand-cream p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand-bean/50">Профиль</p>
                <div className="mt-3 space-y-2 text-sm text-brand-bean/80">
                  <p><span className="font-semibold text-brand-bean">GitHub:</span> {selectedUser.github || "Не указан"}</p>
                  <p><span className="font-semibold text-brand-bean">Уровень:</span> {selectedUser.level}</p>
                  <p><span className="font-semibold text-brand-bean">Прогресс:</span> {selectedUser.progress}%</p>
                  <p><span className="font-semibold text-brand-bean">Завершено задач:</span> {selectedUser.completedTasks}</p>
                  <p><span className="font-semibold text-brand-bean">Опыт:</span> {selectedUser.experience || "Не указан"}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-brand-cream p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand-bean/50">О себе</p>
                <p className="mt-3 text-sm leading-6 text-brand-bean/80">{selectedUser.bio || "Пользователь пока не заполнил описание."}</p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-[#f3e8da] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-bean/50">Навыки</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedUser.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-brand-bean/15 bg-white px-3 py-1 text-[11px] text-brand-bean">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  const result = addUserToTeamById(selectedUser.uniqueId);
                  setFeedback(result.ok ? `${selectedUser.firstName} добавлен(а) в команду.` : explainAddResult(result));
                }}
                className="cute-btn flex-1 py-3 text-sm"
              >
                Добавить в команду
              </button>
              <button
                onClick={() => {
                  inviteCandidate(selectedUser);
                  setFeedback(`${selectedUser.firstName} ${selectedUser.lastName} добавлен(а) в short-list.`);
                }}
                className="flex-1 rounded-2xl border-2 border-brand-bean bg-white px-4 py-3 text-sm font-semibold text-brand-bean"
              >
                Добавить в short-list
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentFinder;
