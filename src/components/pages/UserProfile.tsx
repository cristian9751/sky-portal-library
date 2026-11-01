
import { RegisterForm } from "@/components/forms/RegisterForm";
import { useI18n } from "@/lib/i18n";
export default function UserProfile({handleUpdateProfile}: {handleUpdateProfile: (data: FormData) => Promise<void>}) {
    const { t } = useI18n();
    return <RegisterForm showRedirectToLogin={false} submitButtonLabel={t.user.profileSave} handleRegistration={handleUpdateProfile}/>

}