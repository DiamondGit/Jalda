import Image from "next/image";
import { StatusType } from "../../../interfaces";
import styles from "./BookStatusBar.module.scss";

interface BookStatusBarProps {
    readonly status: StatusType;
}

const BookStatusBar = ({ status }: BookStatusBarProps) => {
    const activeIcon = "/icons/statusTick/active.svg";
    const inactiveIcon = "/icons/statusTick/inactive.svg";
    const rejectedIcon = "/icons/statusTick/rejected.svg";

    const firstNodeStatus =
        status === StatusType["processing"] ||
        status === StatusType["payment"] ||
        status === StatusType["rejected"] ||
        status === StatusType["completed"];

    const firstEdgeStatus = status === StatusType["payment"] || status === StatusType["rejected"] || status === StatusType["completed"];

    return (
        <div className={styles.mainContainer}>
            <div className={styles.statusNode}>
                <Image src={firstNodeStatus ? activeIcon : inactiveIcon} layout={"fill"} objectFit={"contain"} />
                <span className={styles.statusNodeTitle}>Заявка отправлена</span>
            </div>
            <hr className={`${styles.statusEdge} ${firstEdgeStatus && styles.active}`} />
            {status === StatusType["rejected"] ? (
                <div className={styles.statusNode}>
                    <Image src={rejectedIcon} layout={"fill"} objectFit={"contain"} />
                    <span className={styles.statusNodeTitle}>Заявка отклонена</span>
                </div>
            ) : (
                <>
                    <div className={styles.statusNode}>
                        <Image src={status === StatusType["completed"] ? activeIcon : inactiveIcon} layout={"fill"} objectFit={"contain"} />
                        <span className={styles.statusNodeTitle}>Ожидает оплату</span>
                    </div>
                    <hr className={`${styles.statusEdge} ${status === StatusType["completed"] && styles.active}`} />
                    <div className={styles.statusNode}>
                        <Image src={status === StatusType["completed"] ? activeIcon : inactiveIcon} layout={"fill"} objectFit={"contain"} />
                        <span className={styles.statusNodeTitle}>Завершено</span>
                    </div>
                </>
            )}
        </div>
    );
};

export { BookStatusBar };
