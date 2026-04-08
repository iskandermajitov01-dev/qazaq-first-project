import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const TalentFinder = () => {
  const [filter, setFilter] = useState("All");
  const { inviteCandidate, invites, talentPool, autoAssembleTeam } = useAppContext();
  const filteredUsers = useMemo(
    () => talentPool.filter((user) => filter === "All" || user.role === filter),
    [filter]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-bean">Поиск талантов</h2>
          <p className="text-sm text-brand-bean/70">Найди недостающее звено для своей команды</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border-2 border-brand-bean bg-[#f3e8da] p-1">
          {["All", "Coder", "Engineer", "Designer"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === tab ? "bg-brand-mint text-brand-bean shadow-md" : "text-brand-bean/70 hover:text-brand-bean"
              }`}
            >
              {tab}
            </button>
          ))}
          </div>
          <button onClick={autoAssembleTeam} className="cute-btn px-3 py-2 text-xs">
            Matchmake
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="cute-card group relative overflow-hidden p-6 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-xs font-semibold shadow-inner">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Energy</div>
                <div className="font-mono text-sm font-bold text-brand-bean">{user.energy}%</div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-brand-bean">{user.name}</h3>
            <p className="mb-4 text-xs font-semibold text-brand-bean/80">{user.role} • {user.city}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {user.skills.map((skill) => (
                <span key={skill} className="rounded border-2 border-brand-bean bg-[#f3e8da] px-2 py-1 text-[10px] text-brand-bean">
                  {skill}
                </span>
              ))}
            </div>

            <button onClick={() => inviteCandidate(user)} className="cute-btn w-full py-3 text-xs">
              Invite
            </button>
          </div>
        ))}
      </div>

      <div className="cute-card p-4">
        <p className="text-xs leading-relaxed text-brand-bean/80">
          Приглашено кандидатов в команду: <strong className="text-brand-bean">{invites.length}</strong>
        </p>
      </div>
    </div>
  );
};

export default TalentFinder;