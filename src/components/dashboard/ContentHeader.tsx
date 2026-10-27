import type { ReactNode } from 'react';

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ContentHeaderProps = {
  title: ReactNode;
  crumbs?: Breadcrumb[];
};

export default function ContentHeader({ title, crumbs = [] }: ContentHeaderProps) {
  return (
    <div className="app-content-header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <h3 className="mb-0">{title}</h3>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">
              {crumbs.map((c) => (
                <li key={c.label} className={`breadcrumb-item${c.href ? '' : ' active'}`} aria-current={c.href ? undefined : 'page'}>
                  {c.href ? <a href={c.href}>{c.label}</a> : c.label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
