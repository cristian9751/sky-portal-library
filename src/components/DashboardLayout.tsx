import type { ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import type { MenuItem } from "@/components/dashboard/SidebarItem";
import ContentHeader, { type Breadcrumb } from "@/components/dashboard/ContentHeader";
import Footer from "@/components/dashboard/Footer";
import { closeSidebar } from "@/lib/sidebar";
import 'admin-lte/dist/css/adminlte.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
type DashboardLayoutProps = {
  title: ReactNode;
  crumbs?: Breadcrumb[];
  children: ReactNode;
  menu: MenuItem[];
};

export default function DashboardLayout({ title, crumbs = [], children, menu }: DashboardLayoutProps) {
  return (
    <div className="app-wrapper">
      <Header />
      <Sidebar menu={menu} />
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