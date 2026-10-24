import { Contact } from "@/components/pages/contact";
import { Index } from "@/components/pages/index";
import { Members } from "@/components/pages/members"
import { Normative } from "@/components/pages/normative";
import { MembersData } from "@/data/members";
import { rules } from "@/data/rules"
export const contactPreview = () => (
    <Contact></Contact>
)
export const indexPreview = () => <Index/>
export const membersPreview = () => <Members members={MembersData}/>
export const NormativePreview = () => <Normative rules={rules}/>
