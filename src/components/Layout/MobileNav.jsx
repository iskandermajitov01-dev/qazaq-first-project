import { NavLink } from "react-router-dom";

const MobileNav = ({ items }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t-2 border-brand-bean bg-brand-cream p-2 md:hidden">
    {items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex flex-col items-center rounded-md px-2 py-1 text-[10px] ${
            isActive ? "text-brand-bean" : "text-brand-bean/60"
          }`
        }
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-bean text-[9px] font-semibold text-brand-cream">
          {item.short}
        </span>
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;