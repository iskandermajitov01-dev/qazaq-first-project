import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const TryoutMode = () => {
  const {
    currentUserProfile,
    tryoutChallenges,
    tryoutEntries,
    tryoutLeaderboard,
    shadowTeam,
    submitTryoutEntry,
    reviewTryoutEntry,
  } = useAppContext();
  const [selectedChallenge, setSelectedChallenge] = useState(tryoutChallenges[0]?.id || "");
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState("");

  const currentChallenge = useMemo(
    () => tryoutChallenges.find((challenge) => challenge.id === selectedChallenge) || tryoutChallenges[0],
    [selectedChallenge, tryoutChallenges]
  );

  const myEntries = useMemo(
    () => tryoutEntries.filter((entry) => entry.userId === currentUserProfile?.uniqueId),
    [currentUserProfile?.uniqueId, tryoutEntries]
  );

  const pendingEntries = useMemo(
    () => tryoutEntries.filter((entry) => entry.status === "pending").slice(0, 4),
    [tryoutEntries]
  );

  return (
    <div className="space-y-6">
      <section className="cute-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-[linear-gradient(135deg,#11273f_0%,#245c73_38%,#ffb74d_100%)] p-6 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/65">Tryout Mode</p>
            <h2 className="mt-3 text-3xl font-black">Отбор по фактам</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
              Участники выполняют задания, получают оценку и попадают либо в основной состав, либо в сильный резервный Shadow Team.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Challenges</p>
                <p className="mt-2 text-2xl font-black">{tryoutChallenges.length}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Submissions</p>
                <p className="mt-2 text-2xl font-black">{tryoutEntries.length}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Shadow Team</p>
                <p className="mt-2 text-2xl font-black">{shadowTeam.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-cream p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-bean/55">Current Stage</p>
            <h3 className="mt-3 text-2xl font-black text-brand-bean">{currentChallenge?.title || "Tryout"}</h3>
            <p className="mt-2 text-sm text-brand-bean/75">{currentChallenge?.description}</p>
            <div className="mt-5 grid gap-3 text-sm text-brand-bean/75">
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-brand-bean">Категория:</span> {currentChallenge?.category}
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-brand-bean">Дедлайн:</span> {currentChallenge?.deadline}
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <span className="font-semibold text-brand-bean">Макс. очки:</span> {currentChallenge?.points}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <article className="cute-card p-5">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-brand-bean">Отправить tryout-решение</h3>
              <p className="mt-1 text-sm text-brand-bean/70">Можно использовать это как тестовый режим отбора перед сезоном или набором команды.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tryoutChallenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      selectedChallenge === challenge.id ? "bg-brand-mint text-brand-bean" : "bg-brand-cream text-brand-bean/70"
                    }`}
                  >
                    {challenge.title}
                  </button>
                ))}
              </div>

              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                rows={6}
                className="w-full rounded-3xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-4 text-sm text-brand-bean outline-none"
                placeholder="Опиши решение, логику, результат, ссылки на артефакты и почему именно ты должен попасть в основной состав."
              />

              <button
                onClick={() => {
                  const result = submitTryoutEntry({ challengeId: selectedChallenge, summary });
                  if (result.ok) {
                    setFeedback("Заявка отправлена. Теперь она видна в tryout-ленте и ожидает оценки.");
                    setSummary("");
                  } else {
                    setFeedback("Не удалось отправить заявку. Проверь, что ты вошел в систему и заполнил текст.");
                  }
                }}
                className="cute-btn px-5 py-3 text-sm"
              >
                Отправить решение
              </button>

              {feedback && <p className="rounded-2xl bg-brand-bean/5 px-4 py-3 text-sm text-brand-bean/80">{feedback}</p>}
            </div>
          </article>

          <article className="cute-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-bean">Мои tryout-заявки</h3>
              <span className="rounded-full bg-brand-bean/5 px-3 py-1 text-xs text-brand-bean">{myEntries.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {myEntries.length ? (
                myEntries.map((entry) => {
                  const challenge = tryoutChallenges.find((item) => item.id === entry.challengeId);
                  return (
                    <div key={entry.id} className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-brand-bean">{challenge?.title || entry.challengeId}</p>
                          <p className="mt-1 text-xs text-brand-bean/70">{entry.summary}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-3 py-2 text-right">
                          <div className="text-[10px] uppercase tracking-[0.15em] text-brand-bean/50">{entry.status}</div>
                          <div className="mt-1 text-sm font-bold text-brand-bean">{entry.score}</div>
                        </div>
                      </div>
                      {entry.reviewerNote && <p className="mt-3 text-xs text-brand-bean/70">Комментарий: {entry.reviewerNote}</p>}
                    </div>
                  );
                })
              ) : (
                <p className="rounded-3xl bg-brand-cream px-4 py-4 text-sm text-brand-bean/70">Пока нет заявок. Отправь первое решение выше.</p>
              )}
            </div>
          </article>
        </section>

        <section className="space-y-6">
          <article className="cute-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-bean">Tryout Leaderboard</h3>
              <span className="rounded-full bg-brand-mint/10 px-3 py-1 text-xs text-brand-bean">Top performers</span>
            </div>
            <div className="mt-4 space-y-3">
              {tryoutLeaderboard.map((entry) => (
                <div key={entry.userId} className="rounded-3xl border border-brand-bean/10 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-brand-bean/45">#{entry.rank}</p>
                      <p className="mt-1 font-semibold text-brand-bean">{entry.userName}</p>
                      <p className="text-xs text-brand-bean/70">{entry.city} • reviewed {entry.reviewed} • pending {entry.pending}</p>
                    </div>
                    <div className="rounded-2xl bg-brand-cream px-4 py-3 text-right">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-brand-bean/50">Score</div>
                      <div className="text-lg font-black text-brand-bean">{entry.totalScore}</div>
                      <div className="text-[11px] text-brand-bean/60">{entry.scorePct}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="cute-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-bean">Shadow Team</h3>
              <span className="rounded-full bg-brand-rose/20 px-3 py-1 text-xs text-brand-bean">Reserve roster</span>
            </div>
            <div className="mt-4 space-y-3">
              {shadowTeam.map((member) => (
                <div key={member.userId} className="rounded-3xl border border-brand-bean/10 bg-[#fff8ef] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-brand-bean/45">{member.slot}</p>
                      <p className="mt-1 font-semibold text-brand-bean">{member.userName}</p>
                      <p className="text-xs text-brand-bean/70">{member.position} • {member.city}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 text-right">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-brand-bean/50">Tryout</div>
                      <div className="text-sm font-black text-brand-bean">{member.totalScore}</div>
                    </div>
                  </div>
                  {!!member.skills.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full border border-brand-bean/15 bg-white px-3 py-1 text-[11px] text-brand-bean">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!shadowTeam.length && (
                <p className="rounded-3xl bg-brand-cream px-4 py-4 text-sm text-brand-bean/70">Shadow Team появится после оцененных tryout-заявок.</p>
              )}
            </div>
          </article>

          <article className="cute-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-bean">Быстрый review</h3>
              <span className="rounded-full bg-brand-bean/5 px-3 py-1 text-xs text-brand-bean">{pendingEntries.length} pending</span>
            </div>
            <div className="mt-4 space-y-3">
              {pendingEntries.map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-brand-bean/10 bg-brand-cream p-4">
                  <p className="font-semibold text-brand-bean">{entry.userName}</p>
                  <p className="mt-1 text-xs text-brand-bean/70">{entry.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[15, 25, 35].map((score) => (
                      <button
                        key={score}
                        onClick={() => reviewTryoutEntry(entry.id, score, `Оценено в quick review на ${score} баллов`)}
                        className="rounded-2xl border border-brand-bean/20 bg-white px-3 py-2 text-xs font-semibold text-brand-bean"
                      >
                        Оценить {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!pendingEntries.length && (
                <p className="rounded-3xl bg-brand-cream px-4 py-4 text-sm text-brand-bean/70">Сейчас нет заявок, ожидающих проверки.</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default TryoutMode;
