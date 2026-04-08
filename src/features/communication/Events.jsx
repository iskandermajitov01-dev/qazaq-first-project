import { useState } from "react";
import { useAppContext } from "../../store/AppContext.jsx";

const Events = () => {
  const { events = [], addEvent } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    type: "meeting",
  });

  const handleAddEvent = () => {
    if (!eventData.title || !eventData.date) return;
    addEvent?.(eventData);
    setEventData({ title: "", date: "", time: "", description: "", type: "meeting" });
    setShowForm(false);
  };

  const upcomingEvents = events
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 10);

  const getEventIcon = (type) => {
    const icons = {
      meeting: "👥",
      deadline: "⏰",
      presentation: "🎤",
      workshop: "🛠️",
      competition: "🏆",
    };
    return icons[type] || "📅";
  };

  return (
    <div className="space-y-6">
      {/* Кнопка добавления события */}
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-black text-brand-bean">📅 Предстоящие события</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="cute-btn px-4 py-2 text-xs"
        >
          {showForm ? "Отмена" : "+ Событие"}
        </button>
      </div>

      {/* Форма добавления события */}
      {showForm && (
        <div className="cute-card p-6">
          <h3 className="font-bold text-brand-bean mb-4">Создать событие</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-brand-bean/70 uppercase mb-1 block">
                Название
              </label>
              <input
                value={eventData.title}
                onChange={(e) =>
                  setEventData({ ...eventData, title: e.target.value })
                }
                className="w-full rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm"
                placeholder="Название события"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-brand-bean/70 uppercase mb-1 block">
                  Дата
                </label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) =>
                    setEventData({ ...eventData, date: e.target.value })
                  }
                  className="w-full rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-bean/70 uppercase mb-1 block">
                  Время
                </label>
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) =>
                    setEventData({ ...eventData, time: e.target.value })
                  }
                  className="w-full rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-bean/70 uppercase mb-1 block">
                Тип события
              </label>
              <select
                value={eventData.type}
                onChange={(e) =>
                  setEventData({ ...eventData, type: e.target.value })
                }
                className="w-full rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm"
              >
                <option value="meeting">👥 Встреча</option>
                <option value="deadline">⏰ Дедлайн</option>
                <option value="presentation">🎤 Презентация</option>
                <option value="workshop">🛠️ Воркшоп</option>
                <option value="competition">🏆 Соревнование</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-bean/70 uppercase mb-1 block">
                Описание
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) =>
                  setEventData({ ...eventData, description: e.target.value })
                }
                className="w-full rounded-lg border-2 border-brand-bean bg-[#f3e8da] px-3 py-2 text-sm h-20"
                placeholder="Опишите событие..."
              />
            </div>

            <button
              onClick={handleAddEvent}
              className="cute-btn w-full py-2 text-sm"
            >
              Создать событие
            </button>
          </div>
        </div>
      )}

      {/* Список событий */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingEvents.length === 0 ? (
          <div className="cute-card col-span-full p-6 text-center text-brand-bean/50">
            Нет событий. Добавьте первое!
          </div>
        ) : (
          upcomingEvents.map((event, idx) => (
            <div key={idx} className="cute-card p-4 hover:shadow-lg transition">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-bean">{event.title}</h3>
                  <p className="text-xs text-brand-bean/70 mt-1">
                    📅 {event.date} {event.time && `⏰ ${event.time}`}
                  </p>
                  {event.description && (
                    <p className="text-sm text-brand-bean/80 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
