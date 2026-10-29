import DashboardLayout from "@/components/DashboardLayout";
import type { MenuItem } from "@/components/dashboard/SidebarItem";
import MustVerifyEmail from "@/components/pages/MustVerifyEmail";
import DashboardMain from "@/components/pages/DashboardMain";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
const menu: MenuItem[] = [
  { header: "GENERAL" },
  {
    label: "Dashboard v1",
    href: "#dashboard",
    icon: "bi-speedometer",
    badge: { variant: "primary", text: "New" },
  },
  {
    label: "Components",
    href: "#components",
    icon: "bi-puzzle",
    children: [
      { label: "Buttons", href: "#buttons", icon: "bi-circle" },
      { label: "Cards", href: "#cards", icon: "bi-circle" },
    ],
  },
  { header: "EXAMPLES" },
  {
    label: "Reports",
    href: "#reports",
    icon: "bi-graph-up",
    children: [
      { label: "Sales", href: "#sales", icon: "bi-circle" },
      { label: "Visitors", href: "#visitors", icon: "bi-circle" },
    ],
  },
];

export const DashboardPreview = () => (
  <DashboardLayout title="Panel" menu={menu}>
    <DashboardMain/>
  </DashboardLayout>
);

export const MustVerifyEmailPreview = () => <MustVerifyEmail></MustVerifyEmail>