import Link from "next/link";
import _paths from "../../data/paths";
import { MyButton } from "../UI/MyButton";
import styles from "../../pages/auth/Auth.module.scss";
import { Controller, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { useAuthContext } from "../../context/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { setEncryptStorage } from "../../functions";

const PartnerForm = () => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const authContext = useAuthContext();
    const router = useRouter();

    const onConfirmForm = (data) => {
        const sendingData = {
            surname: data.surname,
            name: data.name,
            fathername: data.fathername,
            email: data.email,
            companyName: data.companyName,
            iinNumber: data.iinNumber,
            phoneNumber: data.phoneNumber,
        };

        try {
            if (authContext.isLogged) {
                axios
                    .post(`${process.env.API_BACK}/user/upgrade_to_author`, sendingData, {
                        headers: {
                            authorization: `token ${authContext.token}`,
                        },
                    })
                    .then((response) => {
                        authContext.refreshInfo(response.data.result, response.data.token);
                        if (localStorage) {
                            setEncryptStorage("logged_user-data", JSON.stringify(response.data.result));
                            localStorage.setItem("logged_user-token", response.data.token);
                        }
                        router.push(_paths.main);
                    })
                    .catch((error) => {
                        console.log(error.message || error);
                    });
            } else {
                axios
                    .post(`${process.env.API_BACK}/user/signup_author`, sendingData)
                    .then((response) => {
                        router.push(_paths.main);
                    })
                    .catch((error) => {
                        console.log(error.message || error);
                    });
            }
        } catch (error) {
            console.log(error.message || error);
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit(onConfirmForm)}>
                <div className={styles.inputsContainer}>
                    <div className={`${styles.input} ${errors.companyName && styles.incorrect} ${styles.required}`}>
                        <h3>Название организации</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                {...register("companyName", {
                                    required: "Введите название организации",
                                })}
                            />
                        </div>
                        {errors.companyName && <span>{errors.companyName.message}</span>}
                    </div>
                    <div className={`${styles.input} ${errors.iinNumber && styles.incorrect} ${styles.required}`}>
                        <h3>ИИН</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                maxLength={12}
                                {...register("iinNumber", {
                                    required: "Введите ИИН",
                                    pattern: {
                                        value: /\d/,
                                        message: "Неверный формат ИИН",
                                    },

                                    validate: {
                                        length: (value) => {
                                            return value.length === 12;
                                        },
                                    },
                                })}
                            />
                        </div>
                        {errors.iinNumber && errors.iinNumber.type === "length" ? (
                            <span>ИИН должен содержать 12 цифр</span>
                        ) : (
                            <span>{errors.iinNumber?.message}</span>
                        )}
                    </div>
                    <div className={`${styles.input} ${errors.surname && styles.incorrect} ${styles.required}`}>
                        <h3>Фамилия</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                {...register("surname", {
                                    required: "Введите фамилию",
                                })}
                                defaultValue={authContext.isLogged ? authContext.user.surname : null}
                            />
                        </div>
                        {errors.surname && <span>{errors.surname.message}</span>}
                    </div>
                    <div className={`${styles.input} ${errors.name && styles.incorrect} ${styles.required}`}>
                        <h3>Имя</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                {...register("name", {
                                    required: "Введите имя",
                                })}
                                defaultValue={authContext.isLogged ? authContext.user.name : null}
                            />
                        </div>
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>
                    <div className={`${styles.input} ${errors.fathername && styles.incorrect}`}>
                        <h3>Отчество</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                {...register("fathername", {
                                    required: false,
                                })}
                            />
                        </div>
                        {errors.fathername && <span>{errors.fathername.message}</span>}
                    </div>
                    <div className={`${styles.input} ${errors.email && styles.incorrect} ${styles.required}`}>
                        <h3>E-mail</h3>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Введите e-mail",
                                    pattern: {
                                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Неверный формат",
                                    },
                                })}
                                defaultValue={authContext.isLogged ? authContext.user.email : null}
                            />
                        </div>
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <div className={`${styles.input} ${errors.phoneNumber && styles.incorrect} ${styles.required}`}>
                        <h3>Телефон</h3>
                        <div className={styles.inputContainer}>
                            <Controller
                                {...{
                                    control,
                                    register,
                                    name: "phoneNumber",
                                    defaultValue: authContext.isLogged ? authContext.user.phoneNumber : null,
                                    rules: {
                                        required: "Введите номер телефона",
                                        validate: {
                                            isEmpty: (value) =>
                                                value
                                                    .slice(2)
                                                    .replaceAll(" ", "")
                                                    .replaceAll("-", "")
                                                    .replaceAll("_", "")
                                                    .replace("+", "")
                                                    .replace(")", "")
                                                    .replace("(", "").length !== 0,
                                            isValidLength: (value) =>
                                                value
                                                    .slice(2)
                                                    .replaceAll(" ", "")
                                                    .replaceAll("-", "")
                                                    .replaceAll("_", "")
                                                    .replace("+", "")
                                                    .replace(")", "")
                                                    .replace("(", "").length === 10,
                                        },
                                    },
                                    render: ({ field }) => (
                                        <NumberFormat format="+7 (###) ###-##-##" mask="_" allowEmptyFormatting {...field} />
                                    ),
                                }}
                            />
                        </div>
                        {errors.phoneNumber && errors.phoneNumber.type === "isEmpty" ? (
                            <span>Введите номер телефона</span>
                        ) : errors.phoneNumber?.type === "isValidLength" ? (
                            <span>Номер телефона должен состоять из 12 цирф</span>
                        ) : (
                            <span>{errors.phoneNumber?.message}</span>
                        )}
                    </div>
                </div>
                <div className={styles.afterInput}>
                    <div className={`${styles.checkbox} ${errors.agreement && styles.incorrect}`}>
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

                    {errors.agreement && <span>{errors.agreement.message}</span>}
                </div>
                <MyButton submit primary stretch>
                    Отправить заявку
                </MyButton>
            </form>
        </>
    );
};

export { PartnerForm };
