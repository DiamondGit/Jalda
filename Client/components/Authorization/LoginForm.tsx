import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import _paths from "../../data/paths";
import { MyButton } from "../UI/MyButton";
import styles from "../../pages/auth/Auth.module.scss";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/auth";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";
import Image from "next/image";
import { decodeString, encryptString, getDecodeStorage, setEncryptStorage } from "../../functions";

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ mode: "onChange" });
    const breadcrumbsContext = useBreadcrumbsContext();
    const authContext = useAuthContext();
    const router = useRouter();

    const [passwordIsVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>(null);

    const onTogglePasswordEye = () => {
        setPasswordVisible(!passwordIsVisible);
    };

    const [rememberLogin, setRememberLogin] = useState<boolean>(false);

    const onChangeRemember = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberLogin(event.target.checked);
    };

    useEffect(() => {
        if (localStorage && localStorage.getItem("login_remember")) {
            const json = JSON.parse(decodeString(localStorage.getItem("login_remember")));
            Object.keys(json).forEach((key) => {
                setValue(key, json[key]);
            });
            setRememberLogin(true);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (localStorage && localStorage.getItem("post_redirection-login")) {
                const redirectionJson = JSON.parse(localStorage.getItem("post_redirection-login"));
                breadcrumbsContext.setBreadcrumbsFromLocalstorage(JSON.parse(redirectionJson.breadcrumbs));

                localStorage.removeItem("post_redirection-login");
            }

            if (getDecodeStorage("logged_user-data") && localStorage.getItem("logged_user-token")) {
                authContext.login();
            }
        };
    }, [router.asPath]);

    const onConfirmForm = (data) => {
        try {
            axios
                .post(`${process.env.API_BACK}/user/login`, data)
                .then((response) => {
                    setErrorMessage(null);
                    if (localStorage) {
                        if (rememberLogin) {
                            localStorage.setItem(
                                "login_remember",
                                encryptString(
                                    JSON.stringify({
                                        email: data.email,
                                        password: data.password,
                                    })
                                )
                            );
                        } else if (localStorage.getItem("login_remember")) {
                            localStorage.removeItem("login_remember");
                        }

                        setEncryptStorage("logged_user-data", JSON.stringify(response.data.result));
                        localStorage.setItem("logged_user-token", response.data.token);

                        if (localStorage.getItem("post_redirection-login")) {
                            const redirectionJson = JSON.parse(localStorage.getItem("post_redirection-login"));

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
                    <div className={`${styles.input} ${errors.password && styles.incorrect}`}>
                        <h3>Пароль</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type={passwordIsVisible ? "text" : "password"}
                                {...register("password", {
                                    required: "Введите пароль",
                                })}
                                className={styles.passwordInput}
                            />
                            <FontAwesomeIcon
                                className={styles.passwordEye}
                                icon={passwordIsVisible ? faEye : faEyeSlash}
                                onClick={onTogglePasswordEye}
                            />
                        </div>
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>
                </div>
                <div className={styles.afterInput}>
                    <div className={styles.checkbox}>
                        <div>
                            <input id="remember" type="checkbox" checked={rememberLogin} onChange={onChangeRemember} />
                            <h3>Запомнить меня</h3>
                        </div>
                        <Link href={_paths.resetPassword}>
                            <a className={styles.link}>Забыли пароль?</a>
                        </Link>
                    </div>
                </div>
                <MyButton submit primary stretch>
                    Войти
                </MyButton>
            </form>
            <div className={styles.afterBtn}>
                <div className={styles.separator}>
                    <hr />
                    <span>или</span>
                    <hr />
                </div>
                <div className={styles.socials}>
                    <div className={styles.icon}>
                        <Image src={"/icons/socials/google_black.svg"} layout={"fill"} objectFit={"contain"} alt={"Google"} />
                    </div>
                    <div className={styles.icon}>
                        <Image src={"/icons/socials/facebook_black.svg"} layout={"fill"} objectFit={"contain"} alt={"Facebook"} />
                    </div>
                    <div className={styles.icon}>
                        <Image src={"/icons/socials/vk_black.svg"} layout={"fill"} objectFit={"contain"} alt={"VK"} />
                    </div>
                </div>
                <h3 className={styles.switch}>
                    Нет аккаунта?{" "}
                    <Link href={_paths.signup}>
                        <a
                            className={styles.link}
                            onClick={() => {
                                if (localStorage && localStorage.getItem("post_redirection-login")) {
                                    localStorage.setItem("post_redirection-signup", localStorage.getItem("post_redirection-login"));
                                }
                            }}
                        >
                            Зарегистрироваться
                        </a>
                    </Link>
                </h3>
            </div>
        </>
    );
};

export { LoginForm };
