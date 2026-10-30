import { useI18n } from "@/lib/i18n";
import InfoBox from "../dashboard/InfoBox";
import Header from "../dashboard/Header";

export default function MustVerifyEmail() {
    const { t } = useI18n()
    return(
        <>
            <main className="app-main">
                <div className="app-content">
                    <div className="container-fluid">
                       <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-8">
                            <InfoBox variant="success" label={(
                                <h2>{t.auth.verifyEmail}</h2>
                            )}>
                            <h4>{t.auth.verifyEmailMessage}</h4>
                        </InfoBox>   
                       </div>
                    </div>
                </div>
            </main>
        </>
    )
}