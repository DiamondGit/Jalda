import { ReactNode } from "react";
import styles from "./SectionContainer.module.scss";

interface SectionContainerProps {
    title?: string;
    children: ReactNode;
    left?: boolean;
    id?: string;
}

const SectionContainer = ({ title, children, left, id }: SectionContainerProps) => {
    return (
        <div className={styles.sectionContainer} id={id}>
            {title && <h1 className={`${styles.sectionTitle} ${left && styles.left}`}>{title}</h1>}
            {children}
        </div>
    );
};

export { SectionContainer };
