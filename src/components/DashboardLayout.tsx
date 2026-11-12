import type { ComponentType, ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import type { MenuItem } from "@/components/dashboard/SidebarItem";
import ContentHeader, { type Breadcrumb } from "@/components/dashboard/ContentHeader";
import Footer from "@/components/dashboard/Footer";
import { closeSidebar } from "@/lib/sidebar";
import type { AppLinkProps } from "@/components/SiteLayout";
import { useI18n } from "@/lib/i18n";
import { useApplicationContext } from "@/lib/ApplicationContext";
import {
  ADMINISTRATION_PERMISSIONS,
  ADMINISTRATION_ROUTES,
  hasAnyPermission,
  hasPermission,
} from "@/lib/administration-permissions";

type DashboardLayoutProps = {
  title: ReactNode;
  crumbs?: Breadcrumb[];
  children: ReactNode;
  menu?: MenuItem[];
  /** Optional router adapter; defaults to a standard anchor link. */
  linkComponent?: ComponentType<AppLinkProps>;
};

export function DashboardLayout({
  title,
  crumbs = [],
  children,
  menu: customMenu,
  linkComponent,
}: DashboardLayoutProps) {
  const { t } = useI18n();
  const { user } = useApplicationContext();
  const permissions = user?.permissions;
  const administrationItems: MenuItem[] = [];

  if (
    hasAnyPermission(
      permissions,
      ADMINISTRATION_PERMISSIONS.airlineCreate,
      ADMINISTRATION_PERMISSIONS.airlineDelete,
      ADMINISTRATION_PERMISSIONS.airlineEdit,
    )
  ) {
    administrationItems.push({
      label: t.dashboard.admin.airlines,
      href: ADMINISTRATION_ROUTES.airlines,
      icon: "bi-building",
    });
  }

  if (
    hasAnyPermission(
      permissions,
      ADMINISTRATION_PERMISSIONS.aircraftBuy,
      ADMINISTRATION_PERMISSIONS.aircraftEdit,
      ADMINISTRATION_PERMISSIONS.aircraftSell,
    )
  ) {
    administrationItems.push({
      label: t.dashboard.admin.aircrafts,
      href: ADMINISTRATION_ROUTES.aircrafts,
      icon: "bi-airplane",
    });
  }

  if(hasAnyPermission(
    permissions,
    ADMINISTRATION_PERMISSIONS.routeCreate,
    ADMINISTRATION_PERMISSIONS.routeDelete,
    ADMINISTRATION_PERMISSIONS.routeEdit,
  )) {
    administrationItems.push({
      label: t.dashboard.admin.routes,
      href: ADMINISTRATION_ROUTES.routes,
      icon: "bi-ticket"
    })
  }

  if (hasPermission(permissions, ADMINISTRATION_PERMISSIONS.userPermissionsEdit, "*")) {
    administrationItems.push({
      label: t.dashboard.admin.users,
      href: ADMINISTRATION_ROUTES.users,
      icon: "bi-people",
    });
    administrationItems.push({
      label: t.dashboard.admin.roles,
      href: ADMINISTRATION_ROUTES.roles,
      icon: "bi-shield-lock",
    });
  }

  const defaultMenu: MenuItem[] = [
    { header: t.dashboard.general },
    { label: t.nav.home, href: "/dashboard/index", icon: "bi-house-fill" },
    ...(administrationItems.length > 0
      ? [
          { header: t.dashboard.admin.title.toUpperCase() },
          {
            label: t.dashboard.admin.title,
            icon: "bi-gear-fill",
            children: administrationItems,
          },
        ]
      : []),
  ];
  const menu = customMenu ?? defaultMenu;

  return (
    <div className="app-wrapper">
      <Header />
      <Sidebar menu={menu} linkComponent={linkComponent} />
      <div className="sidebar-overlay" onClick={closeSidebar} />

      <main className="app-main">
        <ContentHeader title={title} crumbs={crumbs} />
        <div className="app-content">
          <div className="container-fluid">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
