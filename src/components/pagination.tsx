import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
  onPageChange?: (page: number) => void;
  ariaLabel?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  getPageHref,
  onPageChange,
  ariaLabel = "Pagination",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={`pagination-nav ${className}`.trim()}
    >
      {currentPage > 1 ? (
        <Link
          href={getPageHref(currentPage - 1)}
          onClick={(e) => {
            if (onPageChange) {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }
          }}
          rel="prev"
          aria-label="Previous page"
          className="pagination-btn can-hover"
        >
          <ArrowLeft
            className="pagination-arrow-left size-4 shrink-0"
            aria-hidden
          />
          Prev
        </Link>
      ) : (
        <span className="pagination-btn is-disabled">
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Prev
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
        const isCurrent = pageNumber === currentPage;
        return (
          <Link
            key={pageNumber}
            href={getPageHref(pageNumber)}
            onClick={(e) => {
              if (onPageChange) {
                e.preventDefault();
                onPageChange(pageNumber);
              }
            }}
            aria-label={`Page ${pageNumber}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`pagination-btn ${
              isCurrent ? "is-active" : "can-hover"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={getPageHref(currentPage + 1)}
          onClick={(e) => {
            if (onPageChange) {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }
          }}
          rel="next"
          aria-label="Next page"
          className="pagination-btn can-hover"
        >
          Next
          <ArrowRight
            className="pagination-arrow-right size-4 shrink-0"
            aria-hidden
          />
        </Link>
      ) : (
        <span className="pagination-btn is-disabled">
          Next
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </span>
      )}
    </nav>
  );
}
