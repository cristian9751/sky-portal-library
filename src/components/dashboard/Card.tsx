import { useId } from 'react';
import type { ReactNode } from 'react';

// Collapse/remove behaviour comes from Bootstrap's collapse plugin via data attributes,
// not from AdminLTE's card-widget JS and not from React state.
type CardProps = {
  title: ReactNode;
  variant?: string;
  collapsible?: boolean;
  tools?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function Card({ title, variant, collapsible = true, tools, footer, children, className = '' }: CardProps) {
  const bodyId = useId().replace(/:/g, '');

  return (
    <div className={`card mb-4${variant ? ` card-${variant}` : ''} ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-tools">
          {tools}
          {collapsible && (
            <button
              type="button"
              className="btn btn-tool"
              data-bs-toggle="collapse"
              data-bs-target={`#${bodyId}`}
              aria-expanded="true"
              aria-controls={bodyId}
              aria-label="Collapse"
            >
              <i className="bi bi-dash-lg" />
            </button>
          )}
        </div>
      </div>
      <div id={bodyId} className="collapse show">
        <div className="card-body">{children}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </div>
  );
}
