import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import _paths from "../../data/paths";
import { MyButton } from "../UI/MyButton";
import styles from "../../pages/auth/Auth.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuthContext } from "../../context/auth";
import { useRouter } from "next/router";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";
import { getDecodeStorage, setEncryptStorage } from "../../functions";

const SignupForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({ mode: "onChange" });
    const breadcrumbsContext = useBreadcrumbsContext();
    const authContext = useAuthContext();
    const router = useRouter();

    const [passwordIsVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordRepeatIsVisible, setPasswordRepeatVisible] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(null);

    const onTogglePasswordEye = () => {
        setPasswordVisible(!passwordIsVisible);
    };
    const onTogglePasswordRepeatEye = () => {
        setPasswordRepeatVisible(!passwordRepeatIsVisible);
    };

    useEffect(() => {
        return () => {
            if (localStorage) {
                localStorage.removeItem("post_redirection-signup");
            }

            if (getDecodeStorage("logged_user-data") && localStorage.getItem("logged_user-token")) {
                authContext.login();
            }
        };
    }, [router.asPath]);

    const onConfirmForm = (data) => {
        const sendingData = {
            name: data.name,
            email: data.email,
            password: data.password,
            birthDate: data.birthDate,
        };

        try {
            axios
                .post(`${process.env.API_BACK}/user/signup`, sendingData)
                .then((response) => {
                    setErrorMessage(null);

                    if (localStorage) {
                        setEncryptStorage("logged_user-data", JSON.stringify(response.data.result));
                        localStorage.setItem("logged_user-token", response.data.token);

                        if (localStorage.getItem("post_redirection-signup")) {
                            const redirectionJson = JSON.parse(localStorage.getItem("post_redirection-signup"));
                            breadcrumbsContext.setBreadcrumbsFromLocalstorage(JSON.parse(redirectionJson.breadcrumbs));

                            localStorage.setItem("open_book_modal", "true");

                            router.push(`${_paths.post}/${redirectionJson.postId}`);
                        } else {
                            router.push(_paths.main);
                        }
                    }
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
                    <div className={`${styles.input} ${errors.name && styles.incorrect}`}>
                        <h3>Имя</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                {...register("name", {
                                    required: "Введите имя",
                                    pattern: {
                                        value: /^([^0-9]*)$/,
                                        message: "Имя не должно содержать цифры",
                                    },
                                })}
                            />
                        </div>
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>
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
                    <div className={`${styles.input} ${errors.birthDate && styles.incorrect}`}>
                        <h3>Дата рождения</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="date"
                                {...register("birthDate", {
                                    required: "Введите дату рождения",
                                    validate: {
                                        isFuture: (value) => {
                                            return new Date().toISOString().split("T")[0] >= value;
                                        },
                                    },
                                })}
                            />
                        </div>
                        {errors.birthDate && errors.birthDate.type === "isFuture" ? (
                            <span>Вы из будущего?</span>
                        ) : (
                            <span>{errors.birthDate?.message}</span>
                        )}
                    </div>
                    <div className={`${styles.input} ${errors.password && styles.incorrect}`}>
                        <h3>Пароль</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type={passwordIsVisible ? "text" : "password"}
                                className={styles.passwordInput}
                                {...register("password", {
                                    required: "Введите пароль",
                                    minLength: {
                                        value: 5,
                                        message: "Пароль должен содержать как минимум 5 символов",
                                    },
                                })}
                            />
                            <FontAwesomeIcon
                                className={styles.passwordEye}
                                icon={passwordIsVisible ? faEye : faEyeSlash}
                                onClick={onTogglePasswordEye}
                            />
                        </div>
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>
                    <div className={`${styles.input} ${errors.passwordRepeat && styles.incorrect}`}>
                        <h3>Повторить пароль</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type={passwordRepeatIsVisible ? "text" : "password"}
                                className={styles.passwordInput}
                                {...register("passwordRepeat", {
                                    required: "Введите пароль повторно",
                                    validate: { notEqual: (value) => value === getValues("password") },
                                })}
                            />
                            <FontAwesomeIcon
                                className={styles.passwordEye}
                                icon={passwordRepeatIsVisible ? faEye : faEyeSlash}
                                onClick={onTogglePasswordRepeatEye}
                            />
                        </div>
                        {errors.passwordRepeat && errors.passwordRepeat.type === "notEqual" ? (
                            <span>Пароль не совпадает</span>
                        ) : (
                            <span>{errors.passwordRepeat?.message}</span>
                        )}
                    </div>
                </div>
                <div className={styles.afterInput}>
                    <div className={`${styles.checkbox} ${errors.agreement && styles.incorrect}`}>
                        <div>
                            <input
                                type="checkbox"
                                {...register("agreement", {
                                    required: "Ознакомьтесь с правилами",
                                })}
                            />
                            <h3>
                                Я согласен на{" "}
                                <Link href={_paths.main}>
                                    <a className={styles.link}>обработку персональных данных</a>
                                </Link>{" "}
                                и ознакомился с{" "}
                                <Link href={_paths.main}>
                                    <a className={styles.link}>политикой конфиденциальности</a>
                                </Link>
                                .
                            </h3>
                        </div>
                    </div>
                    {errors.agreement && <span>{errors.agreement.message}</span>}
                </div>
                <MyButton submit primary stretch>
                    Зарегистрироваться
                </MyButton>
            </form>
            <h3 className={styles.switch}>
                Уже есть аккаунт?{" "}
                <Link href={_paths.login}>
                    <a className={styles.link}>Войти</a>
                </Link>
            </h3>
        </>
    );
};

export { SignupForm };
