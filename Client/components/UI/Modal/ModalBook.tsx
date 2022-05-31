import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { BookType, ModalType } from "../../../interfaces";
import { CancelBook } from "../../Profile/Modals/Book/CancelBook";
import { DetailedBook } from "../../Profile/Modals/Book/DetailedBook";
import { PaymentBook } from "../../Profile/Modals/Book/PaymentBook";
import { ReviewBook } from "../../Profile/Modals/Book/ReviewBook";
import styles from "./Modal.module.scss";

type ModalProps = {
    openState: boolean;
    book: BookType;
    type: ModalType;
    setModalState: Dispatch<SetStateAction<boolean>>;
    setBookModal(modalState: boolean, book: BookType, type: ModalType): void;
};

const ModalBook = ({ openState, book, type, setModalState, setBookModal }: ModalProps) => {
    return (
        <div className={`${styles.modal} ${styles.bookModal} ${styles[type]} ${openState && styles.acive}`}>
            <div className={styles.modalContainer}>
                <div className={styles.shifter} />
                <div className={styles.container}>
                    {type === "detailModal" ? (
                        <DetailedBook book={book} setBookModal={setBookModal} />
                    ) : type === "reviewModal" ? (
                        <>
                            <h1 className={styles.title}>Оставить отзыв</h1>
                            <ReviewBook book={book} modalState={openState} setModalState={setModalState} />
                            <FontAwesomeIcon
                                className={styles.closeButton}
                                onClick={() => {
                                    setModalState(false);
                                }}
                                icon={faXmark}
                            />
                        </>
                    ) : type === "paymentModal" ? (
                        <>
                            <h1 className={styles.title}>Оплата</h1>
                            <PaymentBook book={book} modalState={openState} setModalState={setModalState} />
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
                                <h1 className={styles.title}>Отменение брони</h1>
                                <CancelBook book={book} setModalState={setModalState} />
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

export { ModalBook };
