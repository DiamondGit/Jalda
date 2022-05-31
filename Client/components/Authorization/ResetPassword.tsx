import { useState } from "react";
import _paths from "../../data/paths";
import { MyButton } from "../UI/MyButton";
import styles from "../../pages/auth/Auth.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/auth";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ mode: "onChange" });
    const breadcrumbsContext = useBreadcrumbsContext();
    const authContext = useAuthContext();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string>(null);

    const onConfirmForm = (data) => {
        try {
            axios
                .post(`${process.env.API_BACK}/user/reset_password`, data)
                .then((response) => {
                    router.push(_paths.login);
                    setErrorMessage(null);
                })
                .catch((error) => {
                    if (error.response) {
                        setErrorMessage(error.response.data.message);
                    }
                });
        } catch (error) {
            console.log(error.message || error);
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit(onConfirmForm)}>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                <div className={styles.inputsContainer}>
                    <div className={`${styles.input} ${errors.email && styles.incorrect}`}>
                        <h3>E-mail</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Введите e-mail",
                                    pattern: {
                                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Формат неверный",
                                    },
                                })}
                            />
                        </div>
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                </div>

                <MyButton submit primary stretch>
                    Сбросить пароль
                </MyButton>
            </form>
        </>
    );
};

export { ResetPassword };
