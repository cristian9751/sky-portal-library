import {DashboardLayout} from "@/components/DashboardLayout";
import MustVerifyEmail from "@/components/pages/MustVerifyEmail";
import {DashboardMain} from "@/components/pages/DashboardMain";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
export const DashboardPreview = () => (
  <DashboardLayout title="Panel">
    <DashboardMain/>
  </DashboardLayout>
);

export const MustVerifyEmailPreview = () => <MustVerifyEmail></MustVerifyEmail>