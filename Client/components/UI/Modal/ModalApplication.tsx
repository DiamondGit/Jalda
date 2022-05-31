import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { ApplicationModalType, ApplicationType } from "../../../interfaces";
import { ApproveApplication } from "../../Profile/Modals/Application/ApproveApplication";
import { CancelApplication } from "../../Profile/Modals/Application/CancelApplication";
import { DetailedApplication } from "../../Profile/Modals/Application/DetailedApplication";
import styles from "./Modal.module.scss";

type ModalProps = {
    openState: boolean;
    application: ApplicationType;
    type: ApplicationModalType;
    setModalState: Dispatch<SetStateAction<boolean>>;
    setApplicationModal(modalState: boolean, application: ApplicationType, type: ApplicationModalType): void;
};

const ModalApplication = ({ openState, application, type, setModalState, setApplicationModal }: ModalProps) => {
    return (
        <div className={`${styles.modal} ${styles.bookModal} ${styles[type]} ${openState && styles.acive}`}>
            <div className={styles.modalContainer}>
                <div className={styles.shifter} />
                <div className={styles.container}>
                    {type === "detailModal" ? (
                        <DetailedApplication application={application} setApplicationModal={setApplicationModal} />
                    ) : type === "approveModal" ? (
                        <>
                            <h1 className={styles.title}>Одобрить заявку</h1>
                            <ApproveApplication application={application} setModalState={setModalState} />
                            <FontAwesomeIcon
                                className={styles.closeButton}
                                onClick={() => {
                                    setModalState(false);
                                }}
                                icon={faXmark}
                            />
                        </>
                    ) : (
                        type === "cancelModal" && (
                            <>
                                <h1 className={styles.title}>Отклонить</h1>
                                <CancelApplication application={application} setModalState={setModalState} />
                                <FontAwesomeIcon
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setModalState(false);
                                    }}
                                    icon={faXmark}
                                />
                            </>
                        )
                    )}
                </div>
                <div className={styles.shifter} />
            </div>
            <div
                className={styles.shadow}
                onClick={() => {
                    setModalState(false);
                }}
            />
        </div>
    );
};

export { ModalApplication };
