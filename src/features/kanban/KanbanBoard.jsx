import { useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const KanbanBoard = () => {
  const { tasks, moveTask, addTask, addContribution } = useAppContext();
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("Программист");
  const [priority, setPriority] = useState("Medium");

  const columns = [
    { id: "todo", title: "Нужно сделать", color: "bg-slate-500" },
    { id: "in-progress", title: "В процессе", color: "bg-blue-600" },
    { id: "done", title: "Готово", color: "bg-green-600" },
  ];

  return (
    <div className="space-y-4">
      <div className="cute-card p-4">
        <h3 className="mb-3 text-sm font-bold text-brand-bean">Создать задачу</h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm"
            placeholder="Название задачи"
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm">
            <option>Программист</option>
            <option>Механик</option>
            <option>Капитан</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            className="cute-btn px-3 py-2 text-sm"
            onClick={() => {
              addTask({ title, role, priority });
              setTitle("");
            }}
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.id} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 flex flex-col h-[70vh]">
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">{column.title}</h3>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {tasks.filter((t) => t.status === column.id).map((task) => (
                <div key={task.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-blue-500/50 transition-all shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        task.priority === "High" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-slate-500">⋮⋮</span>
                  </div>

                  <h4 className="text-white text-sm font-medium mb-4 leading-tight">{task.title}</h4>

                  <div className="flex justify-between items-center border-t border-slate-700 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                        {task.role[0]}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{task.role}</span>
                    </div>
                    <div className="flex gap-1">
                      {column.id !== "todo" && (
                        <button onClick={() => moveTask(task.id, "todo")} className="rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-600">
                          To do
                        </button>
                      )}
                      {column.id !== "in-progress" && (
                        <button
                          onClick={() => {
                            moveTask(task.id, "in-progress");
                            addContribution(task.role, 1);
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
                            addContribution(task.role, 3);
                          }}
                          className="rounded bg-emerald-600/80 px-2 py-1 text-[10px] text-white hover:bg-emerald-600"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;