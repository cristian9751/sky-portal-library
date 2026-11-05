
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Field, authField } from "@/components/AuthShell";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import { useState, type FormEvent } from "react";

type UserProfileProps = {
    handleUpdateProfile: (data: FormData) => Promise<void>;
    handleChangePassword: (data: FormData) => Promise<void>;
};

export default function UserProfile({ handleUpdateProfile, handleChangePassword }: UserProfileProps) {
    const { t } = useI18n();
    const { user } = useApplicationContext();
    console.log(user);
    const [passwordError, setPasswordError] = useState("");
    const [passwordUpdated, setPasswordUpdated] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

    const onPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setPasswordError("");
        setPasswordUpdated(false);
        setIsSubmittingPassword(true);
        try {
            await handleChangePassword(new FormData(form));
            form.reset();
            setPasswordUpdated(true);
        } catch (error) {
            setPasswordError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    return (
        <>
            <RegisterForm user={user} submitButtonLabel={t.user.profileSave} handleRegistration={handleUpdateProfile} />
            <form onSubmit={onPasswordSubmit} className="mt-8 space-y-6 rounded-xl border border-border bg-card p-8">
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    {t.user.changePassword}
                </h2>
                <Field label={t.user.currentPassword}>
                    <input name="oldPassword" type="password" required autoComplete="current-password" className={authField} />
                </Field>
                <Field label={t.user.newPassword}>
                    <input name="newPassword" type="password" required autoComplete="new-password" className={authField} />
                </Field>
                {passwordError && <p role="alert" className="text-sm text-destructive">{passwordError}</p>}
                {passwordUpdated && <p role="status" className="text-sm text-primary">{t.user.passwordChangeSuccess}</p>}
                <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                    {isSubmittingPassword ? t.user.passwordChangeSaving : t.user.passwordChangeSave}
                </button>
            </form>
        </>
    );
}