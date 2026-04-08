import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { reports, invites, addReport, microTeam, autoAssembleTeam, activityLog, tasks } = useAppContext();

  const donePct = Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100);

  return (
    <div className="relative space-y-6">
      <section className="cute-card p-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-bean/60">Прогресс проекта</h3>
            <h2 className="mt-1 text-2xl font-black text-brand-bean">Distributed Team Sprint</h2>
          </div>
          <span className="font-mono text-xl font-bold text-brand-bean">{donePct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-brand-bean/20">
          <div className="h-full rounded-full bg-brand-mint" style={{ width: `${donePct}%` }} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-bean">Твоя micro-team</h3>
            <button onClick={autoAssembleTeam} className="cute-btn px-3 py-2 text-xs">
              Dynamic Team Assembly
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {microTeam.map((member) => (
              <div key={member.id} className="cute-card p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-2 rounded-full bg-brand-mint" />
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-bean">{member.name}</h4>
                    <p className="text-xs text-brand-bean/70">
                      {member.role} • {member.city} • Energy {member.energy}%
                    </p>
                  </div>
                  <div className="rounded bg-brand-bean px-2 py-1 text-[10px] text-brand-cream">Ready</div>
                </div>
              </div>
            ))}
            {!microTeam.length && (
              <div className="cute-card col-span-full p-4 text-sm text-brand-bean/70">
                Пока нет собранной команды. Нажми Dynamic Team Assembly.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-brand-bean">Действия</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => addReport("Еженедельный видео-отчет", "https://example.com/report-demo")} className="cute-btn p-4 text-left">
              <p className="text-[10px] font-bold uppercase">Отчет</p>
              <p className="mt-2 text-xs">Video report + feed</p>
            </button>
            <button
              onClick={() => navigate("/learning")}
              className="rounded-xl border-2 border-brand-bean bg-brand-rose p-4 text-left font-semibold text-brand-bean shadow-[0_6px_0_#3a2b24]"
            >
              <p className="text-[10px] font-bold uppercase">AI Brain</p>
              <p className="mt-2 text-xs">Открыть ассистента</p>
            </button>
          </div>

          <div className="cute-card p-4">
            <h4 className="mb-3 text-[10px] font-bold uppercase text-brand-bean/70">Последние обновления</h4>
            <div className="space-y-3">
              {reports.slice(0, 1).map((item) => (
                <div key={item.id} className="border-l-2 border-brand-mint py-1 pl-3 text-xs text-brand-bean">
                  {item.title} - {item.createdAt}
                </div>
              ))}
              <div className="border-l-2 border-brand-rose py-1 pl-3 text-xs text-brand-bean">
                Приглашено участников: <span className="font-semibold">{invites.length}</span>
              </div>
              {activityLog.slice(0, 2).map((log) => (
                <div key={log.id} className="border-l-2 border-brand-bean/40 py-1 pl-3 text-xs text-brand-bean/80">
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;