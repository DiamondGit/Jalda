import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { CreditCardType } from "../../interfaces";
import styles from "./CreditCard.module.scss";

interface Props {
    creditCard: CreditCardType;
    onDeleteCard(card: CreditCardType): void;
}

const CreditCard = ({ creditCard, onDeleteCard }: Props) => {
    const typeOfCard = () => {
        if (creditCard.number[0] === "5") return "visa";
        else if (creditCard.number[0] === "4") return "mastercard";
    };

    const backgroundUrl =
        typeOfCard() === "visa"
            ? "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            : typeOfCard() === "mastercard" &&
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80";

    return (
        <div className={`${styles.container} ${styles[typeOfCard()]}`}>
            <div className={styles.logo}>
                {typeOfCard() && <Image src={`/icons/creditCards/${typeOfCard()}_logo_white.svg`} layout={"fill"} objectFit={"contain"} />}
            </div>
            <div className={styles.mainInfo}>
                <h3 className={styles.name}>{creditCard.name}</h3>
                <span>Expiry</span>
                <h3 className={styles.number}>{creditCard.number}</h3>
                <h3 className={styles.expireDate}>
                    {`0${creditCard.expireDate.month}`.slice(-2)}/{`0${creditCard.expireDate.year}`.slice(-2)}
                </h3>
            </div>
            <div className={styles.deleteButton}>
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={() => {
                        onDeleteCard(creditCard);
                    }}
                />
            </div>
            <div className={styles.shadow} />
            <Image
                className={styles.background}
                src={backgroundUrl || "/placeholder-image.jpg"}
                layout={"fill"}
                objectFit={"cover"}
                placeholder="blur"
                blurDataURL="/placeholder-image.jpg"
                alt={"Background image"}
            />
        </div>
    );
};

export { CreditCard };
