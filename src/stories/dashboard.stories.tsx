import {DashboardLayout} from "@/components/DashboardLayout";
import MustVerifyEmail from "@/components/pages/MustVerifyEmail";
import {DashboardMain} from "@/components/pages/DashboardMain";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import DashboardProfile from "@/components/pages/DashboardProfile";
import { Staff } from "@/components/pages/staff";
export const DashboardPreview = () => (
  <DashboardLayout title="Panel">
    <DashboardMain/>
  </DashboardLayout>
);

export const MustVerifyEmailPreview = () => <MustVerifyEmail></MustVerifyEmail>
export const UserProfilePreview = () => <DashboardProfile handleUpdateProfile={async (data: FormData) => {}} handleChangePassword={async (data: FormData) => {}}></DashboardProfile>