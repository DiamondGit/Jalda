import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../../../context/auth";
import _paths from "../../../../../data/paths";
import { BookInfoTitles, BookType, CreditCardType } from "../../../../../interfaces";
import { Loading } from "../../../../LoadingWindow";
import { CardSelect } from "../../../../UI/CardSelect";
import { MyButton } from "../../../../UI/MyButton";
import { CreditCardForm } from "../../AddCreditCard/Form";
import styles from "./PaymentBook.module.scss";

enum CardType {
    mastercard,
    visa,
}

interface PaymentBookProps {
    book: BookType;
    modalState: boolean;
    setModalState: Dispatch<SetStateAction<boolean>>;
}

const PaymentBook = ({ book, modalState, setModalState }: PaymentBookProps) => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(true);
    const authContext = useAuthContext();

    const totalPrice = 200000;

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const maxPayment = 50000;
    const percentage = 0.5;

    const [selectedCard, setSelectedCard] = useState<CreditCardType | string>(null);
    const [addNewCardIsActive, setAddNewCardIsActive] = useState(false);

    const onChangeSelectedCard = (creditCard: CreditCardType | string) => {
        if (typeof creditCard !== "string") {
            setSelectedCard(creditCard);
            setAddNewCardIsActive(false);
        } else {
            setSelectedCard(null);
            setAddNewCardIsActive(true);
        }
    };

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
        if (selectedCard) alert(JSON.stringify(selectedCard));
        else alert(JSON.stringify(data));
        reset();
        setModalState(false);
    };

    if (loading) return <Loading />;
    return (
        <form className={styles.body} onSubmit={handleSubmit(onHandleSubmit)}>
            <Link href={`${_paths.post}/${book.postId}`}>
                <a className={styles.mainTitle}>{book.title}</a>
            </Link>
            <div className={styles.bookInfos}>
                {book.bookInfos.map((bookInfo, index) => (
                    <h3 key={index}>
                        <span>{BookInfoTitles[bookInfo.title]}: </span>
                        {bookInfo.title === "date" && typeof bookInfo.value === "string"
                            ? [...bookInfo.value.slice(0, 10).split("-")].reverse().join(".")
                            : bookInfo.title === "time" && typeof bookInfo.value === "object"
                            ? `${bookInfo.value.from}-${bookInfo.value.till}`
                            : bookInfo.value}
                    </h3>
                ))}
                <h3>
                    <span>{BookInfoTitles.bookNumber}: </span>
                    {book.bookNumber}
                </h3>
            </div>
            <h1 className={styles.totalPrice}>Итого: {totalPrice.toLocaleString()} &#8376;</h1>
            <div className={styles.creditCardSection}>
                {authContext.user.creditCards.length > 0 ? (
                    <>
                        <h2>Выберите карту</h2>
                        <CardSelect creditCards={authContext.user.creditCards} callback={onChangeSelectedCard} />
                        {addNewCardIsActive && <CreditCardForm cardType={cardType} register={register} control={control} errors={errors} />}
                    </>
                ) : (
                    <>
                        <h2>Добавить карту</h2>
                        <CreditCardForm cardType={cardType} register={register} control={control} errors={errors} />
                    </>
                )}
            </div>
            <div className={styles.resultSection}>
                <div>
                    <h1>
                        К оплате: {(totalPrice * percentage > maxPayment ? maxPayment : totalPrice * percentage).toLocaleString()} &#8376;
                    </h1>
                    <h2>
                        {percentage * 100} % от общей суммы
                        <br />
                        (не более {maxPayment.toLocaleString()} &#8376;)
                    </h2>
                </div>
            </div>
            <div className={styles.buttons}>
                <MyButton primary stretch submit>
                    Оплатить
                </MyButton>
                <MyButton
                    secondary
                    stretch
                    onClick={() => {
                        setModalState(false);
                    }}
                >
                    Отменить
                </MyButton>
            </div>
        </form>
    );
};

export { PaymentBook };
