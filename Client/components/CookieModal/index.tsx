import Image from "next/image";
import { useEffect, useState } from "react";
import { MyButton } from "../UI/MyButton";
import styles from "./CookieModal.module.scss";

const CookieModal = () => {
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (localStorage) {
            setOpen(!localStorage.getItem("cookie_agreement"));
        }
    }, []);

    const onCloseModal = () => {
        if (localStorage) {
            localStorage.setItem("cookie_agreement", "true");
            setOpen(false);
        }
    };

    if (isOpen) {
        return (
            <div className={styles.mainContainer}>
                <div className={`wrapper ${styles.wrapper}`}>
                    <div className={styles.imageContainer}>
                        <Image src={"/icons/cookie.svg"} layout={"fill"} objectFit={"contain"} alt={"Cookie image"} />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.title}>Куки</h3>
                        <p className={styles.text}>
                            Этот сайт использует файлы cookies для обеспечения работоспособности и улучшения качества обслуживания.
                            Продолжая использовать наш сайт, вы автоматически соглашаетесь с использованием данных технологий.
                        </p>
                    </div>
                    <MyButton primary small moreRounded onClick={onCloseModal}>
                        Принимаю
                    </MyButton>
                </div>
            </div>
        );
    }
    return null;
};

export { CookieModal };
