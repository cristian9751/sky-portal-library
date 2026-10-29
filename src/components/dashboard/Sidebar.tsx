import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { logo } from '@/lib/assets';
import { useI18n } from '@/lib/i18n';
import type { AppLinkProps } from '@/components/SiteLayout';
import SidebarItem from './SidebarItem';
import type { MenuItem } from './SidebarItem';

type SidebarProps = {
  menu: MenuItem[];
  linkComponent?: ComponentType<AppLinkProps>;
};

export default function Sidebar({ menu, linkComponent }: SidebarProps) {
  const { t } = useI18n();
  const [activeLabel, setActiveLabel] = useState(t.dashboard.dashboardV1);

  useEffect(() => {
    setActiveLabel(t.dashboard.dashboardV1);
  }, [t.dashboard.dashboardV1]);

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
                linkComponent={linkComponent}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
