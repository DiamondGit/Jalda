import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { MyButton } from "../MyButton";
import styles from "./Modal.module.scss";

type ModalSuccessProps = {
    title: string;
    openState: boolean;
    children?: string | never[];
    toggler: Dispatch<SetStateAction<boolean>>;
    buttonText: string;
};

const ModalSuccess = ({ title = null, openState, children, toggler, buttonText }: ModalSuccessProps) => {
    const closeModal = () => {
        toggler(false);
    };

    return (
        <div className={`${styles.modal} ${openState && styles.acive} ${styles.success}`}>
            <div className={styles.modalContainer}>
                <div className={styles.shifter} />
                <div className={styles.container}>
                    {title && <h1 className={styles.title}>{title}</h1>}
                    <div className={styles.wrapper}>
                        <div className={styles.body}>
                            <Image src={"/icons/success-tick.svg"} layout={"fixed"} width={150} height={150} objectFit={"contain"} />
                            <p>{children}</p>
                        </div>
                        <MyButton primary onClick={closeModal}>
                            {buttonText}
                        </MyButton>
                    </div>
                    <FontAwesomeIcon className={styles.closeButton} onClick={closeModal} icon={faXmark} />
                </div>
                <div className={styles.shifter} />
            </div>
            <div className={styles.shadow} onClick={closeModal} />
        </div>
    );
};

export { ModalSuccess };
