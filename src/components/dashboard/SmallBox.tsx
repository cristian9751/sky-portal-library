import type { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';

type SmallBoxProps = {
  value: ReactNode;
  label: ReactNode;
  icon: string;
  variant?: string;
  href?: string;
};

export default function SmallBox({ value, label, icon, variant = 'primary', href = '#' }: SmallBoxProps) {
  const { t } = useI18n();

  return (
    <div className={`small-box text-bg-${variant}`}>
      <div className="inner">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
      <i className={`bi ${icon} small-box-icon`} aria-hidden="true" />
      <a
        href={href}
        className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
      >
        {t.dashboard.moreInfo} <i className="bi bi-link-45deg" />
      </a>
    </div>
  );
}
