import React from "react";

/**
 * Props for Pagination component
 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * Reusable Pagination Component
 * Used across admin & user tables
 */
export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                      }) => {
    // Do not render pagination if only one page exists
    if (totalPages <= 1) return null;

    // Create array of page numbers
    const pages: number[] = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    return (
        <div className="flex justify-center mt-6 gap-2">
            {/* PREVIOUS BUTTON */}
            <button
                className="btn btn-sm btn-outline"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                « Prev
            </button>

            {/* PAGE NUMBERS */}
            {pages.map((page) => (
                <button
                    key={page}
                    className={`btn btn-sm ${
                        page === currentPage
                            ? "btn-primary"
                            : "btn-outline"
                    }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/* NEXT BUTTON */}
            <button
                className="btn btn-sm btn-outline"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next »
            </button>
        </div>
    );
};
