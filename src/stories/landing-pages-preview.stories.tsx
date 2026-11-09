import { About } from "@/components/pages/about";
import { Contact } from "@/components/pages/contact";
import { Index } from "@/components/pages/index";
import { Members } from "@/components/pages/members";
import { Normative } from "@/components/pages/normative";
import { Staff } from "@/components/pages/staff";
import { MembersData } from "@/data/members";
import { rules } from "@/data/rules";
import type { StaffAttributes } from "@/components/pages/staff";

const staffMembers: StaffAttributes[] = [
  {
    flag: "ES",
    name: "Alex García",
    position: "Chief Executive Officer",
    email: "alex@example.com",
  },
  {
    flag: "FR",
    name: "Camille Martin",
    position: "Training Manager",
    email: "camille@example.com",
  },
];

export const contactPreview = () => <Contact />;
export const indexPreview = () => <Index />;
export const membersPreview = () => <Members members={MembersData} />;
export const NormativePreview = () => <Normative rules={rules} />;
export const AboutPreview = () => (
  <About redirectToRegister={() => window.alert("Registration preview")} />
);
export const StaffPreview = () => <Staff Staff={staffMembers} />;
