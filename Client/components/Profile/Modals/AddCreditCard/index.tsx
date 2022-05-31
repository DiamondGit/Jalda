import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../../context/auth";
import { MyButton } from "../../../UI/MyButton";
import styles from "./AddCreditCard.module.scss";
import { CreditCardForm } from "./Form";

enum CardType {
    mastercard,
    visa,
}

interface Props {
    modalState: boolean;
    onClose(): void;
}

const AddCreditCard = ({ modalState, onClose }: Props) => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const authContext = useAuthContext();

    const [cardType, setCardType] = useState<CardType>(null);

    useEffect(() => {
        if (watch("number")) {
            const firstNumber = watch("number")[0];
            setCardType(firstNumber === "4" ? CardType.visa : firstNumber === "5" ? CardType.mastercard : null);
        } else {
            setCardType(null);
        }
    }, [watch()]);

    useEffect(() => {
        reset();
    }, [modalState]);

    const onHandleSubmit = (data) => {
        const newCard = {
            number: data.number,
            name: "Real Human",
            expireDate: {
                month: data.month,
                year: data.year,
            },
            cvv: data.cvv,
        };

        try {
            axios
                .post(`${process.env.API_BACK}/user/add_credit_card`, newCard, {
                    headers: {
                        authorization: `token ${authContext.token}`,
                    },
                })
                .then((response) => {
                    authContext.refreshInfo(response.data.result, response.data.token);
                })
                .catch((error) => {
                    console.log(error.message || error);
                });
        } catch (error) {}

        reset();
        onClose();
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className={styles.mainContainer}>
                    <CreditCardForm cardType={cardType} register={register} control={control} errors={errors} />
                    <MyButton primary stretch submit>
                        Привязать
                    </MyButton>
                </div>
            </form>
        </div>
    );
};

export { AddCreditCard };
