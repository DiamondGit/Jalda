import Image from "next/image";
import styles from "./AddCreditCard.module.scss";
import inputStyles from "../Input.module.scss";
import { Control, Controller, FieldValues, UseFormRegister } from "react-hook-form";
import NumberFormat from "react-number-format";

enum CardType {
    mastercard,
    visa,
}

interface CreditCardFormProps {
    cardType: CardType;
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues, any>;
    errors: {
        [x: string]: any;
    };
}

const CreditCardForm = ({ cardType, register, control, errors }: CreditCardFormProps) => {
    const allCardTypes = Object.keys(CardType).filter((item) => {
        return isNaN(Number(item));
    });

    return (
        <div className={styles.contentContainer}>
            <div className={styles.creditType}>
                {cardType === null ? (
                    allCardTypes?.map((type, index) => (
                        <Image
                            src={`/icons/creditCards/${type}_logo.svg`}
                            layout={"fixed"}
                            objectFit={"contain"}
                            width={64}
                            height={42}
                            key={index}
                            alt={"Credit card logo"}
                        />
                    ))
                ) : (
                    <Image
                        src={`/icons/creditCards/${CardType[cardType]}_logo.svg`}
                        layout={"fixed"}
                        objectFit={"contain"}
                        width={64}
                        height={42}
                        alt={"Credit card logo"}
                    />
                )}
            </div>
            <div className={styles.formContainer}>
                <div className={`${inputStyles.form} ${inputStyles.form_stretch} ${errors.number && inputStyles.error}`}>
                    <h4 className={inputStyles.formTitle}>Номер карты</h4>
                    <Controller
                        {...{
                            control,
                            register,
                            name: "number",
                            rules: {
                                required: true,
                                validate: {
                                    format: (value) => value[0] === "4" || value[0] === "5",
                                    length: (value) => value.toString().replaceAll(" ", "").trim().length === 16,
                                },
                            },
                            defaultValue: "",
                            render: ({ field }) => (
                                <NumberFormat format="#### #### #### ####" placeholder="0000 0000 0000 0000" {...field} />
                            ),
                        }}
                    />
                </div>
                <div className={styles.secondLine}>
                    <div className={`${inputStyles.form} ${inputStyles.form_fit} ${(errors.month || errors.year) && inputStyles.error}`}>
                        <h4 className={inputStyles.formTitle}>Действует до</h4>
                        <div className={styles.dates}>
                            <Controller
                                {...{
                                    control,
                                    register,
                                    name: "month",
                                    rules: {
                                        required: true,
                                        min: 1,
                                        max: 12,
                                        validate: (value) => value.trim().length === 2,
                                    },
                                    defaultValue: "",
                                    render: ({ field }) => (
                                        <NumberFormat
                                            format="##"
                                            placeholder="ММ"
                                            {...field}
                                            className={`${errors.month && inputStyles.error}`}
                                        />
                                    ),
                                }}
                            />
                            <span>/</span>
                            <Controller
                                {...{
                                    control,
                                    register,
                                    name: "year",
                                    rules: {
                                        required: true,
                                        validate: (value) => value.trim().length === 2,
                                    },
                                    defaultValue: "",
                                    render: ({ field }) => (
                                        <NumberFormat
                                            maxLength={2}
                                            placeholder="ГГ"
                                            {...field}
                                            className={`${errors.year && inputStyles.error}`}
                                        />
                                    ),
                                }}
                            />
                        </div>
                    </div>
                    <div className={`${inputStyles.form} ${inputStyles.form_fit} ${errors.cvv && inputStyles.error}`}>
                        <h4 className={inputStyles.formTitle}>CVV/CVC</h4>
                        <div className={styles.dates}>
                            <input
                                type={"password"}
                                minLength={3}
                                maxLength={3}
                                placeholder="CVV"
                                className={`${styles.cvv} ${errors.cvv && inputStyles.error}`}
                                {...register("cvv", {
                                    required: true,
                                    validate: (value) => /^[0-9]*$/.test(value),
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CreditCardForm };
