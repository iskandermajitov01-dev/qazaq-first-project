import { NavLink, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav.jsx";

const participantNavItems = [
  { to: "/", label: "Дашборд", short: "DB" },
  { to: "/matchmaking", label: "Команды", short: "TM" },
  { to: "/leaderboard", label: "Рейтинг", short: "LB" },
  { to: "/tryouts", label: "Tryout", short: "TO" },
  { to: "/kanban", label: "Задачи", short: "KB" },
  { to: "/chat", label: "Чат", short: "CH" },
  { to: "/events", label: "События", short: "EV" },
  { to: "/news", label: "Новости", short: "NW" },
  { to: "/learning", label: "AI Асс.", short: "AI" },
  { to: "/profile", label: "Профиль", short: "PR" },
];

const mentorNavItems = [
  { to: "/mentor", label: "Наставник", short: "MT" },
  { to: "/matchmaking", label: "Команды", short: "TM" },
  { to: "/leaderboard", label: "Рейтинг", short: "LB" },
  { to: "/tryouts", label: "Tryout", short: "TO" },
];

const verifierNavItems = [
  { to: "/verifier", label: "Проверяющий", short: "VR" },
  { to: "/leaderboard", label: "Рейтинг", short: "LB" },
  { to: "/tryouts", label: "Tryout", short: "TO" },
];

const adminNavItems = [
  { to: "/admin", label: "Админ", short: "AD" },
  { to: "/leaderboard", label: "Рейтинг", short: "LB" },
  { to: "/tryouts", label: "Tryout", short: "TO" },
];

const baseClass = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("qazaq-profile") || "{}");
  const role = profile.role || localStorage.getItem("qazaq-role") || "participant";
  const displayName = profile.firstName ? `Привет, ${profile.firstName}` : "Добро пожаловать";
  const navItems =
    role === "mentor"
      ? mentorNavItems
      : role === "verifier"
        ? verifierNavItems
        : role === "admin"
          ? adminNavItems
          : participantNavItems;

  const logout = () => {
    localStorage.removeItem("qazaq-email");
    localStorage.removeItem("qazaq-role");
    localStorage.removeItem("qazaq-profile");
    localStorage.removeItem("qazaq-current-user");
    localStorage.removeItem("qazaq-2fa-code");
    localStorage.removeItem("qazaq-2fa-email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen pb-20 md:grid md:grid-cols-[280px_1fr_260px] md:pb-0">
      <aside className="hidden rounded-br-[40px] rounded-tr-[40px] border-r-2 border-brand-bean bg-brand-cream p-6 shadow-neon md:block">
        <img src="/branding/logo-first-v2.png" alt="FIRST Logo" className="mb-5 w-52" />
        <h1 className="mb-8 text-2xl font-extrabold text-brand-bean">Qazaq Robotech</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive
                    ? "border-2 border-brand-bean bg-brand-mint text-brand-bean"
                    : "border-2 border-transparent text-brand-bean hover:bg-brand-rose/30"
                }`
              }
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-bean text-[10px] font-semibold text-brand-cream">
                {item.short}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-brand-cream/90 px-4 py-5 md:px-8 md:py-8">
        <header className="sticky top-0 z-10 mb-5 flex h-16 items-center justify-between rounded-3xl border-2 border-brand-bean bg-brand-cream/95 px-5 text-xs text-brand-bean shadow-neon backdrop-blur sm:text-sm">
          <div>
            <p className="font-semibold text-brand-bean/70">{displayName}</p>
            <p className="text-brand-bean/70">Добро пожаловать в ваш командный центр</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border-2 border-brand-bean bg-brand-rose/20 px-4 py-2 text-xs font-semibold text-brand-bean transition hover:bg-brand-rose/30"
          >
            Выйти
          </button>
        </header>
        <div className="p-4 md:p-0">{children}</div>
      </main>

      <aside className="hidden flex-col gap-4 border-l-2 border-brand-rose bg-brand-blush/20 p-4 md:flex">
        <div className="rounded-[32px] border-2 border-brand-rose bg-white/90 p-5 text-sm text-brand-bean shadow-neon">
          <h2 className="mb-3 text-xl font-bold text-brand-bean">Промо зона</h2>
          <p className="text-xs text-brand-bean/80">
            Здесь можно разместить рекламу курсов, партнерские предложения или новости спонсоров.
          </p>
          <div className="mt-4 rounded-3xl bg-brand-mint/10 p-4 text-sm font-semibold text-brand-bean">Рекламный баннер</div>
        </div>
        <div className="rounded-[32px] border-2 border-brand-rose bg-white/90 p-5 text-sm text-brand-bean shadow-neon">
          <h2 className="mb-3 text-xl font-bold text-brand-bean">Партнер</h2>
          <p className="text-xs text-brand-bean/80">Оставь место для спонсора, конференции или нового набора в команду.</p>
          <div className="mt-4 rounded-3xl bg-brand-rose/10 p-4 text-sm font-semibold text-brand-bean">Ad баннер</div>
        </div>
      </aside>

      <MobileNav items={navItems} />
    </div>
  );
};

export default Layout;
