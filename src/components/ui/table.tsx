import * as React from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type AdministrationTableRow = {
  id: string;
  cells: React.ReactNode[];
  actions: React.ReactNode;
  editContent?: React.ReactNode;
};

type AdministrationTableProps = {
  headers: React.ReactNode[];
  rows: AdministrationTableRow[];
};

function getCellText(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(getCellText).join(" ");
  if (React.isValidElement<{ children?: React.ReactNode }>(value)) {
    return getCellText(value.props.children);
  }
  return "";
}

export function AdministrationTable({ headers, rows }: AdministrationTableProps) {
  const { t } = useI18n();
  const pageSizeId = React.useId();
  const searchId = React.useId();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState("");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredRows = normalizedQuery
    ? rows.filter((row) =>
        row.cells.some((cell) => getCellText(cell).toLocaleLowerCase().includes(normalizedQuery)),
      )
    : rows;
  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));
  const visibleRows = filteredRows.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage,
  );
  const visiblePages = Array.from(
    new Set([0, currentPage - 1, currentPage, currentPage + 1, pageCount - 1])
      .values(),
  )
    .filter((pageIndex) => pageIndex >= 0 && pageIndex < pageCount)
    .sort((left, right) => left - right);

  React.useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [currentPage, page]);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0" htmlFor={searchId}>
            {t.dashboard.admin.search}
          </label>
          <input
            id={searchId}
            type="search"
            className="form-control form-control-sm"
            placeholder={t.dashboard.admin.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0" htmlFor={pageSizeId}>
            {t.dashboard.admin.rowsPerPage}
          </label>
          <select
            id={pageSizeId}
            className="form-select form-select-sm w-auto"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <tr key={row.id}>
                  {row.editContent !== undefined ? (
                    <td colSpan={headers.length}>{row.editContent}</td>
                  ) : (
                    <>
                      {row.cells.map((cell, index) => (
                        <td key={index}>{cell}</td>
                      ))}
                      <td>{row.actions}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center">
                  {t.dashboard.admin.noSearchResults}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <nav aria-label={t.dashboard.admin.pagination}>
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item${currentPage === 0 ? " disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                aria-label={t.dashboard.admin.previousPage}
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                {t.dashboard.admin.previousPage}
              </button>
            </li>
            {visiblePages.map((pageIndex, index) => {
              const previousPage = visiblePages[index - 1];
              return (
                <React.Fragment key={pageIndex}>
                  {previousPage !== undefined && pageIndex - previousPage > 1 && (
                    <li className="page-item disabled" aria-hidden="true">
                      <span className="page-link">…</span>
                    </li>
                  )}
                  <li className={`page-item${pageIndex === currentPage ? " active" : ""}`}>
                    <button
                      type="button"
                      className="page-link"
                      aria-label={`${t.dashboard.admin.page} ${pageIndex + 1}`}
                      aria-current={pageIndex === currentPage ? "page" : undefined}
                      onClick={() => setPage(pageIndex)}
                    >
                      {pageIndex + 1}
                    </button>
                  </li>
                </React.Fragment>
              );
            })}
            <li className={`page-item${currentPage === pageCount - 1 ? " disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                aria-label={t.dashboard.admin.nextPage}
                disabled={currentPage === pageCount - 1}
                onClick={() => setPage(currentPage + 1)}
              >
                {t.dashboard.admin.nextPage}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
