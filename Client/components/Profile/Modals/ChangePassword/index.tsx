import styles from "./ChangePassword.module.scss";
import inputStyles from "../Input.module.scss";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { MyButton } from "../../../UI/MyButton";
import axios from "axios";
import { useAuthContext } from "../../../../context/auth";
import { encryptString } from "../../../../functions";

interface Props {
    modalState: boolean;
    onClose(): void;
    openSuccessModal(): void;
}

const ChangePassword = ({ modalState, onClose, openSuccessModal }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm();
    const authContext = useAuthContext();

    const [passwordIsVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordRepeatIsVisible, setPasswordRepeatVisible] = useState<boolean>(false);

    const onTogglePasswordEye = () => {
        setPasswordVisible(!passwordIsVisible);
    };
    const onTogglePasswordRepeatEye = () => {
        setPasswordRepeatVisible(!passwordRepeatIsVisible);
    };

    useEffect(() => {
        reset();
    }, [modalState]);

    const onHandleSubmit = (data) => {
        axios
            .patch(
                `${process.env.API_BACK}/user/change_password`,
                {
                    password: data.password,
                    newPassword: data.newPassword,
                },
                {
                    headers: {
                        authorization: `token ${authContext.token}`,
                    },
                }
            )
            .then((response) => {
                if (localStorage && localStorage.getItem("login_remember")) {
                    localStorage.setItem(
                        "login_remember",
                        encryptString(
                            JSON.stringify({
                                email: authContext.user.email,
                                password: data.newPassword,
                            })
                        )
                    );
                }
                openSuccessModal();
                reset();
                onClose();
            })
            .catch((error) => {
                console.log(error.message || error);
            });
    };

    const passwordValidation = (password: string) => {
        return password.length >= 5;
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className={styles.formContainer}>
                    <div className={`${inputStyles.form} ${inputStyles.form_stretch} ${errors.password && inputStyles.error}`}>
                        <h4 className={inputStyles.formTitle}>Текущий пароль</h4>
                        <div className={inputStyles.inputContainer}>
                            <input
                                type={"password"}
                                className={inputStyles.passwordInput}
                                {...register("password", {
                                    required: "Введите текущий пароль",
                                })}
                            />
                        </div>
                        {errors.password && errors.password.type === "match" ? (
                            <span>Введите Ваш настоящий пароль</span>
                        ) : (
                            <span>{errors.password?.message}</span>
                        )}
                    </div>
                    <div className={`${inputStyles.form} ${inputStyles.form_stretch} ${errors.newPassword && inputStyles.error}`}>
                        <h4 className={inputStyles.formTitle}>Новый пароль</h4>
                        <div className={inputStyles.inputContainer}>
                            <input
                                type={passwordIsVisible ? "text" : "password"}
                                className={inputStyles.passwordInput}
                                {...register("newPassword", {
                                    required: "Введите новый пароль",
                                    validate: {
                                        valid: (value) => passwordValidation(value),
                                    },
                                })}
                            />
                            <FontAwesomeIcon
                                className={inputStyles.passwordEye}
                                icon={passwordIsVisible ? faEye : faEyeSlash}
                                onClick={onTogglePasswordEye}
                            />
                        </div>
                        {errors.newPassword && errors.newPassword.type === "valid" ? (
                            <span>Пароль должен быть длины минимум 5</span>
                        ) : errors.newPassword?.type === "different" ? (
                            <span>Введите другой пароль</span>
                        ) : (
                            <span>{errors.newPassword?.message}</span>
                        )}
                    </div>
                    <div className={`${inputStyles.form} ${inputStyles.form_stretch} ${errors.repeatPassword && inputStyles.error}`}>
                        <h4 className={inputStyles.formTitle}>Новый пароль еще раз</h4>
                        <div className={inputStyles.inputContainer}>
                            <input
                                type={passwordRepeatIsVisible ? "text" : "password"}
                                className={inputStyles.passwordInput}
                                {...register("repeatPassword", {
                                    required: "Введите новый пароль еще раз",
                                    validate: { match: (value) => value === getValues("newPassword") },
                                })}
                            />
                            <FontAwesomeIcon
                                className={inputStyles.passwordEye}
                                icon={passwordRepeatIsVisible ? faEye : faEyeSlash}
                                onClick={onTogglePasswordRepeatEye}
                            />
                        </div>
                        {errors.repeatPassword && errors.repeatPassword.type === "match" ? (
                            <span>Пароль не совпадает</span>
                        ) : (
                            <span>{errors.repeatPassword?.message}</span>
                        )}
                    </div>
                </div>
                <div className={styles.buttons}>
                    <MyButton primary stretch submit>
                        Изменить пароль
                    </MyButton>
                    <MyButton
                        secondary
                        stretch
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Отменить
                    </MyButton>
                </div>
            </form>
        </div>
    );
};

export { ChangePassword };
