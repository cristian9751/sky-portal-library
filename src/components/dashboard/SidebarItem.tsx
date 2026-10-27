import { useState } from 'react';
import type { MouseEvent } from 'react';

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
};

// One recursive component covers headers, leaf links and treeviews of any depth.
// Open/closed is React state because AdminLTE's treeview JS can't see React-rendered nodes;
// the markup and class names (`menu-open`, `nav-treeview`) are exactly AdminLTE's.
export default function SidebarItem({ item, activeLabel, onSelect }: SidebarItemProps) {
  const [open, setOpen] = useState(false);

  if ('header' in item) {
    return <li className="nav-header">{item.header}</li>;
  }

  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const isActive = activeLabel === item.label;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (hasChildren) setOpen((o) => !o);
    else onSelect(item.label);
  };

  return (
    <li className={`nav-item${open ? ' menu-open' : ''}`}>
      <a href={item.href ?? '#'} className={`nav-link${isActive ? ' active' : ''}`} onClick={handleClick}>
        <i className={`nav-icon bi ${item.icon}`} />
        <p>
          {item.label}
          {item.badge && (
            <span className={`nav-badge badge text-bg-${item.badge.variant} me-3`}>{item.badge.text}</span>
          )}
          {hasChildren && <i className="nav-arrow bi bi-chevron-right" />}
        </p>
      </a>
      {hasChildren && (
        <ul className="nav nav-treeview">
          {children.map((child) => (
            <SidebarItem
              key={'header' in child ? child.header : child.label}
              item={child}
              activeLabel={activeLabel}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
