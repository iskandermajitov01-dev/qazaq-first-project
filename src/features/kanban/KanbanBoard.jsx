import { useMemo, useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const columns = [
  { id: "todo", title: "Нужно сделать", color: "bg-slate-500" },
  { id: "in-progress", title: "В процессе", color: "bg-blue-600" },
  { id: "done", title: "Готово", color: "bg-green-600" },
];

const KanbanBoard = () => {
  const {
    tasks,
    taskLog,
    moveTask,
    addTask,
    addContribution,
    assignTask,
    updateTaskDeadline,
    currentTeamMembers,
    userDirectory,
  } = useAppContext();
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("Программист");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const assigneeOptions = useMemo(() => {
    const source = currentTeamMembers.length ? currentTeamMembers : userDirectory.slice(0, 12);
    return source.map((user) => ({
      id: user.uniqueId,
      name: `${user.firstName} ${user.lastName}`,
    }));
  }, [currentTeamMembers, userDirectory]);

  const handleCreateTask = () => {
    const assignee = assigneeOptions.find((user) => user.id === assigneeId);
    addTask({
      title,
      role,
      priority,
      deadline,
      assigneeId,
      assigneeName: assignee?.name || "",
    });
    setTitle("");
    setDeadline("");
    setAssigneeId("");
  };

  return (
    <div className="space-y-6">
      <section className="cute-card p-5">
        <div className="mb-4">
          <h2 className="text-2xl font-black text-brand-bean">Task System</h2>
          <p className="mt-2 text-sm text-brand-bean/70">Теперь задачи можно назначать на участников, ставить дедлайн и видеть лог движения по работе.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-5">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
            placeholder="Название задачи"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
          >
            <option>Программист</option>
            <option>Инженер</option>
            <option>Дизайнер</option>
            <option>Капитан</option>
            <option>Участник</option>
          </select>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            type="date"
            className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
          />
          <select
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            className="rounded-2xl border-2 border-brand-bean/20 bg-brand-cream px-4 py-3 text-sm text-brand-bean outline-none"
          >
            <option value="">Ответственный</option>
            {assigneeOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleCreateTask} className="cute-btn mt-4 px-5 py-3 text-sm">
          Создать задачу
        </button>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.id} className="rounded-3xl border border-slate-700/40 bg-slate-900/90 p-4">
              <div className="mb-6 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${column.color}`} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">{column.title}</h3>
              </div>

              <div className="space-y-4">
                {tasks.filter((task) => task.status === column.id).map((task) => (
                  <div key={task.id} className="rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-lg">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          task.priority === "High"
                            ? "bg-red-500/20 text-red-400"
                            : task.priority === "Low"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.deadline && <span className="text-[10px] text-slate-400">до {task.deadline}</span>}
                    </div>

                    <h4 className="mb-4 text-sm font-medium leading-tight text-white">{task.title}</h4>

                    <div className="space-y-3">
                      <div className="rounded-xl bg-slate-900/80 px-3 py-2 text-[11px] text-slate-300">
                        <div className="font-semibold text-white">{task.assigneeName || "Ответственный не назначен"}</div>
                        <div className="mt-1">{task.role}</div>
                      </div>

                      <div className="grid gap-2">
                        <select
                          value={task.assigneeId || ""}
                          onChange={(event) => {
                            const selected = assigneeOptions.find((user) => user.id === event.target.value);
                            assignTask(task.id, event.target.value, selected?.name || "");
                          }}
                          className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-[11px] text-slate-200 outline-none"
                        >
                          <option value="">Назначить ответственного</option>
                          {assigneeOptions.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>

                        <input
                          value={task.deadline || ""}
                          onChange={(event) => updateTaskDeadline(task.id, event.target.value)}
                          type="date"
                          className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-[11px] text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-700 pt-3">
                      {column.id !== "todo" && (
                        <button onClick={() => moveTask(task.id, "todo")} className="rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-600">
                          To do
                        </button>
                      )}
                      {column.id !== "in-progress" && (
                        <button
                          onClick={() => {
                            moveTask(task.id, "in-progress");
                            addContribution(task.assigneeName || task.role, 1);
                          }}
                          className="rounded bg-blue-600/80 px-2 py-1 text-[10px] text-white hover:bg-blue-600"
                        >
                          In work
                        </button>
                      )}
                      {column.id !== "done" && (
                        <button
                          onClick={() => {
                            moveTask(task.id, "done");
                            addContribution(task.assigneeName || task.role, 3);
                          }}
                          className="rounded bg-emerald-600/80 px-2 py-1 text-[10px] text-white hover:bg-emerald-600"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="cute-card p-5">
            <h3 className="text-lg font-bold text-brand-bean">Task Log</h3>
            <p className="mt-2 text-sm text-brand-bean/70">Все ключевые действия по задачам попадают в общий лог.</p>
            <div className="mt-4 space-y-3">
              {taskLog.slice(0, 8).map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-brand-bean/10 bg-brand-cream px-4 py-3">
                  <p className="text-sm text-brand-bean">{entry.text}</p>
                  <p className="mt-1 text-[11px] text-brand-bean/60">{entry.createdAt}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="cute-card p-5">
            <h3 className="text-lg font-bold text-brand-bean">Почему это важно</h3>
            <div className="mt-4 space-y-3 text-sm text-brand-bean/75">
              <p>Ответственный и дедлайн убирают хаос в команде.</p>
              <p>Task Log помогает видеть, кто реально двигает работу.</p>
              <p>Contribution Tracking теперь можно привязывать не только к роли, но и к конкретному человеку.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default KanbanBoard;
