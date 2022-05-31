import { CreditCardType } from "../../../../interfaces";
import { MyButton } from "../../../UI/MyButton";
import styles from "./DeleteCreditCard.module.scss";

interface Props {
    card: CreditCardType;
    onConfirm(cardId: string): void;
    onCalcel(): void;
}

const DeleteCreditCard = ({ card, onConfirm, onCalcel }: Props) => {
    return (
        <div className={styles.mainContainer}>
            <p className={styles.content}>
                Вы точно хотите удалить банковскую карту <span>...{card?.number.slice(-4)}</span>?
            </p>
            <div className={styles.buttons}>
                <MyButton primary stretch onClick={() => onConfirm(card._id)}>
                    Удалить
                </MyButton>
                <MyButton secondary stretch onClick={onCalcel}>
                    Отменить
                </MyButton>
            </div>
        </div>
    );
};

export { DeleteCreditCard };
