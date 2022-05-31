import { faAngleDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CreditCardType } from "../../../interfaces";
import styles from "./Card.Select.module.scss";

enum CardType {
    mastercard,
    visa,
}

interface CardSelectProps {
    callback(creditCard: CreditCardType | string): void;
    creditCards: CreditCardType[];
}

interface CardNodeProps {
    active?: boolean;
    selected?: boolean;
    creditCard: CreditCardType;
    onCardClick?(creditCard: CreditCardType): void;
}

const CardNode = ({ creditCard, active, selected, onCardClick }: CardNodeProps) => {
    const cardType = creditCard.number[0] === "4" ? CardType.visa : creditCard.number[0] === "5" ? CardType.mastercard : null;

    return (
        <div
            className={`${styles.cardNode} ${active && styles.active} ${selected && styles.selected}`}
            onClick={() => {
                if (!selected) onCardClick(creditCard);
            }}
        >
            <div className={styles.creditType}>
                <Image
                    src={`/icons/creditCards/${CardType[cardType]}_logo.svg`}
                    layout={"fixed"}
                    objectFit={"contain"}
                    width={64}
                    height={42}
                    alt={"Credit card logo"}
                />
            </div>
            <h2 className={styles.number}>{creditCard.number}</h2>
            <h2 className={styles.date}>
                {creditCard.expireDate.month}/{creditCard.expireDate.year}
            </h2>
        </div>
    );
};

const CardSelect = ({ callback, creditCards }: CardSelectProps) => {
    const [selectedCard, setSelectedCard] = useState<CreditCardType | string>(creditCards[0]);
    const [isOpen, setOpen] = useState(false);
    const dropdown = useRef(null);

    useEffect(() => {
        callback(selectedCard);
    }, [selectedCard]);

    useEffect(() => {
        if (!isOpen) return;
        function handleClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setOpen(false);
            }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isOpen]);

    const onCardClick = (creditCard: CreditCardType | string) => {
        setSelectedCard(creditCard);
        setOpen(false);
    };

    const isActiveCard = (creditCard: CreditCardType) => {
        return JSON.stringify(creditCard) === JSON.stringify(selectedCard);
    };
    return (
        <div className={styles.select}>
            <div
                className={styles.container}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {typeof selectedCard !== "string" ? (
                    <CardNode creditCard={selectedCard} selected />
                ) : (
                    <div className={`${styles.addNewCard} ${styles.selected}`}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <span>Добавить карту</span>
                    </div>
                )}
                <FontAwesomeIcon icon={faAngleDown} className={styles.arrow} />
            </div>
            <div className={`${styles.dropdown} ${isOpen && styles.active}`} ref={dropdown}>
                {creditCards.map((creditCard, index) => (
                    <CardNode creditCard={creditCard} active={isActiveCard(creditCard)} onCardClick={onCardClick} key={creditCard._id} />
                ))}

                <div
                    className={`${styles.addNewCard} ${typeof selectedCard === "string" && styles.active}`}
                    onClick={() => {
                        onCardClick("addNewCard");
                    }}
                >
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <span>Добавить карту</span>
                </div>
            </div>
        </div>
    );
};

export { CardSelect };
