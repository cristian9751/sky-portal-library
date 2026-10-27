import { useState } from 'react';
import { logo } from '@/lib/assets';
import SidebarItem from './SidebarItem';
import type { MenuItem } from './SidebarItem';

type SidebarProps = {
  menu: MenuItem[];
};

export default function Sidebar({ menu }: SidebarProps) {
  const [activeLabel, setActiveLabel] = useState('Dashboard v1');

  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div className="sidebar-brand">
        <a href="#" className="brand-link">
          <img src={logo} alt="AdminLTE Logo" className="brand-image opacity-75 shadow" />
          <span className="brand-text fw-light">AdminLTE 4</span>
        </a>
      </div>

      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul className="nav sidebar-menu flex-column" role="menu">
            {menu.map((item: MenuItem) => (
              <SidebarItem
                key={'header' in item ? item.header : item.label}
                item={item}
                activeLabel={activeLabel}
                onSelect={setActiveLabel}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
