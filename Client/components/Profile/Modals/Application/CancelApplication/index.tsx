import { Dispatch, SetStateAction } from "react";
import { ApplicationType } from "../../../../../interfaces";
import { MyButton } from "../../../../UI/MyButton";
import styles from "./CancelApplication.module.scss";

interface Props {
    application: ApplicationType;
    setModalState: Dispatch<SetStateAction<boolean>>;
}

const CancelApplication = ({ application, setModalState }: Props) => {
    const onConfirm = (application: ApplicationType) => {
        alert(`Отменено ${application.bookNumber}`);
        setModalState(false);
    };

    const onCalcel = () => {
        setModalState(false);
    };

    return (
        <div className={styles.mainContainer}>
            <p className={styles.content}>Вы точно хотите отклонить заявку?</p>
            <div className={styles.buttons}>
                <MyButton primary stretch onClick={() => onConfirm(application)}>
                    Да
                </MyButton>
                <MyButton secondary stretch onClick={onCalcel}>
                    Нет
                </MyButton>
            </div>
        </div>
    );
};

export { CancelApplication };
