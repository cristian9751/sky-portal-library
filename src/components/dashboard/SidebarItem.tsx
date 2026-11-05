import { useState } from 'react';
import type { ComponentType } from 'react';
import type { AppLinkProps } from '@/components/SiteLayout';

export type MenuItem =
  | {
      header: string;
    }
  | {
      label: string;
      href?: string;
      icon: string;
      badge?: {
        variant: string;
        text: string;
      };
      children?: MenuItem[];
    };

type SidebarItemProps = {
  item: MenuItem;
  activeLabel: string;
  onSelect: (label: string) => void;
  linkComponent?: ComponentType<AppLinkProps>;
};

// One recursive component covers headers, leaf links and treeviews of any depth.
// Open/closed is React state because AdminLTE's treeview JS can't see React-rendered nodes;
// the markup and class names (`menu-open`, `nav-treeview`) are exactly AdminLTE's.
export default function SidebarItem({ item, activeLabel, onSelect, linkComponent: Link }: SidebarItemProps) {
  const [open, setOpen] = useState(false);

  if ('header' in item) {
    return <li className="nav-header">{item.header}</li>;
  }

  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const isActive = activeLabel === item.label;

  const handleParentClick = () => {
    setOpen((o) => !o);
  };

  const linkProps: AppLinkProps | undefined = item.href ? {
    to: item.href,
    className: `nav-link${isActive ? ' active' : ''}`,
    onClick: () => onSelect(item.label),
  } : undefined;
  const itemClassName = `nav-link${isActive ? ' active' : ''}`;
  const linkContent = (
    <>
      <i className={`nav-icon bi ${item.icon}`} />
      <p>
        {item.label}
        {item.badge && (
          <span className={`nav-badge badge text-bg-${item.badge.variant} me-3`}>{item.badge.text}</span>
        )}
        {hasChildren && <i className="nav-arrow bi bi-chevron-right" />}
      </p>
    </>
  );

  return (
    <li className={`nav-item${open ? ' menu-open' : ''}`}>
      {hasChildren ? (
        <button type="button" className={itemClassName} aria-expanded={open} onClick={handleParentClick}>
          {linkContent}
        </button>
      ) : linkProps && Link ? (
        <Link {...linkProps}>{linkContent}</Link>
      ) : linkProps ? (
        <a href={linkProps.to} className={linkProps.className} onClick={linkProps.onClick}>
          {linkContent}
        </a>
      ) : (
        <span className={itemClassName}>{linkContent}</span>
      )}
      {hasChildren && (
        <ul className="nav nav-treeview">
          {children.map((child) => (
            <SidebarItem
              key={'header' in child ? child.header : child.label}
              item={child}
              activeLabel={activeLabel}
              onSelect={onSelect}
              linkComponent={Link}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
