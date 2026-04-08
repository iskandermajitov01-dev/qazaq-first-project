import { useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const courses = [
  { title: "Основы Arduino", duration: "12 уроков", level: "Начальный", progress: 100 },
  { title: "Протоколы связи (I2C/SPI)", duration: "5 уроков", level: "Продвинутый", progress: 25 },
  { title: "3D Моделирование", duration: "8 уроков", level: "Средний", progress: 0 },
];

const Lessons = () => {
  const { problems, addProblem, upvoteProblem, toggleProblemSolved } = useAppContext();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((course, idx) => (
          <div key={idx} className="cute-card cursor-pointer p-5 transition">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-brand-bean">{course.title}</h4>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-bean/70">
                  {course.duration} • {course.level}
                </p>
              </div>
              <div className="rounded-md bg-brand-bean px-2 py-1 text-[10px] font-semibold text-brand-cream">LMS</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-brand-bean/70">
                <span>ПРОГРЕСС</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-bean/20">
                <div className="h-full bg-brand-mint transition-all duration-1000" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cute-card p-4">
        <h3 className="text-sm font-bold text-brand-bean">Problem Library</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая проблема" className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags через запятую" className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm" />
          <button
            onClick={() => {
              addProblem(title, tags);
              setTitle("");
              setTags("");
            }}
            className="cute-btn px-3 py-2 text-sm"
          >
            Добавить в базу
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {problems.map((problem) => (
            <div key={problem.id} className="rounded-lg border-2 border-brand-bean bg-[#f3e8da] p-3 text-sm">
              <p className="font-semibold text-brand-bean">{problem.title}</p>
              <p className="mt-1 text-xs text-brand-bean/70">{problem.tags.join(", ") || "no tags"}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => upvoteProblem(problem.id)} className="rounded bg-brand-bean px-2 py-1 text-xs text-brand-cream">
                  Vote {problem.votes}
                </button>
                <button onClick={() => toggleProblemSolved(problem.id)} className="rounded bg-brand-rose px-2 py-1 text-xs text-brand-bean">
                  {problem.solved ? "Solved" : "Mark solved"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;