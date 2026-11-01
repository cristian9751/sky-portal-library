import {DashboardLayout} from "@/components/DashboardLayout";
import MustVerifyEmail from "@/components/pages/MustVerifyEmail";
import {DashboardMain} from "@/components/pages/DashboardMain";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { DashboardUserEdit } from "@/components/pages/DashboardUserEdit";
export const DashboardPreview = () => (
  <DashboardLayout title="Panel">
    <DashboardMain/>
  </DashboardLayout>
);

export const MustVerifyEmailPreview = () => <MustVerifyEmail></MustVerifyEmail>
export const DashboardEditProfilePreview = () => (
  <DashboardUserEdit onSubmit={() => Promise.resolve()} />
);