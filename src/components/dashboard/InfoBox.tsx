import { ReactNode } from "react"

type InfoBoxProps = {
    variant?: string
    icon?: string
    label?: ReactNode
    children: ReactNode

}

export default function InfoBox({variant, icon, label, children} : InfoBoxProps) {
    return (
    <div className={`info-box bg-${variant}`}>
        {icon && (
                <span className="info-box-icon">
                    <i className={`bi ${icon} info-box-icon`}></i>
                </span>
            )}

            <div className="info-box-content p-10">
                {label && (
                    label
                )}

                <div className="info-box-more">{children}</div>
            </div>
        </div>
    )
}