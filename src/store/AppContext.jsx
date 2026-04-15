import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const CITY_CODES = {
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
  "Кызылорда": "KZO",
  "Усть-Каменогорск": "UKK",
  "Петропавловск": "PET",
  "Актау": "AKU",
};

const initialTasks = [
  {
    id: 1,
    title: "Собрать шасси",
    role: "Механик",
    assigneeId: "",
    assigneeName: "Данияр Кабдол",
    deadline: "2026-04-18",
    status: "todo",
    priority: "High",
  },
  {
    id: 2,
    title: "Калибровать датчики",
    role: "Программист",
    assigneeId: "",
    assigneeName: "Алия Серик",
    deadline: "2026-04-16",
    status: "in-progress",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Черновик презентации",
    role: "Капитан",
    assigneeId: "",
    assigneeName: "Нурсултан Ермек",
    deadline: "2026-04-15",
    status: "done",
    priority: "Low",
  },
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

const initialTryoutChallenges = [
  {
    id: "tryout-1",
    title: "Autonomous Sprint",
    category: "Programming",
    difficulty: "Hard",
    deadline: "2026-04-20",
    description: "Собери и опиши автономный режим робота с логикой принятия решений и контрольными метриками.",
    points: 40,
  },
  {
    id: "tryout-2",
    title: "Pit Strategy Deck",
    category: "Strategy",
    difficulty: "Medium",
    deadline: "2026-04-18",
    description: "Подготовь короткую стратегию сезона: роли, риски, KPI и формат подготовки к защите.",
    points: 25,
  },
  {
    id: "tryout-3",
    title: "Rapid Prototype",
    category: "Engineering",
    difficulty: "Hard",
    deadline: "2026-04-22",
    description: "Предложи механику узла, опиши материалы, сроки сборки и потенциальные точки отказа.",
    points: 35,
  },
];

const demoUsers = [
  {
    firstName: "Алия",
    lastName: "Серик",
    email: "aliya.serik.demo@qfh.kz",
    phone: "+7 700 110 2201",
    age: "16",
    city: "Алматы",
    team: "",
    position: "Программист",
    skills: ["Python", "OpenCV", "Git"],
    projects: ["Line Follower", "Vision Bot"],
    level: "Соревнования",
    reputation: "Лидер",
    progress: 86,
    completedTasks: 19,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "3 года",
    github: "aliya-serik",
    bio: "Собирает автономные режимы и любит сложные задачи по computer vision.",
    contributionPoints: 42,
  },
  {
    firstName: "Нурсултан",
    lastName: "Ермек",
    email: "nursultan.ermek.demo@qfh.kz",
    phone: "+7 700 110 2202",
    age: "17",
    city: "Астана",
    team: "",
    position: "Капитан",
    skills: ["Planning", "Pitch", "GitHub"],
    projects: ["Strategy Deck", "Season Planning"],
    level: "Соревнования",
    reputation: "Лидер",
    progress: 91,
    completedTasks: 24,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "3 года",
    github: "nermek-teamlead",
    bio: "Сильный организатор и хорошо собирает команду под дедлайны.",
    contributionPoints: 38,
  },
  {
    firstName: "Данияр",
    lastName: "Кабдол",
    email: "daniyar.kabdol.demo@qfh.kz",
    phone: "+7 700 110 2203",
    age: "16",
    city: "Шымкент",
    team: "",
    position: "Инженер",
    skills: ["CAD", "Fusion 360", "3D Print"],
    projects: ["Manipulator Arm", "Drive Base"],
    level: "Участие",
    reputation: "Активист",
    progress: 72,
    completedTasks: 15,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "2 года",
    github: "daniyar-cad",
    bio: "Быстро делает корпусные решения и прототипы.",
    contributionPoints: 29,
  },
  {
    firstName: "Малика",
    lastName: "Жунус",
    email: "malika.zhunus.demo@qfh.kz",
    phone: "+7 700 110 2204",
    age: "15",
    city: "Караганда",
    team: "",
    position: "Дизайнер",
    skills: ["Figma", "Presentation", "Branding"],
    projects: ["Pit Design", "Team Deck"],
    level: "Участие",
    reputation: "Активист",
    progress: 67,
    completedTasks: 13,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "2 года",
    github: "malika-designs",
    bio: "Упаковывает проекты в понятные и сильные презентации.",
    contributionPoints: 24,
  },
  {
    firstName: "Тимур",
    lastName: "Алибек",
    email: "timur.alibek.demo@qfh.kz",
    phone: "+7 700 110 2205",
    age: "17",
    city: "Атырау",
    team: "",
    position: "Программист",
    skills: ["Java", "WPILib", "Sensors"],
    projects: ["Auto Balance", "Telemetry"],
    level: "Соревнования",
    reputation: "Лидер",
    progress: 88,
    completedTasks: 22,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "4 года",
    github: "timur-wpi",
    bio: "Любит чистую архитектуру и телеметрию для роботов.",
    contributionPoints: 41,
  },
  {
    firstName: "Айару",
    lastName: "Тлеу",
    email: "aiaru.tleu.demo@qfh.kz",
    phone: "+7 700 110 2206",
    age: "16",
    city: "Актобе",
    team: "",
    position: "Инженер",
    skills: ["Electronics", "Soldering", "Sensors"],
    projects: ["Control Board", "Sensor Rack"],
    level: "Участие",
    reputation: "Активист",
    progress: 64,
    completedTasks: 11,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "2 года",
    github: "aiaru-electro",
    bio: "Сильна в электронике и аккуратной сборке.",
    contributionPoints: 21,
  },
  {
    firstName: "Ерасыл",
    lastName: "Нуртаев",
    email: "erassyl.nurtaev.demo@qfh.kz",
    phone: "+7 700 110 2207",
    age: "17",
    city: "Уральск",
    team: "",
    position: "Капитан",
    skills: ["Strategy", "Mentoring", "Task Breakdown"],
    projects: ["Sprint Board", "Practice Camp"],
    level: "Соревнования",
    reputation: "Лидер",
    progress: 84,
    completedTasks: 20,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "3 года",
    github: "erassyl-sprints",
    bio: "Умеет раскладывать хаос на понятные спринты.",
    contributionPoints: 35,
  },
  {
    firstName: "Сания",
    lastName: "Абдрахман",
    email: "saniya.abdr.demo@qfh.kz",
    phone: "+7 700 110 2208",
    age: "15",
    city: "Костанай",
    team: "",
    position: "Дизайнер",
    skills: ["Canva", "Social Media", "Storytelling"],
    projects: ["Media Kit", "Outreach Story"],
    level: "Основы",
    reputation: "Новичок",
    progress: 51,
    completedTasks: 8,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "1 год",
    github: "saniya-media",
    bio: "Отвечает за подачу команды и community-направление.",
    contributionPoints: 14,
  },
  {
    firstName: "Бекзат",
    lastName: "Касен",
    email: "bekzat.kasen.demo@qfh.kz",
    phone: "+7 700 110 2209",
    age: "16",
    city: "Павлодар",
    team: "",
    position: "Программист",
    skills: ["C++", "Arduino", "Debugging"],
    projects: ["Sensor Hub", "Control Loop"],
    level: "Участие",
    reputation: "Активист",
    progress: 70,
    completedTasks: 14,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "2 года",
    github: "bekzat-embedded",
    bio: "Сильный отладчик, вытаскивает железо из трудных состояний.",
    contributionPoints: 27,
  },
  {
    firstName: "Аружан",
    lastName: "Сатыбалды",
    email: "aruzhan.satybaldy.demo@qfh.kz",
    phone: "+7 700 110 2210",
    age: "16",
    city: "Тараз",
    team: "",
    position: "Инженер",
    skills: ["Mechanics", "Assembly", "Maintenance"],
    projects: ["Drive Train", "Repair Bench"],
    level: "Основы",
    reputation: "Новичок",
    progress: 48,
    completedTasks: 7,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "1 год",
    github: "aruzhan-builds",
    bio: "Быстро растет в механике и не боится практической работы.",
    contributionPoints: 12,
  },
  {
    firstName: "Рамазан",
    lastName: "Оспан",
    email: "ramazan.ospan.demo@qfh.kz",
    phone: "+7 700 110 2211",
    age: "17",
    city: "Кокшетау",
    team: "",
    position: "Капитан",
    skills: ["Public Speaking", "Team Ops", "Recruiting"],
    projects: ["Tryout Day", "Sponsor Pitch"],
    level: "Участие",
    reputation: "Активист",
    progress: 69,
    completedTasks: 12,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "2 года",
    github: "ramazan-ops",
    bio: "Сильный в отборе новичков и распределении ролей.",
    contributionPoints: 20,
  },
  {
    firstName: "Жанель",
    lastName: "Мурат",
    email: "zhanel.murat.demo@qfh.kz",
    phone: "+7 700 110 2212",
    age: "15",
    city: "Семей",
    team: "",
    position: "Дизайнер",
    skills: ["Illustrator", "3D Mockup", "UI"],
    projects: ["Robot Identity", "Scouting UI"],
    level: "Участие",
    reputation: "Активист",
    progress: 62,
    completedTasks: 10,
    role: "participant",
    password: "demo",
    verified: true,
    experience: "2 года",
    github: "zhanel-ux",
    bio: "Собирает понятные интерфейсы и визуально сильные материалы.",
    contributionPoints: 18,
  },
];

const defaultChat = [
  {
    id: "general",
    name: "Общий чат",
    type: "group",
    members: [{ id: 1, name: "Алия Серик" }, { id: 2, name: "Нурсултан Ермек" }],
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

const normalizeListField = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const getDisplayName = (profile) => {
  const firstName = profile?.firstName?.trim() || "";
  const lastName = profile?.lastName?.trim() || "";
  return `${firstName} ${lastName}`.trim() || profile?.name || profile?.email || "Участник";
};

const getRoleWeight = (position = "") => {
  const normalized = position.toLowerCase();
  if (normalized.includes("програм")) return 1.25;
  if (normalized.includes("инжен")) return 1.2;
  if (normalized.includes("дизайн")) return 1.1;
  if (normalized.includes("капитан")) return 1.15;
  return 1;
};

const computeMemberScore = (profile) => {
  const skills = normalizeListField(profile.skills).length;
  const projects = normalizeListField(profile.projects).length;
  const progress = Number(profile.progress) || 0;
  const completedTasks = Number(profile.completedTasks) || 0;
  const contributionPoints = Number(profile.contributionPoints) || 0;
  return Math.round((skills * 8 + projects * 6 + progress * 0.5 + completedTasks * 2 + contributionPoints) * getRoleWeight(profile.position));
};

const createUniqueId = (city, existingIds) => {
  const cityCode = CITY_CODES[city] || "KZ";
  let uniqueId = "";
  do {
    uniqueId = `QFH-${cityCode}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existingIds.has(uniqueId));
  existingIds.add(uniqueId);
  return uniqueId;
};

const withIdentity = (user, existingIds) => {
  const uniqueId = user.uniqueId || createUniqueId(user.city, existingIds);
  return {
    achievements: user.achievements || [],
    contributionPoints: Number(user.contributionPoints) || 0,
    completedTasks: Number(user.completedTasks) || 0,
    createdAt: user.createdAt || new Date().toISOString(),
    github: user.github || "",
    progress: Number(user.progress) || 0,
    teamId: user.teamId || "",
    teamRole: user.teamRole || user.position || "",
    verified: user.verified ?? true,
    ...user,
    uniqueId,
    name: getDisplayName({ ...user, uniqueId }),
  };
};

const seedUsers = (storedUsers) => {
  const existingIds = new Set(storedUsers.map((user) => user.uniqueId).filter(Boolean));
  const byEmail = new Map(storedUsers.map((user) => [String(user.email).toLowerCase(), withIdentity(user, existingIds)]));
  demoUsers.forEach((user) => {
    const emailKey = String(user.email).toLowerCase();
    if (!byEmail.has(emailKey)) {
      byEmail.set(emailKey, withIdentity(user, existingIds));
    }
  });
  return Array.from(byEmail.values());
};

const loadUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("qazaq-users") || "[]");
    const users = Array.isArray(parsed) ? seedUsers(parsed) : seedUsers([]);
    localStorage.setItem("qazaq-users", JSON.stringify(users));
    return users;
  } catch {
    const users = seedUsers([]);
    localStorage.setItem("qazaq-users", JSON.stringify(users));
    return users;
  }
};

const loadTeams = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("qazaq-teams") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [invites, setInvites] = useState([]);
  const [microTeam, setMicroTeam] = useState([]);
  const [reports, setReports] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [problems, setProblems] = useState(initialProblems);
  const [contribution, setContribution] = useState({});
  const [users, setUsers] = useState(loadUsers);
  const [teams, setTeams] = useState(loadTeams);
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("qazaq-chats");
      return saved ? JSON.parse(saved) : defaultChat;
    } catch {
      return defaultChat;
    }
  });
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
  const [tryoutChallenges] = useState(initialTryoutChallenges);
  const [tryoutEntries, setTryoutEntries] = useState([
    {
      id: "entry-1",
      challengeId: "tryout-1",
      userId: "QFH-ALA-8234",
      userName: "Алия Серик",
      city: "Алматы",
      status: "reviewed",
      score: 36,
      summary: "Сильная автономка с понятной логикой сенсоров и fallback-сценариями.",
      submittedAt: "2026-04-13",
      reviewerNote: "Хорошая инженерная зрелость, можно брать в основной состав.",
    },
    {
      id: "entry-2",
      challengeId: "tryout-2",
      userId: "QFH-AST-7911",
      userName: "Нурсултан Ермек",
      city: "Астана",
      status: "reviewed",
      score: 23,
      summary: "Четко разложена командная структура и подготовка к защите проекта.",
      submittedAt: "2026-04-12",
      reviewerNote: "Отличный лидерский материал.",
    },
    {
      id: "entry-3",
      challengeId: "tryout-3",
      userId: "QFH-SHY-4567",
      userName: "Данияр Кабдол",
      city: "Шымкент",
      status: "pending",
      score: 0,
      summary: "Предложен быстрый прототип захвата с модульной заменой деталей.",
      submittedAt: "2026-04-14",
      reviewerNote: "",
    },
  ]);
  const [taskLog, setTaskLog] = useState([
    {
      id: 1,
      taskId: 2,
      text: "Задача взята в работу",
      createdAt: new Date().toLocaleString("ru-RU"),
    },
  ]);

  const currentUserEmail = localStorage.getItem("qazaq-email") || "";
  const currentStoredProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("qazaq-profile") || "{}");
    } catch {
      return {};
    }
  })();

  const currentUserProfile = useMemo(() => {
    const fromUsers = users.find((user) => String(user.email).toLowerCase() === String(currentUserEmail).toLowerCase());
    return fromUsers || currentStoredProfile || {};
  }, [currentStoredProfile, currentUserEmail, users]);

  useEffect(() => {
    localStorage.setItem("qazaq-chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("qazaq-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("qazaq-teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    if (currentUserProfile && Object.keys(currentUserProfile).length) {
      localStorage.setItem("qazaq-profile", JSON.stringify(currentUserProfile));
      localStorage.setItem("qazaq-current-user", JSON.stringify(currentUserProfile));
    }
  }, [currentUserProfile]);

  const addActivity = (text) => {
    setActivityLog((prev) => [
      { id: Date.now() + Math.random(), text, createdAt: new Date().toLocaleString("ru-RU") },
      ...prev,
    ]);
  };

  const addTaskLogEntry = (taskId, text) => {
    setTaskLog((prev) => [
      { id: Date.now() + Math.random(), taskId, text, createdAt: new Date().toLocaleString("ru-RU") },
      ...prev,
    ]);
  };

  const submitTryoutEntry = ({ challengeId, summary }) => {
    if (!currentUserProfile?.uniqueId || !summary?.trim()) return { ok: false };

    const existing = tryoutEntries.find(
      (entry) => entry.challengeId === challengeId && entry.userId === currentUserProfile.uniqueId
    );

    const nextEntry = {
      id: existing?.id || `entry-${Date.now()}`,
      challengeId,
      userId: currentUserProfile.uniqueId,
      userName: currentUserProfile.name || getDisplayName(currentUserProfile),
      city: currentUserProfile.city || "Казахстан",
      status: "pending",
      score: existing?.score || 0,
      summary: summary.trim(),
      submittedAt: new Date().toISOString().split("T")[0],
      reviewerNote: existing?.reviewerNote || "",
    };

    setTryoutEntries((prev) => {
      const cleaned = prev.filter((entry) => !(entry.challengeId === challengeId && entry.userId === currentUserProfile.uniqueId));
      return [nextEntry, ...cleaned];
    });
    addActivity(`Отправлена tryout-заявка: ${challengeId}`);
    return { ok: true, entry: nextEntry };
  };

  const reviewTryoutEntry = (entryId, score, reviewerNote = "") => {
    let reviewedEntry = null;
    setTryoutEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        reviewedEntry = {
          ...entry,
          status: "reviewed",
          score: Number(score) || 0,
          reviewerNote,
        };
        return reviewedEntry;
      })
    );
    if (reviewedEntry) {
      addActivity(`Tryout-заявка проверена: ${reviewedEntry.userName}`);
      addContribution(reviewedEntry.userName, Math.max(1, Math.round((Number(score) || 0) / 10)));
    }
  };

  const syncUserRecord = (profile) => {
    if (!profile?.email) return;
    setUsers((prev) => {
      const existingIds = new Set(prev.map((user) => user.uniqueId).filter(Boolean));
      const normalized = withIdentity(
        {
          ...prev.find((item) => String(item.email).toLowerCase() === String(profile.email).toLowerCase()),
          ...profile,
        },
        existingIds
      );
      return [
        ...prev.filter((item) => String(item.email).toLowerCase() !== String(profile.email).toLowerCase()),
        normalized,
      ];
    });
  };

  const updateProfile = (profileData) => {
    const normalized = {
      ...currentUserProfile,
      ...profileData,
      skills: normalizeListField(profileData.skills ?? currentUserProfile.skills),
      projects: normalizeListField(profileData.projects ?? currentUserProfile.projects),
      progress: Number(profileData.progress ?? currentUserProfile.progress) || 0,
      completedTasks: Number(profileData.completedTasks ?? currentUserProfile.completedTasks) || 0,
      achievements: profileData.achievements || currentUserProfile.achievements || [],
    };
    syncUserRecord(normalized);
  };

  const addAchievement = (title, points) => {
    const newAchievement = {
      id: Date.now(),
      title,
      points: Number(points) || 10,
      status: "pending",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    const updatedAchievements = [...(currentUserProfile.achievements || []), newAchievement];
    updateProfile({ achievements: updatedAchievements });
    addActivity(`Добавлено достижение: ${title}`);
  };

  const updateAchievementStatus = (achievementId, status, reason = "") => {
    const updatedAchievements = (currentUserProfile.achievements || []).map((achievement) => {
      if (achievement.id !== achievementId) return achievement;
      const updated = { ...achievement, status };
      if (status === "verified") updated.verifiedAt = new Date().toISOString().split("T")[0];
      if (status === "rejected") {
        updated.rejectedAt = new Date().toISOString().split("T")[0];
        updated.reason = reason;
      }
      return updated;
    });
    updateProfile({ achievements: updatedAchievements });
    addActivity(`Статус достижения обновлен: ${status}`);
  };

  const addContribution = (person, points) => {
    const label =
      typeof person === "string"
        ? person
        : person?.uniqueId || person?.assigneeId || person?.assigneeName || person?.name || person?.position || "Участник";
    setContribution((prev) => ({ ...prev, [label]: (prev[label] || 0) + points }));
  };

  const moveTask = (taskId, status) => {
    const task = tasks.find((item) => item.id === taskId);
    setTasks((prev) => prev.map((item) => (item.id === taskId ? { ...item, status } : item)));
    addActivity(`Задача #${taskId} перенесена в ${status}`);
    addTaskLogEntry(taskId, `${task?.title || "Задача"} переведена в статус ${status}`);
  };

  const inviteCandidate = (candidate) => {
    setInvites((prev) => {
      if (prev.some((item) => item.uniqueId === candidate.uniqueId)) return prev;
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

  const addTask = ({ title, role, priority, deadline = "", assigneeId = "", assigneeName = "" }) => {
    if (!title?.trim()) return;
    const task = {
      id: Date.now(),
      title: title.trim(),
      role: role || "Участник",
      assigneeId,
      assigneeName,
      deadline,
      status: "todo",
      priority: priority || "Medium",
    };
    setTasks((prev) => [task, ...prev]);
    addActivity(`Создана задача: ${task.title}`);
    addTaskLogEntry(task.id, `Создана задача ${task.title}`);
  };

  const assignTask = (taskId, assigneeId, assigneeName) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assigneeId,
              assigneeName,
            }
          : task
      )
    );
    addActivity(`Назначен ответственный для задачи #${taskId}: ${assigneeName || "не указан"}`);
    addTaskLogEntry(taskId, `Назначен ответственный: ${assigneeName || "не указан"}`);
  };

  const updateTaskDeadline = (taskId, deadline) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, deadline } : task)));
    addActivity(`Обновлен дедлайн задачи #${taskId}`);
    addTaskLogEntry(taskId, `Установлен дедлайн: ${deadline || "не указан"}`);
  };

  const autoAssembleTeam = () => {
    const pool = (invites.length ? invites : users)
      .filter((user) => user.role === "participant")
      .sort((a, b) => computeMemberScore(b) - computeMemberScore(a));
    const targetRoles = ["Программист", "Инженер", "Дизайнер", "Капитан"];
    const picked = [];
    const usedIds = new Set();

    targetRoles.forEach((role) => {
      const member = pool.find(
        (user) => !usedIds.has(user.uniqueId) && String(user.position).toLowerCase().includes(role.toLowerCase())
      );
      if (member) {
        picked.push(member);
        usedIds.add(member.uniqueId);
      }
    });

    pool.forEach((user) => {
      if (picked.length >= 5 || usedIds.has(user.uniqueId)) return;
      picked.push(user);
      usedIds.add(user.uniqueId);
    });

    setMicroTeam(picked);
    addActivity(`Собрана smart-team из ${picked.length} участников`);
    return picked;
  };

  const addProblem = (title, tags) => {
    if (!title?.trim()) return;
    const problem = {
      id: Date.now(),
      title: title.trim(),
      tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      solved: false,
      votes: 0,
    };
    setProblems((prev) => [problem, ...prev]);
    addActivity(`Добавлена проблема в библиотеку: ${problem.title}`);
  };

  const toggleProblemSolved = (id) => {
    setProblems((prev) => prev.map((problem) => (problem.id === id ? { ...problem, solved: !problem.solved } : problem)));
  };

  const upvoteProblem = (id) => {
    setProblems((prev) => prev.map((problem) => (problem.id === id ? { ...problem, votes: problem.votes + 1 } : problem)));
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
              members: chat.members.some((item) => item.id === member.id) ? chat.members : [...chat.members, member],
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

  const createTeam = (teamName) => {
    const normalizedName = teamName.trim();
    if (!normalizedName || !currentUserProfile?.uniqueId) return { ok: false, reason: "invalid" };
    const duplicate = teams.find((team) => team.name.toLowerCase() === normalizedName.toLowerCase());
    if (duplicate) return { ok: false, reason: "duplicate" };

    const newTeam = {
      id: `team-${Date.now()}`,
      name: normalizedName,
      city: currentUserProfile.city || "Казахстан",
      createdBy: currentUserProfile.uniqueId,
      captainId: currentUserProfile.uniqueId,
      memberIds: [currentUserProfile.uniqueId],
      createdAt: new Date().toISOString(),
    };

    setTeams((prev) => [newTeam, ...prev]);
    updateProfile({ team: normalizedName, teamId: newTeam.id, teamRole: "Капитан", position: currentUserProfile.position || "Капитан" });
    addActivity(`Создана команда: ${normalizedName}`);
    return { ok: true, team: newTeam };
  };

  const addUserToTeamById = (uniqueId, teamId = currentUserProfile.teamId) => {
    const normalizedId = uniqueId.trim().toUpperCase();
    const targetTeam = teams.find((team) => team.id === teamId);
    if (!normalizedId || !targetTeam) return { ok: false, reason: "team-not-found" };

    const candidate = users.find((user) => String(user.uniqueId).toUpperCase() === normalizedId);
    if (!candidate) return { ok: false, reason: "user-not-found" };
    if (candidate.teamId && candidate.teamId !== teamId) return { ok: false, reason: "already-in-team" };
    if (targetTeam.memberIds.includes(candidate.uniqueId)) return { ok: false, reason: "duplicate-member" };

    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              memberIds: [...team.memberIds, candidate.uniqueId],
            }
          : team
      )
    );
    syncUserRecord({ ...candidate, team: targetTeam.name, teamId: targetTeam.id, teamRole: candidate.teamRole || candidate.position });
    addActivity(`В команду ${targetTeam.name} добавлен ${candidate.name}`);
    return { ok: true, candidate };
  };

  const buildSuggestedTeam = () => {
    const suggestion = autoAssembleTeam();
    return suggestion.map((member, index) => ({
      ...member,
      slot: ["Core Coder", "Mechanical Lead", "Design Lead", "Captain", "Flex"][index] || "Flex",
    }));
  };

  const participantUsers = useMemo(
    () =>
      users
        .filter((user) => user.role === "participant")
        .map((user) => ({
          ...user,
          energy: Math.min(100, 55 + normalizeListField(user.skills).length * 8 + Math.round((Number(user.progress) || 0) * 0.2)),
          score: computeMemberScore(user),
        }))
        .sort((a, b) => b.score - a.score),
    [users]
  );

  const leaderboard = useMemo(
    () =>
      participantUsers
        .map((user, index) => ({
          ...user,
          rank: index + 1,
          points:
            (Number(user.contributionPoints) || 0) +
            (Number(user.completedTasks) || 0) * 4 +
            (Number(user.progress) || 0) +
            (user.achievements || [])
              .filter((achievement) => achievement.status === "verified")
              .reduce((sum, achievement) => sum + (achievement.points || 0), 0),
        }))
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({ ...user, rank: index + 1 })),
    [participantUsers]
  );

  const tryoutLeaderboard = useMemo(() => {
    const aggregated = new Map();

    tryoutEntries.forEach((entry) => {
      const challenge = tryoutChallenges.find((item) => item.id === entry.challengeId);
      const base = aggregated.get(entry.userId) || {
        userId: entry.userId,
        userName: entry.userName,
        city: entry.city,
        totalScore: 0,
        submissions: 0,
        reviewed: 0,
        pending: 0,
        maxPoints: 0,
      };

      base.submissions += 1;
      base.maxPoints += challenge?.points || 0;
      if (entry.status === "reviewed") {
        base.reviewed += 1;
        base.totalScore += Number(entry.score) || 0;
      } else {
        base.pending += 1;
      }

      aggregated.set(entry.userId, base);
    });

    return Array.from(aggregated.values())
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        scorePct: user.maxPoints ? Math.round((user.totalScore / user.maxPoints) * 100) : 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [tryoutChallenges, tryoutEntries]);

const currentTeam = useMemo(
    () => teams.find((team) => team.id === currentUserProfile.teamId) || null,
    [currentUserProfile.teamId, teams]
  );

  const shadowTeam = useMemo(() => {
    const activeIds = new Set((currentTeam?.memberIds || []).filter(Boolean));
    return tryoutLeaderboard
      .filter((entry) => !activeIds.has(entry.userId))
      .slice(0, 5)
      .map((entry, index) => {
        const matchedUser = participantUsers.find((user) => user.uniqueId === entry.userId);
        return {
          ...entry,
          position: matchedUser?.position || "Участник",
          github: matchedUser?.github || "",
          skills: matchedUser?.skills || [],
          slot: ["Reserve Captain", "Reserve Coder", "Reserve Engineer", "Reserve Designer", "Reserve Flex"][index] || "Reserve Flex",
        };
      });
  }, [currentTeam?.memberIds, participantUsers, tryoutLeaderboard]);

  const currentTeamMembers = useMemo(() => {
    if (!currentTeam) return [];
    return currentTeam.memberIds
      .map((memberId) => participantUsers.find((user) => user.uniqueId === memberId))
      .filter(Boolean);
  }, [currentTeam, participantUsers]);

  const directoryStats = useMemo(() => {
    const cityCount = new Set(participantUsers.map((user) => user.city).filter(Boolean)).size;
    const assignedCount = participantUsers.filter((user) => user.teamId).length;
    return {
      totalParticipants: participantUsers.length,
      totalCities: cityCount,
      inTeams: assignedCount,
      freeAgents: participantUsers.length - assignedCount,
    };
  }, [participantUsers]);

  const talentScore = useMemo(() => computeMemberScore(currentUserProfile), [currentUserProfile]);

  const value = useMemo(
    () => ({
      tasks,
      invites,
      reports,
      talentPool: participantUsers,
      userDirectory: participantUsers,
      teams,
      currentTeam,
      currentTeamMembers,
      microTeam,
      mentors: initialMentors,
      mentorRequests,
      problems,
      contribution,
      activityLog,
      chats,
      events,
      currentUserProfile,
      talentScore,
      directoryStats,
      leaderboard,
      tryoutChallenges,
      tryoutEntries,
      tryoutLeaderboard,
      shadowTeam,
      taskLog,
      moveTask,
      inviteCandidate,
      addReport,
      addTask,
      assignTask,
      updateTaskDeadline,
      submitTryoutEntry,
      reviewTryoutEntry,
      autoAssembleTeam,
      buildSuggestedTeam,
      addProblem,
      toggleProblemSolved,
      upvoteProblem,
      requestMentor,
      addContribution,
      addMessage,
      addEvent,
      createChat,
      addMemberToChat,
      updateProfile,
      addAchievement,
      updateAchievementStatus,
      createTeam,
      addUserToTeamById,
    }),
    [
      activityLog,
      chats,
      contribution,
      currentTeam,
      currentTeamMembers,
      currentUserProfile,
      directoryStats,
      events,
      invites,
      leaderboard,
      shadowTeam,
      mentorRequests,
      microTeam,
      participantUsers,
      problems,
      reports,
      talentScore,
      taskLog,
      tasks,
      teams,
      tryoutEntries,
      tryoutLeaderboard,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
};
