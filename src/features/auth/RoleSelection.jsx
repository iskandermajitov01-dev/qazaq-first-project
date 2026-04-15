import { useState } from "react";

const roles = [
  { id: "participant", title: "Участник", icon: "PT", desc: "Работаю над задачами команды и отправляю достижения" },
  { id: "mentor", title: "Наставник", icon: "MT", desc: "Следую за прогрессом команды и помогаю развивать навыки" },
  { id: "verifier", title: "Проверяющий", icon: "VR", desc: "Оцениваю достижения и разрешаю рейтинг" },
  { id: "admin", title: "Админ", icon: "AD", desc: "Управляю платформой и вижу все панели" },
];

const RoleCard = ({ role, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(role.id)}
    className={`rounded-xl border-2 p-4 text-left transition-all ${
      selected === role.id
        ? "border-brand-bean bg-brand-mint/40"
        : "border-brand-bean bg-[#f3e8da] hover:bg-brand-rose/30"
    }`}
  >
    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-bean text-xs font-semibold text-brand-cream">
      {role.icon}
    </div>
    <h3 className="text-sm font-bold text-brand-bean">{role.title}</h3>
    <p className="mt-1 text-xs text-brand-bean/70">{role.desc}</p>
  </button>
);

const RoleSelection = ({ onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState("participant");

  const changeRole = (value) => {
    setSelectedRole(value);
    onConfirm?.(value);
  };

  return (
    <section className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-bean">Роль</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} selected={selectedRole} onSelect={changeRole} />
        ))}
      </div>
    </section>
  );
};

export default RoleSelection;