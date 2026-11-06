import { toggleSidebar } from '../../lib/sidebar';
import type { ThemeMode } from '../../lib/adminLTEtheme';
import { LANGS, useI18n, type Lang } from '../../lib/i18n';
import { useApplicationContext } from '@/lib/ApplicationContext';

export type HeaderMessage = {
  id: string | number;
  name: string;
  text: string;
  time: string;
  avatar?: string;
  star?: string;
  href?: string;
};

export type HeaderNotification = {
  id: string | number;
  icon: string;
  text: string;
  time: string;
  href?: string;
};

export type HeaderTheme = {
  id: ThemeMode;
  label: string;
  icon: string;
};

export type HeaderLink = {
  label: string;
  href: string;
};

export type HeaderUser = {
  name: string;
  role: string;
  memberSince: string;
  avatar?: string;
  stats: HeaderLink[];
  profileLink: HeaderLink;
  signOutLink: HeaderLink;
};

export type HeaderProps = {
  navigationLinks?: HeaderLink[];
  messages?: HeaderMessage[];
  messageCount?: number;
  messageFooter?: HeaderLink;
  notifications?: HeaderNotification[];
  notificationCount?: number;
  notificationFooter?: HeaderLink;
  themes?: HeaderTheme[];
  user?: HeaderUser;
  onSearch?: () => void;
  onSelectLanguage?: (language: string) => void;
  onSelectTheme?: (theme: ThemeMode) => void;
};

// Dropdowns below are pure Bootstrap: `data-bs-toggle="dropdown"` + `.dropdown-menu`.
// React only supplies the data that fills them.
export default function Header({
  navigationLinks,
  messages,
  messageCount,
  notifications,
  notificationCount,
  notificationFooter,
  onSearch,
  onSelectLanguage,
}: HeaderProps = {}) {
  const { user, onLogout } = useApplicationContext()
  const { t, setLang } = useI18n();
  const dashboardText = t.dashboard;
  const displayedMessages = messages ?? [];
  const displayedNotifications = notifications ?? [];
  const displayedNavigationLinks = navigationLinks ?? [];
  const displayedLanguages = [...LANGS];
  const displayedMessageCount = messageCount ?? displayedMessages.length;
  const displayedNotificationCount = notificationCount ?? displayedNotifications.length;

  return (
    <nav className="app-header navbar navbar-expand bg-muted">
      <div className="container-fluid">
        {/* Left */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <button type="button" className="nav-link text-white" aria-label={dashboardText.toggleSidebar} onClick={toggleSidebar}>
              <i className="bi bi-list" />
            </button>
          </li>
          {displayedNavigationLinks.map((link) => (
            <li key={link.label} className="nav-item d-none d-md-block">
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button type="button" className="nav-link text-white" aria-label={dashboardText.search} onClick={onSearch}>
              <i className="bi bi-search" />
            </button>
          </li>

          {/* Notifications */}
          <li className="nav-item dropdown">
            <button type="button" className="nav-link text-white" data-bs-toggle="dropdown" aria-label={dashboardText.notifications}>
              <i className="bi bi-bell-fill" />
              <span className="navbar-badge badge text-bg-warning">{displayedNotificationCount}</span>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <span className="dropdown-item dropdown-header">{displayedNotificationCount} {dashboardText.notifications}</span>
              {displayedNotifications.map((n) => (
                <div key={n.id}>
                  <div className="dropdown-divider" />
                  {n.href ? (
                    <a href={n.href} className="dropdown-item">
                      <i className={`bi ${n.icon} me-2`} /> {n.text}
                      <span className="float-end text-secondary fs-7">{n.time}</span>
                    </a>
                  ) : (
                    <div className="dropdown-item">
                      <i className={`bi ${n.icon} me-2`} /> {n.text}
                      <span className="float-end text-secondary fs-7">{n.time}</span>
                    </div>
                  )}
                </div>
              ))}
              <div className="dropdown-divider" />
              {notificationFooter && <a href={notificationFooter.href} className="dropdown-item dropdown-footer">{notificationFooter.label}</a>}
            </div>
          </li>

          {/* Language */}
          <li className="nav-item dropdown">
            <button type="button" className="nav-link text-white" data-bs-toggle="dropdown" aria-label={dashboardText.language}>
              <i className="bi bi-translate" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {displayedLanguages.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      if (onSelectLanguage) {
                        onSelectLanguage(l);
                      } else if (LANGS.includes(l as Lang)) {
                        setLang(l as Lang);
                      }
                    }}
                  >
                    {LANGS.includes(l as Lang) ? l.toUpperCase() : l}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          {user && (
            <li className="nav-item dropdown user-menu">
              <button type="button" className="nav-link text-white dropdown-toggle" data-bs-toggle="dropdown" aria-label={dashboardText.userMenu}>
                {user.avatar ? (
                  <img src={user.avatar} className="user-image rounded-circle shadow" alt={user.name} />
                ) : (
                  <i className="bi bi-person-circle" aria-hidden="true" />
                )}
                <span className="d-none d-md-inline">{user.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <li className="user-header text-bg-primary">
                  {user.avatar ? (
                    <img src={user.avatar} className="rounded-circle shadow" alt={user.name} />
                  ) : (
                    <i className="bi bi-person-circle fs-1" aria-hidden="true" />
                  )}
                  <p>
                    {user.name}
                    <small>{dashboardText.memberSince} {user.memberSince}</small>
                  </p>
                </li>
                <li className="user-body">
                  <div className="row">
                    {user.stats.map((stat) => (
                      <div key={stat.label} className="col-4 text-center"><a href={stat.href}>{stat.label}</a></div>
                    ))}
                  </div>
                </li>
                <li className="user-footer">
                  <button type="button" onClick={user.profileLink.onClick} className="btn btn-outline-secondary">{t.user.user}</button>
                  <button
                    type="button"
                    onClick={() => onLogout()}
                    className="btn btn-outline-secondary float-end"
                  >
                    {t.user.signOut}
                  </button>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
