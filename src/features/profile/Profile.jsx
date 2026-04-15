import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext.jsx";

const roleMap = {
  participant: "Участник",
  mentor: "Наставник",
  verifier: "Проверяющий",
  admin: "Админ",
  coder: "Программист",
  engineer: "Инженер",
  manager: "Капитан",
};

const defaultProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  age: "",
  city: "",
  team: "",
  teamRole: "",
  position: "",
  experience: "",
  bio: "",
  skills: "",
  projects: "",
  github: "",
  level: "Основы",
  reputation: "Новичок",
  progress: 0,
  completedTasks: 0,
  email: localStorage.getItem("qazaq-email") || "demo@qazaq.kz",
  role: localStorage.getItem("qazaq-role") || "coder",
  uniqueId: "",
};

const Profile = () => {
  const navigate = useNavigate();
  const {
    mentors,
    mentorRequests,
    requestMentor,
    contribution,
    currentUserProfile,
    currentTeam,
    talentScore,
    updateProfile,
    addAchievement,
    updateAchievementStatus,
  } = useAppContext();
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState("");
  const [newAchievementPoints, setNewAchievementPoints] = useState(10);

  useEffect(() => {
    if (currentUserProfile && Object.keys(currentUserProfile).length) {
      setProfile((prev) => ({
        ...prev,
        ...currentUserProfile,
        skills: Array.isArray(currentUserProfile.skills) ? currentUserProfile.skills.join(", ") : currentUserProfile.skills || "",
        projects: Array.isArray(currentUserProfile.projects) ? currentUserProfile.projects.join(", ") : currentUserProfile.projects || "",
      }));
      return;
    }

    const savedProfile = localStorage.getItem("qazaq-profile");
    if (!savedProfile) return;

    const parsed = JSON.parse(savedProfile);
    setProfile((prev) => ({
      ...prev,
      ...parsed,
      skills: Array.isArray(parsed.skills) ? parsed.skills.join(", ") : parsed.skills || "",
      projects: Array.isArray(parsed.projects) ? parsed.projects.join(", ") : parsed.projects || "",
    }));
  }, [currentUserProfile]);

  const logout = () => {
    localStorage.removeItem("qazaq-email");
    localStorage.removeItem("qazaq-role");
    localStorage.removeItem("qazaq-profile");
    localStorage.removeItem("qazaq-current-user");
    navigate("/login");
  };

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const skillList = useMemo(
    () => profile.skills?.split(",").map((item) => item.trim()).filter(Boolean) || [],
    [profile.skills]
  );

  const projectList = useMemo(
    () => profile.projects?.split(",").map((item) => item.trim()).filter(Boolean) || [],
    [profile.projects]
  );

  const achievements = currentUserProfile?.achievements || [];
  const verifiedAchievements = achievements.filter((item) => item.status === "verified");
  const calculatedRating = Math.min(
    100,
    Math.round(
      verifiedAchievements.reduce((sum, item) => sum + (item.points || 0), 0) * 0.8 + skillList.length * 5 + projectList.length * 3
    )
  );

  const isParticipant = profile.role === "participant";
  const isMentor = profile.role === "mentor";
  const isVerifier = profile.role === "verifier";
  const isAdmin = profile.role === "admin";
  const canReviewAchievements = isVerifier || isAdmin;
  const canSubmitAchievements = isParticipant || isMentor;

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-500/15 text-green-700 border-green-500/25";
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 border-yellow-500/25";
      case "rejected":
        return "bg-red-500/15 text-red-700 border-red-500/25";
      default:
        return "bg-gray-500/15 text-gray-700 border-gray-500/25";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Проверено";
      case "pending":
        return "Ожидает проверки";
      case "rejected":
        return "Отклонено";
      default:
        return "Неизвестно";
    }
  };

  const saveProfile = () => {
    const normalizedProfile = {
      ...profile,
      skills: skillList,
      projects: projectList,
      progress: Number(profile.progress) || 0,
      completedTasks: Number(profile.completedTasks) || 0,
    };
    updateProfile(normalizedProfile);
    setProfile((prev) => ({
      ...normalizedProfile,
      skills: normalizedProfile.skills.join(", "),
      projects: normalizedProfile.projects.join(", "),
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="grid gap-5">
      <article className="cute-card p-6">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-bean">Мой профиль</h2>
            <p className="mt-2 text-sm text-brand-bean/80">Профиль участника теперь работает как Talent Card для поиска, рейтинга и команд.</p>
          </div>
          <div className="rounded-2xl border-2 border-brand-mint bg-brand-mint/10 px-4 py-3 text-sm text-brand-bean">
            {saved ? "Сохранено" : "Не забудь сохранить изменения"}
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border-2 border-brand-bean/20 bg-brand-cream p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-bean/60">Talent ID</p>
                <h3 className="mt-2 text-xl font-bold text-brand-bean">{profile.uniqueId || "Будет создан после регистрации"}</h3>
                <p className="mt-1 text-xs text-brand-bean/70">
                  {profile.firstName || "Без имени"} {profile.lastName || ""}
                </p>
              </div>
              <div className="rounded-2xl bg-brand-mint px-3 py-2 text-xs font-semibold text-brand-bean">{profile.level}</div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-brand-bean">
              <div className="flex items-center justify-between">
                <span>Рейтинг</span>
                <span className="font-semibold">{calculatedRating}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Роль</span>
                <span className="font-semibold">{roleMap[profile.role] || profile.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Репутация</span>
                <span className="font-semibold">{profile.reputation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Команда</span>
                <span className="font-semibold">{currentTeam?.name || profile.team || "Пока нет"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GitHub</span>
                <span className="font-semibold">{profile.github || "Не привязан"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Навыки</span>
                <span className="font-semibold">{skillList.length}</span>
              </div>
              <div>
                <p className="text-xs text-brand-bean/70">Прогресс</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-bean/10">
                  <div className="h-full rounded-full bg-brand-mint" style={{ width: `${Math.min(Math.max(profile.progress, 0), 100)}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-brand-bean/10 px-3 py-2 text-xs font-semibold text-brand-bean">Score</div>
                <div className="rounded-2xl bg-brand-cream px-3 py-2 text-right text-xs font-semibold text-brand-bean">{talentScore}</div>
              </div>
              {canReviewAchievements && (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-50 p-3 text-xs text-yellow-700">
                  Роль проверяющего: вы можете подтверждать и отклонять достижения участников.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border-2 border-brand-bean/20 bg-brand-cream p-5">
            <h3 className="text-sm font-semibold text-brand-bean">Навыки</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillList.length ? (
                skillList.map((skill) => (
                  <span key={skill} className="rounded-full border border-brand-bean/20 bg-[#f3e8da] px-3 py-1 text-[11px] text-brand-bean">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-brand-bean/70">Добавь навыки в профиль, чтобы они появились здесь.</p>
              )}
            </div>

            <h3 className="mt-6 text-sm font-semibold text-brand-bean">Проекты</h3>
            <div className="mt-4 space-y-2">
              {projectList.length ? (
                projectList.map((project) => (
                  <div key={project} className="rounded-2xl border border-brand-bean/10 bg-white/90 px-3 py-2 text-[11px] text-brand-bean">
                    {project}
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-bean/70">Список пуст. Добавь несколько проектов.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-brand-bean">
            Имя
            <input
              value={profile.firstName}
              onChange={handleChange("firstName")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Алия"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Фамилия
            <input
              value={profile.lastName}
              onChange={handleChange("lastName")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Кайратова"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Телефон
            <input
              value={profile.phone}
              onChange={handleChange("phone")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="+7 700 123 45 67"
              type="tel"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Возраст
            <input
              value={profile.age}
              onChange={handleChange("age")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="17"
              type="number"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Город
            <input
              value={profile.city}
              onChange={handleChange("city")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Алматы"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Команда
            <input
              value={currentTeam?.name || profile.team || ""}
              onChange={handleChange("team")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Qazaq Robotics"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Позиция
            <input
              value={profile.position}
              onChange={handleChange("position")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Лидер команды"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Навыки
            <input
              value={profile.skills}
              onChange={handleChange("skills")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="C++, Arduino, 3D Print"
            />
            <p className="text-[11px] text-brand-bean/60">Через запятую</p>
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            GitHub
            <input
              value={profile.github || ""}
              onChange={handleChange("github")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="your-github-username"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Проекты
            <input
              value={profile.projects}
              onChange={handleChange("projects")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Автономный робот, Презентация"
            />
            <p className="text-[11px] text-brand-bean/60">Через запятую</p>
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Unique ID
            <input
              value={profile.uniqueId || ""}
              readOnly
              className="w-full rounded-2xl border-2 border-brand-bean/10 bg-brand-bean/5 px-4 py-3 text-sm text-brand-bean outline-none"
              placeholder="QFH-ALA-1234"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Уровень
            <select
              value={profile.level}
              onChange={handleChange("level")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
            >
              <option>Основы</option>
              <option>Участие</option>
              <option>Соревнования</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Репутация
            <select
              value={profile.reputation}
              onChange={handleChange("reputation")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
            >
              <option>Новичок</option>
              <option>Активист</option>
              <option>Лидер</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Прогресс команды
            <input
              value={profile.progress}
              onChange={handleChange("progress")}
              type="number"
              min={0}
              max={100}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="0"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Опыт, год(а)
            <input
              value={profile.experience}
              onChange={handleChange("experience")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="3 года"
            />
          </label>
        </div>

        <label className="mt-4 space-y-2 text-sm text-brand-bean">
          Кратко о себе
          <textarea
            value={profile.bio}
            onChange={handleChange("bio")}
            rows={4}
            className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
            placeholder="Я занимаюсь программированием роботов, участвую в соревнованиях и люблю помогать команде."
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-xs text-brand-bean/70">
            <p>Email: {profile.email}</p>
            <p>Роль в системе: {roleMap[profile.role] || profile.role}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={logout} className="rounded-2xl border-2 border-brand-bean/20 px-5 py-3 text-sm font-semibold text-brand-bean">
              Выйти
            </button>
            <button type="button" onClick={saveProfile} className="cute-btn rounded-2xl px-6 py-3 font-semibold text-brand-bean">
              Сохранить профиль
            </button>
          </div>
        </div>
      </article>

      <article className="cute-card p-6">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-bean">Достижения</h2>
            <p className="mt-2 text-sm text-brand-bean/80">Подтвержденные достижения влияют на рейтинг и профиль участника.</p>
          </div>
          <div className="text-sm text-brand-bean/70">Проверено: {verifiedAchievements.length} из {achievements.length}</div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`rounded-2xl border-2 p-4 ${getStatusColor(achievement.status)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-brand-bean">{achievement.title}</h4>
                    <p className="mb-2 text-xs text-brand-bean/70">
                      {achievement.points} очков • {getStatusText(achievement.status)}
                    </p>
                    {achievement.status === "verified" && achievement.verifiedAt && (
                      <p className="text-[10px] text-green-700">Проверено: {achievement.verifiedAt}</p>
                    )}
                    {achievement.status === "pending" && achievement.submittedAt && (
                      <p className="text-[10px] text-yellow-700">Отправлено: {achievement.submittedAt}</p>
                    )}
                    {achievement.status === "rejected" && achievement.reason && (
                      <p className="text-[10px] text-red-700">Причина: {achievement.reason}</p>
                    )}
                  </div>
                  {achievement.status === "pending" && canReviewAchievements && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateAchievementStatus(achievement.id, "verified")}
                        className="rounded bg-green-500/20 px-2 py-1 text-[10px] text-green-700 hover:bg-green-500/30"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => updateAchievementStatus(achievement.id, "rejected", "Недостаточно доказательств")}
                        className="rounded bg-red-500/20 px-2 py-1 text-[10px] text-red-700 hover:bg-red-500/30"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {achievements.length === 0 && (
              <p className="py-8 text-center text-sm text-brand-bean/70">Пока нет достижений. Добавь первое.</p>
            )}
          </div>

          <div className="rounded-3xl border-2 border-brand-bean/20 bg-brand-cream p-5">
            <h3 className="mb-4 text-sm font-semibold text-brand-bean">Добавить достижение</h3>
            <div className="space-y-3">
              <input
                value={newAchievementTitle}
                onChange={(event) => setNewAchievementTitle(event.target.value)}
                className="w-full rounded-2xl border-2 border-brand-bean/20 bg-white px-3 py-2 text-sm text-brand-bean outline-none"
                placeholder="Название достижения"
              />
              <input
                value={newAchievementPoints}
                onChange={(event) => setNewAchievementPoints(event.target.value)}
                type="number"
                min="1"
                max="100"
                className="w-full rounded-2xl border-2 border-brand-bean/20 bg-white px-3 py-2 text-sm text-brand-bean outline-none"
                placeholder="Очки (1-100)"
              />
              {canSubmitAchievements ? (
                <button
                  onClick={() => {
                    if (!newAchievementTitle.trim()) return;
                    addAchievement(newAchievementTitle.trim(), newAchievementPoints);
                    setNewAchievementTitle("");
                    setNewAchievementPoints(10);
                  }}
                  className="cute-btn w-full py-2 text-sm"
                  disabled={!newAchievementTitle.trim()}
                >
                  Добавить достижение
                </button>
              ) : (
                <div className="rounded-2xl border border-brand-bean/20 bg-brand-cream p-4 text-sm text-brand-bean/70">
                  Только участники и наставники могут отправлять достижения.
                </div>
              )}
            </div>
            <p className="mt-3 text-[11px] text-brand-bean/60">После добавления достижение будет ожидать проверки модератором.</p>
          </div>
        </div>
      </article>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="cute-card p-5">
          <h3 className="text-sm font-semibold text-brand-bean">Mentor Marketplace</h3>
          <div className="mt-3 space-y-3">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream p-3 text-sm">
                <p className="font-semibold text-brand-bean">{mentor.name}</p>
                <p className="mt-1 text-xs text-brand-bean/80">{mentor.domain}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-brand-mint/10 px-3 py-1 text-[11px] text-brand-bean">slots {mentor.slots}</span>
                  <button
                    onClick={() => requestMentor(mentor)}
                    className="rounded-2xl bg-brand-mint px-3 py-2 text-xs font-semibold text-brand-bean transition hover:bg-brand-mint/80"
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-bean/70">Запросов менторов: {mentorRequests.length}</p>
        </article>

        <article className="cute-card p-5">
          <h3 className="text-sm font-semibold text-brand-bean">Contribution</h3>
          <p className="mt-2 text-xs text-brand-bean/70">Очки за задачи, помощь и участие в команде.</p>
          <div className="mt-4 grid gap-3">
            {Object.keys(contribution).length === 0 ? (
              <p className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream p-4 text-sm text-brand-bean/70">
                Пока нет данных. Выполняй задачи в Kanban, чтобы начать накапливать вклад.
              </p>
            ) : (
              Object.entries(contribution).map(([name, points]) => (
                <div key={name} className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-bean">{name}</span>
                    <span className="text-sm text-brand-bean/70">{points} pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Profile;
