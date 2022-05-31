import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePagination from "@mui/material/usePagination";
import { useEffect } from "react";
import styles from "./Pagination.module.scss";

interface PaginationProps {
    currentPage: number;
    totalCount: number;
    onPageChange(pageNumber: number): void;
}

const MyPagination = ({ currentPage, totalCount, onPageChange }: PaginationProps) => {
    const { items: paginationItems } = usePagination({ count: totalCount, page: currentPage });

    useEffect(() => {
        onPageChange(currentPage);
    }, [currentPage]);

    return (
        <ul className={styles.pagination}>
            {paginationItems.map(({ page, type, selected, onClick, ...item }, index) => {
                let children = null;
                if (type === "start-ellipsis" || type === "end-ellipsis") {
                    children = <span className={styles.node}>...</span>;
                } else if (type === "page") {
                    children = (
                        <button
                            type="button"
                            className={`${styles.node} ${selected && styles.selected}`}
                            onClick={(event) => {
                                onPageChange(page);
                                onClick(event);
                            }}
                            {...item}
                        >
                            {page}
                        </button>
                    );
                } else {
                    children = (
                        <button
                            type="button"
                            onClick={(event) => {
                                onPageChange(page);
                                onClick(event);
                            }}
                            {...item}
                            className={styles.node}
                        >
                            <FontAwesomeIcon icon={type === "previous" ? faAnglesLeft : faAnglesRight} />
                        </button>
                    );
                }
                return <li key={index}>{children}</li>;
            })}
        </ul>
    );
};

export { MyPagination };
