import { Dispatch, SetStateAction } from "react";
import { ApplicationType } from "../../../../../interfaces";
import { MyButton } from "../../../../UI/MyButton";
import styles from "./ApproveApplication.module.scss";

interface Props {
    application: ApplicationType;
    setModalState: Dispatch<SetStateAction<boolean>>;
}

const ApproveApplication = ({ application, setModalState }: Props) => {
    const onConfirm = (application: ApplicationType) => {
        alert(`Одобрено ${application.bookNumber}`);
        setModalState(false);
    };

    const onCalcel = () => {
        setModalState(false);
    };

    return (
        <div className={styles.mainContainer}>
            <p className={styles.content}>Вы точно хотите одобрить заявку?</p>
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

export { ApproveApplication };
