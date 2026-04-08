import { useState } from "react";

const roles = [
  { id: "coder", title: "Программист", icon: "CD", desc: "Пишу алгоритмы и логику робота" },
  { id: "engineer", title: "Механик", icon: "EN", desc: "Проектирую и собираю детали" },
  { id: "manager", title: "Капитан", icon: "PM", desc: "Управляю проектом и презентацией" },
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
  const [selectedRole, setSelectedRole] = useState("coder");

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