import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleSelection from "./RoleSelection.jsx";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  team: "",
  position: "",
  password: "",
  confirmPassword: "",
  role: "coder",
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
  const pageTitle = isRegister ? "Регистрация команды" : "Вход в систему";

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
        role: form.role,
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
            <h2 className="mt-4 text-3xl font-black text-brand-bean">{pageTitle}</h2>
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
                <RoleSelection onConfirm={(value) => setForm((prev) => ({ ...prev, role: value }))} />
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
    </div>
  );
};

export default Login;
