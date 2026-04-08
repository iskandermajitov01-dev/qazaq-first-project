import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AppContext = createContext(null);

const talentPool = [
  { id: 1, name: "Данияр К.", role: "Coder", city: "Шымкент", skills: ["C++", "Arduino"], experience: "2 года", energy: 95 },
  { id: 2, name: "Алина М.", role: "Designer", city: "Астана", skills: ["Fusion 360", "3D Print"], experience: "1 год", energy: 88 },
  { id: 3, name: "Серик П.", role: "Engineer", city: "Уральск", skills: ["LEGO EV3", "Чертежи"], experience: "3 года", energy: 70 },
  { id: 4, name: "Меруерт С.", role: "Manager", city: "Костанай", skills: ["Pitch", "Planning"], experience: "2 года", energy: 83 },
  { id: 5, name: "Аян Н.", role: "Coder", city: "Тараз", skills: ["Python", "ROS"], experience: "1 год", energy: 78 },
];

const initialTasks = [
  { id: 1, title: "Собрать шасси", role: "Механик", status: "todo", priority: "High" },
  { id: 2, title: "Калибровать датчики", role: "Программист", status: "in-progress", priority: "Medium" },
  { id: 3, title: "Черновик презентации", role: "Капитан", status: "done", priority: "Low" },
];

const initialMentors = [
  { id: 1, name: "Азамат Т.", domain: "Control Systems", slots: 2 },
  { id: 2, name: "Kamila R.", domain: "Mechanical Design", slots: 1 },
  { id: 3, name: "Bekzat A.", domain: "Pitch & Strategy", slots: 3 },
];

const initialProblems = [
  { id: 1, title: "Робот уходит вправо", tags: ["drive", "calibration"], solved: false, votes: 4 },
  { id: 2, title: "Срыв связи Bluetooth", tags: ["connectivity"], solved: true, votes: 2 },
];

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [invites, setInvites] = useState([]);
  const [microTeam, setMicroTeam] = useState([]);
  const [reports, setReports] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [problems, setProblems] = useState(initialProblems);
  const [contribution, setContribution] = useState({});
  
  // Чаты - загружаем из localStorage
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("qazaq-chats");
      return saved ? JSON.parse(saved) : [
        {
          id: "general",
          name: "Общий чат",
          type: "group",
          members: [{ id: 1, name: "Данияр К." }, { id: 2, name: "Алина М." }],
          messages: [
            {
              id: 1,
              sender: "System",
              text: "Добро пожаловать в общий чат!",
              timestamp: new Date().toLocaleTimeString("ru-RU"),
            },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Сохраняем чаты в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("qazaq-chats", JSON.stringify(chats));
  }, [chats]);

  const [events, setEvents] = useState([
    {
      title: "Первое совещание команды",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      description: "Обсуждение стратегии проекта",
      type: "meeting",
    },
  ]);
  const [activityLog, setActivityLog] = useState([
    { id: 1, text: "Система готова к распределенной работе", createdAt: new Date().toLocaleString("ru-RU") },
  ]);

  const addActivity = (text) => {
    setActivityLog((prev) => [
      { id: Date.now() + Math.random(), text, createdAt: new Date().toLocaleString("ru-RU") },
      ...prev,
    ]);
  };

  const addContribution = (person, points) => {
    setContribution((prev) => ({ ...prev, [person]: (prev[person] || 0) + points }));
  };

  const moveTask = (taskId, status) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
    addActivity(`Задача #${taskId} перенесена в ${status}`);
  };

  const inviteCandidate = (candidate) => {
    setInvites((prev) => {
      if (prev.some((item) => item.id === candidate.id)) return prev;
      addActivity(`Приглашен участник: ${candidate.name}`);
      return [...prev, candidate];
    });
  };

  const addReport = (title, link = "") => {
    const item = {
      id: Date.now(),
      title,
      link,
      createdAt: new Date().toLocaleString("ru-RU"),
    };
    setReports((prev) => [item, ...prev]);
    addActivity(`Загружен отчет: ${title}`);
  };

  const addTask = ({ title, role, priority }) => {
    if (!title?.trim()) return;
    const task = {
      id: Date.now(),
      title: title.trim(),
      role: role || "Участник",
      status: "todo",
      priority: priority || "Medium",
    };
    setTasks((prev) => [task, ...prev]);
    addActivity(`Создана задача: ${task.title}`);
  };

  const autoAssembleTeam = () => {
    const pool = invites.length ? invites : talentPool;
    const byRole = (name) => pool.filter((p) => p.role === name).sort((a, b) => b.energy - a.energy)[0];
    const assembled = [byRole("Coder"), byRole("Engineer"), byRole("Designer"), byRole("Manager")].filter(Boolean);
    setMicroTeam(assembled);
    addActivity(`Собрана micro-team из ${assembled.length} участников`);
  };

  const addProblem = (title, tags) => {
    if (!title?.trim()) return;
    const problem = {
      id: Date.now(),
      title: title.trim(),
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      solved: false,
      votes: 0,
    };
    setProblems((prev) => [problem, ...prev]);
    addActivity(`Добавлена проблема в библиотеку: ${problem.title}`);
  };

  const toggleProblemSolved = (id) => {
    setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, solved: !p.solved } : p)));
  };

  const upvoteProblem = (id) => {
    setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p)));
  };

  const requestMentor = (mentor) => {
    setMentorRequests((prev) => {
      if (prev.some((req) => req.id === mentor.id)) return prev;
      addActivity(`Отправлен запрос ментору: ${mentor.name}`);
      return [...prev, mentor];
    });
  };

  const addMessage = (messageData) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === messageData.chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: Date.now(),
                  sender: messageData.sender || "Unknown",
                  text: messageData.text,
                  timestamp: new Date().toLocaleTimeString("ru-RU"),
                },
              ],
            }
          : chat
      )
    );
    addActivity(`Новое сообщение в чате от ${messageData.sender}`);
  };

  const createChat = (chatName, members = []) => {
    const newChat = {
      id: Date.now().toString(),
      name: chatName,
      type: "group",
      members,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats((prev) => [...prev, newChat]);
    addActivity(`Создан новый чат: ${chatName}`);
    return newChat.id;
  };

  const addMemberToChat = (chatId, member) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              members: chat.members.some((m) => m.id === member.id)
                ? chat.members
                : [...chat.members, member],
            }
          : chat
      )
    );
  };

  const addEvent = (eventData) => {
    const event = {
      id: Date.now(),
      ...eventData,
    };
    setEvents((prev) => [...prev, event]);
    addActivity(`Создано событие: ${event.title}`);
  };

  const value = useMemo(
    () => ({
      tasks,
      invites,
      reports,
      talentPool,
      microTeam,
      mentors: initialMentors,
      mentorRequests,
      problems,
      contribution,
      activityLog,
      chats,
      events,
      moveTask,
      inviteCandidate,
      addReport,
      addTask,
      autoAssembleTeam,
      addProblem,
      toggleProblemSolved,
      upvoteProblem,
      requestMentor,
      addContribution,
      addMessage,
      addEvent,
      createChat,
      addMemberToChat,
    }),
    [tasks, invites, reports, microTeam, mentorRequests, problems, contribution, activityLog, chats, events]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
};

