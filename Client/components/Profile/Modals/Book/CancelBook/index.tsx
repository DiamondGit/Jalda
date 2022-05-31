import { Dispatch, SetStateAction } from "react";
import { BookType } from "../../../../../interfaces";
import { MyButton } from "../../../../UI/MyButton";
import styles from "./CancelBook.module.scss";

interface Props {
    book: BookType;
    setModalState: Dispatch<SetStateAction<boolean>>;
}

const CancelBook = ({ book, setModalState }: Props) => {
    const onConfirm = (book: BookType) => {
        alert(`Отменено ${book.bookNumber}`);
        setModalState(false);
    };

    const onCalcel = () => {
        setModalState(false);
    };

    return (
        <div className={styles.mainContainer}>
            <p className={styles.content}>Вы точно хотите отменить бронь?</p>
            <div className={styles.buttons}>
                <MyButton primary stretch onClick={() => onConfirm(book)}>
                    Да
                </MyButton>
                <MyButton secondary stretch onClick={onCalcel}>
                    Нет
                </MyButton>
            </div>
        </div>
    );
};

export { CancelBook };
