
import { RegisterForm } from "@/components/forms/RegisterForm";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
export default function UserProfile({handleUpdateProfile}: {handleUpdateProfile: (data: FormData) => Promise<void>}) {
    const { t } = useI18n();
    const { user } = useApplicationContext();
    console.log(user);
    return <RegisterForm user={user} submitButtonLabel={t.user.profileSave} handleRegistration={handleUpdateProfile}/>

}