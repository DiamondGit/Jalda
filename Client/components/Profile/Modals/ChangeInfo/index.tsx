import styles from "./ChangeInfo.module.scss";
import { Controller, useForm } from "react-hook-form";
import { MyButton } from "../../../UI/MyButton";
import { useEffect } from "react";
import NumberFormat from "react-number-format";
import axios from "axios";
import { useAuthContext } from "../../../../context/auth";
import { UserType } from "../../../../interfaces";

interface Props {
    userInfo: UserType;
    modalState: boolean;
    onClose(): void;
}

const ChangeInfo = ({ userInfo, modalState, onClose }: Props) => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset,
    } = useForm({ mode: "onChange" });
    const authContext = useAuthContext();

    const onConfirmForm = (data) => {
        try {
            axios
                .patch(`${process.env.API_BACK}/user`, data, {
                    headers: {
                        authorization: `token ${authContext.token}`,
                    },
                })
                .then((response) => {
                    authContext.refreshInfo(response.data.result);
                })
                .catch((error) => {
                    console.log(error.message || error);
                });
        } catch (error) {}

        reset();
        onClose();
    };

    const mainAction = () => {
        reset();
        clearErrors();
    };

    useEffect(() => {
        mainAction();
    }, [modalState]);

    const onCalcel = () => {
        onClose();
        mainAction();
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit(onConfirmForm)}>
                <div className={styles.inputsContainer}>
                    {authContext.role === "User" ? (
                        <>
                            <div className={`${styles.input} ${errors.surname && styles.incorrect}`}>
                                <h3>Фамилия</h3>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        defaultValue={userInfo.surname || ""}
                                        {...register("surname", {
                                            required: false,
                                            pattern: {
                                                value: /^([^0-9]*)$/,
                                                message: "Фамилия не должна содержать цифры",
                                            },
                                        })}
                                    />
                                </div>
                                {errors.surname && <span>{errors.surname.message}</span>}
                            </div>
                            <div className={`${styles.input} ${errors.name && styles.incorrect}`}>
                                <h3 className={styles.required}>Имя</h3>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        defaultValue={userInfo.name}
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
                                <h3 className={styles.required}>E-mail</h3>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="email"
                                        defaultValue={userInfo.email}
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
                            <div className={`${styles.input} ${errors.phoneNumber && styles.incorrect}`}>
                                <h3>Телефон</h3>
                                <div className={styles.inputContainer}>
                                    <Controller
                                        {...{
                                            control,
                                            register,
                                            name: "phoneNumber",
                                            rules: {
                                                required: false,
                                                validate: {
                                                    isValidLength: (value) => {
                                                        const length = value
                                                            ?.slice(2)
                                                            .replaceAll(" ", "")
                                                            .replaceAll("-", "")
                                                            .replaceAll("_", "")
                                                            .replace("+", "")
                                                            .replace(")", "")
                                                            .replace("(", "").length;

                                                        return !(0 < length && length < 10);
                                                    },
                                                },
                                            },
                                            render: ({ field }) => (
                                                <NumberFormat
                                                    format="+7 (###) ###-##-##"
                                                    mask="_"
                                                    allowEmptyFormatting
                                                    {...field}
                                                    defaultValue={userInfo.phoneNumber}
                                                />
                                            ),
                                        }}
                                    />
                                </div>
                                {errors.phoneNumber && errors.phoneNumber.type === "isValidLength" && (
                                    <span>Номер телефона должен состоять из 12 цирф</span>
                                )}
                            </div>
                            <div className={`${styles.input} ${errors.birthDate && styles.incorrect}`}>
                                <h3 className={styles.required}>Дата рождения</h3>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="date"
                                        defaultValue={userInfo.birthDate.slice(0, 10)}
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
                        </>
                    ) : (
                        <>
                            <div className={`${styles.input} ${errors.name && styles.incorrect}`}>
                                <h3 className={styles.required}>Название организации</h3>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        defaultValue={userInfo.companyName}
                                        {...register("companyName", {
                                            required: "Введите название организации",
                                        })}
                                    />
                                </div>
                                {errors.name && <span>{errors.name.message}</span>}
                            </div>
                            <div className={`${styles.input} ${errors.email && styles.incorrect}`}>
                                <h3 className={styles.required}>E-mail</h3>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="email"
                                        defaultValue={userInfo.email}
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
                            <div className={`${styles.input} ${errors.phoneNumber && styles.incorrect}`}>
                                <h3 className={styles.required}>Телефон</h3>
                                <div className={styles.inputContainer}>
                                    <Controller
                                        {...{
                                            control,
                                            register,
                                            name: "phoneNumber",
                                            defaultValue: userInfo.phoneNumber,
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
                        </>
                    )}
                </div>
                <div className={styles.buttons}>
                    <MyButton submit primary stretch>
                        Сохранить
                    </MyButton>
                    <MyButton secondary stretch onClick={onCalcel}>
                        Отменить
                    </MyButton>
                </div>
            </form>
        </div>
    );
};

export { ChangeInfo };
