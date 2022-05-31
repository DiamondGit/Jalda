import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./Modal.module.scss";

type ModalProps = {
    title?: string;
    form?: boolean;
    openState: boolean;
    children: ReactNode;
    toggler: Dispatch<SetStateAction<boolean>>;
    maxContent?: boolean;
    sidePadding?: number;
};

const Modal = ({ title = null, form = false, openState, children, toggler, maxContent = false, sidePadding = 70 }: ModalProps) => {
    const closeModal = () => {
        toggler(false);
    };

    return (
        <div className={`${styles.modal} ${openState && styles.acive}`}>
            <div className={`${styles.modalContainer} ${maxContent && styles.maxContent}`}>
                <div className={styles.shifter} />
                <div className={styles.container}>
                    {title && <h1 className={styles.title}>{title}</h1>}
                    <div className={styles.wrapper} style={{ paddingLeft: sidePadding, paddingRight: sidePadding }}>
                        <div className={`${styles.body} ${form && styles.form}`}>{children}</div>
                    </div>
                    <FontAwesomeIcon className={styles.closeButton} onClick={closeModal} icon={faXmark} />
                </div>
                <div className={styles.shifter} />
            </div>
            <div className={styles.shadow} onClick={closeModal} />
        </div>
    );
};

export { Modal };
