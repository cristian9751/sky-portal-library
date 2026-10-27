import { toggleSidebar } from '../../lib/sidebar';
import { setTheme, type ThemeMode } from '../../lib/adminLTEtheme';
import type { MouseEvent } from 'react';

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
  languages?: string[];
  themes?: HeaderTheme[];
  user?: HeaderUser;
  onSearch?: () => void;
  onSelectLanguage?: (language: string) => void;
  onSelectTheme?: (theme: ThemeMode) => void;
};

const defaultMessages: HeaderMessage[] = [
  { id: 1, name: 'Brad Diesel', text: 'Call me whenever you can...', time: '4 Hours Ago', star: 'text-danger' },
  { id: 2, name: 'John Pierce', text: 'I got your message bro', time: '4 Hours Ago', star: 'text-secondary' },
  { id: 3, name: 'Nora Silvester', text: 'The subject goes here', time: '4 Hours Ago', star: 'text-warning' },
];

const defaultNotifications: HeaderNotification[] = [
  { id: 1, icon: 'bi-envelope', text: '4 new messages', time: '3 mins' },
  { id: 2, icon: 'bi-people-fill', text: '8 friend requests', time: '12 hours' },
  { id: 3, icon: 'bi-file-earmark-fill', text: '3 new reports', time: '2 days' },
];

const defaultNavigationLinks: HeaderLink[] = [
  { label: 'Home', href: '#' },
  { label: 'Contact', href: '#' },
];

const defaultLanguages = ['English', 'Español', 'Français', 'Deutsch', 'العربية'];

const defaultThemes: HeaderTheme[] = [
  { id: 'light', label: 'Light', icon: 'bi-sun-fill' },
  { id: 'dark', label: 'Dark', icon: 'bi-moon-fill' },
  { id: 'auto', label: 'Auto', icon: 'bi-circle-half' },
];

const defaultUser: HeaderUser = {
  name: 'Alexander Pierce',
  role: 'Web Developer',
  memberSince: 'Nov. 2023',
  stats: [
    { label: 'Followers', href: '#' },
    { label: 'Sales', href: '#' },
    { label: 'Friends', href: '#' },
  ],
  profileLink: { label: 'Profile', href: '#' },
  signOutLink: { label: 'Sign out', href: '#' },
};

function toggleFullscreen(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}

// Dropdowns below are pure Bootstrap: `data-bs-toggle="dropdown"` + `.dropdown-menu`.
// React only supplies the data that fills them.
export default function Header({
  navigationLinks = defaultNavigationLinks,
  messages = defaultMessages,
  messageCount = messages.length,
  messageFooter = { label: 'See All Messages', href: '#' },
  notifications = defaultNotifications,
  notificationCount = notifications.length * 5,
  notificationFooter = { label: 'See All Notifications', href: '#' },
  languages = defaultLanguages,
  themes = defaultThemes,
  user = defaultUser,
  onSearch,
  onSelectLanguage,
  onSelectTheme = setTheme,
}: HeaderProps = {}) {
  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        {/* Left */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="#" role="button" aria-label="Toggle sidebar" onClick={(e) => { e.preventDefault(); toggleSidebar(); }}>
              <i className="bi bi-list" />
            </a>
          </li>
          {navigationLinks.map((link) => (
            <li key={link.label} className="nav-item d-none d-md-block">
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="#" aria-label="Search" onClick={(event) => {
              if (onSearch) {
                event.preventDefault();
                onSearch();
              }
            }}><i className="bi bi-search" /></a>
          </li>

          {/* Messages */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-bs-toggle="dropdown" href="#" aria-label="Messages">
              <i className="bi bi-chat-text" />
              <span className="navbar-badge badge text-bg-danger">{messageCount}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              {messages.map((m) => (
                <div key={m.id}>
                  <a href={m.href ?? '#'} className="dropdown-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        {m.avatar && <img src={m.avatar} alt="User Avatar" className="img-size-50 rounded-circle me-3" />}
                      </div>
                      <div className="flex-grow-1">
                        <h3 className="dropdown-item-title">
                          {m.name}
                          {m.star && <span className={`float-end fs-7 ${m.star}`}><i className="bi bi-star-fill" /></span>}
                        </h3>
                        <p className="fs-7">{m.text}</p>
                        <p className="fs-7 text-secondary">
                          <i className="bi bi-clock-fill me-1" /> {m.time}
                        </p>
                      </div>
                    </div>
                  </a>
                  <div className="dropdown-divider" />
                </div>
              ))}
              <a href={messageFooter.href} className="dropdown-item dropdown-footer">{messageFooter.label}</a>
            </div>
          </li>

          {/* Notifications */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-bs-toggle="dropdown" href="#" aria-label="Notifications">
              <i className="bi bi-bell-fill" />
              <span className="navbar-badge badge text-bg-warning">{notificationCount}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <span className="dropdown-item dropdown-header">{notificationCount} Notifications</span>
              {notifications.map((n) => (
                <div key={n.id}>
                  <div className="dropdown-divider" />
                  <a href={n.href ?? '#'} className="dropdown-item">
                    <i className={`bi ${n.icon} me-2`} /> {n.text}
                    <span className="float-end text-secondary fs-7">{n.time}</span>
                  </a>
                </div>
              ))}
              <div className="dropdown-divider" />
              <a href={notificationFooter.href} className="dropdown-item dropdown-footer">{notificationFooter.label}</a>
            </div>
          </li>

          {/* Language */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-bs-toggle="dropdown" href="#" aria-label="Language">
              <i className="bi bi-translate" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              {languages.map((l) => (
                <li key={l}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(event) => {
                      if (onSelectLanguage) {
                        event.preventDefault();
                        onSelectLanguage(l);
                      }
                    }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </li>

          {/* Fullscreen */}
          <li className="nav-item">
            <a className="nav-link" href="#" aria-label="Toggle fullscreen" onClick={toggleFullscreen}>
              <i className="bi bi-arrows-fullscreen" />
            </a>
          </li>

          {/* Theme */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-bs-toggle="dropdown" href="#" aria-label="Theme">
              <i className="bi bi-circle-half" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              {themes.map((t) => (
                <li key={t.id}>
                  <button type="button" className="dropdown-item" onClick={() => onSelectTheme(t.id)}>
                    <i className={`bi ${t.icon} me-2`} /> {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          {/* User */}
          <li className="nav-item dropdown user-menu">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              {user.avatar && <img src={user.avatar} className="user-image rounded-circle shadow" alt={user.name} />}
              <span className="d-none d-md-inline">{user.name}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <li className="user-header text-bg-primary">
                {user.avatar && <img src={user.avatar} className="rounded-circle shadow" alt={user.name} />}
                <p>
                  {user.name} - {user.role}
                  <small>Member since {user.memberSince}</small>
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
                <a href={user.profileLink.href} className="btn btn-outline-secondary">{user.profileLink.label}</a>
                <a href={user.signOutLink.href} className="btn btn-outline-secondary float-end">{user.signOutLink.label}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
