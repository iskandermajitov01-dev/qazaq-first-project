import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext.jsx";

const roleMap = {
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
  position: "",
  experience: "",
  bio: "",
  email: localStorage.getItem("qazaq-email") || "demo@qazaq.kz",
  role: localStorage.getItem("qazaq-role") || "coder",
};

const Profile = () => {
  const navigate = useNavigate();
  const { mentors, mentorRequests, requestMentor, contribution } = useAppContext();
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("qazaq-profile");
    if (savedProfile) {
      setProfile((prev) => ({ ...prev, ...JSON.parse(savedProfile) }));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("qazaq-email");
    localStorage.removeItem("qazaq-role");
    navigate("/login");
  };

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const saveProfile = () => {
    localStorage.setItem("qazaq-profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="grid gap-5">
      <article className="cute-card p-6">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-bean">Мой профиль</h2>
            <p className="mt-2 text-sm text-brand-bean/80">Расскажи о себе команде и партнёрам.</p>
          </div>
          <div className="rounded-2xl border-2 border-brand-mint bg-brand-mint/10 px-4 py-3 text-sm text-brand-bean">
            {saved ? "Сохранено ✅" : "Не забудь сохранить изменения"}
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
              value={profile.team}
              onChange={handleChange("team")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Qazaq Robotics"
            />
          </label>
          <label className="space-y-2 text-sm text-brand-bean">
            Роль
            <input
              value={profile.position}
              onChange={handleChange("position")}
              className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none transition hover:border-brand-mint"
              placeholder="Лидер команды"
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
            <p>Роль в системе: {roleMap[profile.role]}</p>
          </div>
          <button
            type="button"
            onClick={saveProfile}
            className="cute-btn rounded-2xl px-6 py-3 font-semibold text-brand-bean"
          >
            Сохранить профиль
          </button>
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
                  <button onClick={() => requestMentor(mentor)} className="rounded-2xl bg-brand-mint px-3 py-2 text-xs font-semibold text-brand-bean transition hover:bg-brand-mint/80">
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
              <p className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream p-4 text-sm text-brand-bean/70">Пока нет данных. Выполняй задачи в Kanban.</p>
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

