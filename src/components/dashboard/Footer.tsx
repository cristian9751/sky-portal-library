import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="app-footer">
      <div className="float-end d-none d-sm-inline">{t.dashboard.anythingYouWant}</div>
      <strong>
        Copyright &copy; 2014-{new Date().getFullYear()}&nbsp;
        <a href="https://adminlte.io" className="text-decoration-none">AdminLTE.io</a>.
      </strong>
      &nbsp;{t.footer}
    </footer>
  );
}
