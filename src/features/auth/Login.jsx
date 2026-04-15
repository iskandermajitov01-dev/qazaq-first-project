import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  team: "",
  position: "",
  skills: "",
  projects: "",
  level: "Основы",
  reputation: "Новичок",
  progress: 0,
  github: "",
  password: "",
  confirmPassword: "",
  role: "participant",
};

const cityCodes = {
  "Алматы": "ALA",
  "Астана": "AST",
  "Шымкент": "SHY",
  "Караганда": "KRG",
  "Атырау": "ATR",
  "Актобе": "AKT",
  "Уральск": "URA",
  "Костанай": "KST",
  "Павлодар": "PAV",
  "Тараз": "TRZ",
  "Кокшетау": "KOK",
  "Семей": "SEM",
};

const normalizeListField = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => item.trim());
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const findUser = (email) => {
  const users = JSON.parse(localStorage.getItem("qazaq-users") || "[]");
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

const saveUser = (user) => {
  const users = JSON.parse(localStorage.getItem("qazaq-users") || "[]");
  const updated = users.filter((item) => item.email.toLowerCase() !== user.email.toLowerCase());
  localStorage.setItem("qazaq-users", JSON.stringify([...updated, user]));
};

const generateUniqueId = (city) => {
  const users = JSON.parse(localStorage.getItem("qazaq-users") || "[]");
  const existingIds = new Set(users.map((user) => user.uniqueId).filter(Boolean));
  const cityCode = cityCodes[city] || "KZ";
  let nextId = "";
  do {
    nextId = `QFH-${cityCode}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existingIds.has(nextId));
  return nextId;
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === "/register";
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const buttonLabel = isRegister ? "Зарегистрироваться" : "Войти";

  useEffect(() => {
    setError("");
    setSuccessMessage("");
    setStep("form");
  }, [isRegister]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const sendTwoFactor = (email) => {
    const verification = generateCode();
    localStorage.setItem("qazaq-2fa-code", verification);
    localStorage.setItem("qazaq-2fa-email", email);
    setPendingEmail(email);
    setSentCode(verification);
    setSuccessMessage(
      `На почту ${email} отправлено письмо с кодом подтверждения. Используйте код ${verification} для входа.`
    );
    setStep("verify");
  };

  const loginUser = (user) => {
    localStorage.setItem("qazaq-email", user.email);
    localStorage.setItem("qazaq-role", user.role);
    localStorage.setItem("qazaq-profile", JSON.stringify(user));
    localStorage.setItem("qazaq-current-user", JSON.stringify(user));
    navigate("/");
  };

  const quickLogin = (role) => {
    const demoUser = {
      firstName: `Demo`,
      lastName: role.charAt(0).toUpperCase() + role.slice(1),
      email: `demo-${role}@test.local`,
      phone: "+7 700 000 0000",
      age: "20",
      city: "Demo City",
      team: "Demo Team",
      position: "Demo Position",
      skills: ["Demo"],
      projects: ["Demo"],
      level: "Основы",
      reputation: "Новичок",
      progress: 100,
      completedTasks: 0,
      contributionPoints: 12,
      role,
      uniqueId: `QFH-DEMO-${role.slice(0, 3).toUpperCase()}`,
      github: `demo-${role}`,
      password: "demo",
      verified: true,
      createdAt: new Date().toISOString(),
      achievements: [
        { id: 1, title: "Тест демо", status: "verified", points: 10, verifiedAt: "2024-01-01" },
      ],
    };
    loginUser(demoUser);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (isRegister) {
      if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
        setError("Заполните обязательные поля.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Пароли не совпадают.");
        return;
      }
      if (findUser(form.email)) {
        setError("Пользователь с таким email уже существует.");
        return;
      }
      const nextUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        age: form.age,
        city: form.city,
        team: form.team,
        position: form.position,
        skills: normalizeListField(form.skills),
        projects: normalizeListField(form.projects),
        level: form.level,
        reputation: form.reputation,
        progress: Number(form.progress) || 0,
        completedTasks: 0,
        contributionPoints: 0,
        role: form.role,
        github: form.github.trim(),
        uniqueId: generateUniqueId(form.city),
        password: form.password,
        verified: false,
        createdAt: new Date().toISOString(),
      };
      saveUser(nextUser);
      sendTwoFactor(form.email);
      return;
    }

    const user = findUser(form.email);
    if (!user) {
      setError("Пользователь не найден. Зарегистрируйтесь сначала.");
      return;
    }
    if (user.password !== form.password) {
      setError("Неверный пароль.");
      return;
    }
    sendTwoFactor(user.email);
  };

  const verifyCode = (event) => {
    event.preventDefault();
    const expected = localStorage.getItem("qazaq-2fa-code");
    const emailForCode = localStorage.getItem("qazaq-2fa-email");

    if (code.trim() !== expected || pendingEmail.toLowerCase() !== emailForCode?.toLowerCase()) {
      setError("Неверный код. Проверьте письмо и попробуйте снова.");
      return;
    }

    const user = findUser(pendingEmail);
    if (!user) {
      setError("Пользователь не найден.");
      return;
    }

    user.verified = true;
    saveUser(user);
    loginUser(user);
  };

  const welcomeName = useMemo(() => {
    if (form.firstName || form.lastName) {
      return `${form.firstName} ${form.lastName}`.trim();
    }
    return "Будущий лидер команды";
  }, [form.firstName, form.lastName]);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[32px] border-2 border-brand-bean/20 bg-white/95 p-8 shadow-neon">
          <div className="mb-8">
            <img src="/branding/logo-first-v2.png" alt="FIRST" className="mb-4 w-40" />
            <p className="text-xs uppercase tracking-[0.2em] text-brand-bean/70">Qazaq Robotech</p>
            <h2 className="mt-4 text-3xl font-black text-brand-bean">{isRegister ? "Регистрация участника" : "Вход в систему"}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-bean/80">
              {isRegister
                ? "Создайте профиль участника команды и получите доступ к чату, задачам и обучению."
                : "Войдите в систему и используйте двухфакторную аутентификацию для безопасности."}
            </p>
          </div>

          {step === "form" ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-brand-bean">
                    Имя
                    <input
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="Алия"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-brand-bean">
                    Фамилия
                    <input
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="Кайратова"
                    />
                  </label>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-brand-bean">
                  Email
                  <input
                    required
                    value={form.email}
                    onChange={handleChange("email")}
                    type="email"
                    className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    placeholder="name@school.kz"
                  />
                </label>
                <label className="space-y-2 text-sm text-brand-bean">
                  Пароль
                  <input
                    required
                    value={form.password}
                    onChange={handleChange("password")}
                    type="password"
                    className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    placeholder="••••••••"
                  />
                </label>
              </div>

              {isRegister && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-brand-bean">
                    Подтвердите пароль
                    <input
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      type="password"
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="••••••••"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-brand-bean">
                    Телефон
                    <input
                      value={form.phone}
                      onChange={handleChange("phone")}
                      type="tel"
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="+7 700 123 45 67"
                    />
                  </label>
                </div>
              )}

              {isRegister && (
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-2 text-sm text-brand-bean">
                    Возраст
                    <input
                      value={form.age}
                      onChange={handleChange("age")}
                      type="number"
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="17"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-brand-bean">
                    Город
                    <input
                      value={form.city}
                      onChange={handleChange("city")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="Алматы"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-brand-bean">
                    Команда
                    <input
                      value={form.team}
                      onChange={handleChange("team")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="Qazaq Robotics"
                    />
                  </label>
                </div>
              )}

              {isRegister && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-brand-bean">
                    GitHub username
                    <input
                      value={form.github}
                      onChange={handleChange("github")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="qazaq-robotics"
                    />
                  </label>
                  <div className="rounded-2xl border-2 border-dashed border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean/70">
                    После регистрации система выдаст уникальный Talent ID. По нему участника можно искать и добавлять в команду.
                  </div>
                </div>
              )}

              {isRegister && (
                <label className="space-y-2 text-sm text-brand-bean">
                  Позиция / Роль
                  <input
                    value={form.position}
                    onChange={handleChange("position")}
                    className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    placeholder="Лидер команды"
                  />
                </label>
              )}

              {isRegister && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-brand-bean">
                    Навыки
                    <input
                      value={form.skills}
                      onChange={handleChange("skills")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="C++, Arduino, 3D Print"
                    />
                    <p className="text-[11px] text-brand-bean/60">Через запятую</p>
                  </label>
                  <label className="space-y-2 text-sm text-brand-bean">
                    Проекты
                    <input
                      value={form.projects}
                      onChange={handleChange("projects")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                      placeholder="Автономный робот, Презентация"
                    />
                    <p className="text-[11px] text-brand-bean/60">Через запятую</p>
                  </label>
                </div>
              )}

              {isRegister && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-brand-bean">
                    Уровень
                    <select
                      value={form.level}
                      onChange={handleChange("level")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    >
                      <option>Основы</option>
                      <option>Участие</option>
                      <option>Соревнования</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-brand-bean">
                    Репутация
                    <select
                      value={form.reputation}
                      onChange={handleChange("reputation")}
                      className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    >
                      <option>Новичок</option>
                      <option>Активист</option>
                      <option>Лидер</option>
                    </select>
                  </label>
                </div>
              )}

              {isRegister && (
                <label className="space-y-2 text-sm text-brand-bean">
                  Прогресс команды
                  <input
                    value={form.progress}
                    onChange={handleChange("progress")}
                    type="number"
                    min={0}
                    max={100}
                    className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    placeholder="0"
                  />
                </label>
              )}

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {successMessage && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</p>}

              <button className="cute-btn w-full py-3 text-sm" type="submit">
                {buttonLabel}
              </button>

              <p className="text-center text-xs text-brand-bean/70">
                {isRegister ? (
                  <>Уже есть аккаунт? <Link className="font-semibold text-brand-mint" to="/login">Войти</Link></>
                ) : (
                  <>Новый пользователь? <Link className="font-semibold text-brand-mint" to="/register">Зарегистрироваться</Link></>
                )}
              </p>
            </form>
          ) : (
            <div className="rounded-[28px] border-2 border-brand-bean/20 bg-brand-cream/90 p-6">
              <h3 className="text-xl font-bold text-brand-bean">Подтверждение 2FA</h3>
              <p className="mt-3 text-sm leading-6 text-brand-bean/80">
                Мы отправили одноразовый код на email <span className="font-semibold text-brand-bean">{pendingEmail}</span>.
                Введите его ниже, чтобы завершить вход.
              </p>
              <form className="mt-6 space-y-4" onSubmit={verifyCode}>
                <label className="space-y-2 text-sm text-brand-bean">
                  Код из письма
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
                    placeholder="123456"
                  />
                </label>
                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <button className="cute-btn w-full py-3 text-sm" type="submit">Подтвердить и войти</button>
                <p className="text-xs text-brand-bean/70">
                  Код будет отправлен как письмо: «Ваш код подтверждения: {sentCode}».
                </p>
              </form>
            </div>
          )}
        </div>

        <div className="hidden rounded-[32px] border-2 border-brand-mint bg-brand-mint/10 p-8 text-brand-bean shadow-neon lg:block">
          <h3 className="text-xl font-bold">Привет, {welcomeName}!</h3>
          <p className="mt-4 text-sm leading-7 text-brand-bean/80">
            Здесь ты создашь профиль для своей команды, получишь безопасный доступ и сможешь сразу начать планировать роботов и проекты.
          </p>
          <div className="mt-7 space-y-5">
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-white/90 p-4">
              <p className="text-sm font-semibold">Что мы предлагаем</p>
              <ul className="mt-3 space-y-2 text-sm text-brand-bean/80">
                <li>• Безопасный вход с двухфакторной аутентификацией</li>
                <li>• Детальный профиль участника команды</li>
                <li>• Доступ к чату, событиям и обучению</li>
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-brand-bean/10 bg-white/90 p-4">
              <p className="text-sm font-semibold">Что важно</p>
              <p className="mt-2 text-sm text-brand-bean/80">Всё, что вы введёте при регистрации, сохранится в профиле и поможет команде быстрее начать работу.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full max-w-5xl">
        <div className="rounded-[32px] border-2 border-brand-bean/20 bg-white/95 p-8 shadow-neon">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-bean/70">Демонстрация платформы</p>
            <h2 className="mt-2 text-2xl font-black text-brand-bean">Тестовые панели ролей</h2>
            <p className="mt-3 max-w-2xl text-sm text-brand-bean/80 mx-auto">
              Это демонстрационные панели для тестирования различных ролей в системе. Нажмите кнопку ниже, чтобы войти в панель конкретной роли без заполнения полей регистрации.
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => quickLogin("mentor")}
              className="rounded-3xl border-2 border-brand-bean/20 bg-brand-cream p-5 text-left transition hover:border-brand-bean hover:bg-brand-cream/80"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-bean text-sm font-bold text-brand-cream">
                МТ
              </div>
              <h3 className="text-sm font-semibold text-brand-bean">Наставник</h3>
              <p className="mt-2 text-xs text-brand-bean/70">Управляй командой, отслеживай прогресс</p>
              <button className="mt-4 w-full rounded-2xl bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-bean">
                Войти как Наставник
              </button>
            </button>

            <button
              onClick={() => quickLogin("verifier")}
              className="rounded-3xl border-2 border-brand-bean/20 bg-brand-cream p-5 text-left transition hover:border-brand-bean hover:bg-brand-cream/80"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-bean text-sm font-bold text-brand-cream">
                ВР
              </div>
              <h3 className="text-sm font-semibold text-brand-bean">Проверяющий</h3>
              <p className="mt-2 text-xs text-brand-bean/70">Проверяй достижения, утверждай рейтинги</p>
              <button className="mt-4 w-full rounded-2xl bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-bean">
                Войти как Проверяющий
              </button>
            </button>

            <button
              onClick={() => quickLogin("admin")}
              className="rounded-3xl border-2 border-brand-bean/20 bg-brand-cream p-5 text-left transition hover:border-brand-bean hover:bg-brand-cream/80"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-bean text-sm font-bold text-brand-cream">
                АД
              </div>
              <h3 className="text-sm font-semibold text-brand-bean">Администратор</h3>
              <p className="mt-2 text-xs text-brand-bean/70">Управляй всей системой и метриками</p>
              <button className="mt-4 w-full rounded-2xl bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-bean">
                Войти как Админ
              </button>
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-brand-bean/10 bg-brand-rose/10 p-4 text-center text-xs text-brand-bean/80">
            ⚠️ Это панели для демонстрации и тестирования различных ролей. Используются тестовые данные.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
