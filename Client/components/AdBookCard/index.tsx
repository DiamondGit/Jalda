import Image from "next/image";
import Link from "next/link";
import _paths from "../../data/paths";
import { BookInfoTitles, BookType, ModalType, OptionType, StatusType } from "../../interfaces";
import { MyButton } from "../UI/MyButton";
import styles from "./AdBookCard.module.scss";

interface AdBookCardProps {
    book: BookType;
    setBookModal(modalState: boolean, book: BookType, type: ModalType): void;
}

const AdBookCard = ({ book, setBookModal }: AdBookCardProps) => {
    const statusOptions: OptionType[] = [
        {
            title: "В обработке",
            value: "processing",
        },
        {
            title: "Ожидает оплату",
            value: "payment",
        },
        {
            title: "Отклонен",
            value: "rejected",
        },
        {
            title: "Завершен",
            value: "completed",
        },
    ];

    return (
        <div
            className={styles.mainContainer}
            onClick={() => {
                setBookModal(true, book, "detailModal");
            }}
        >
            <div className={styles.image}>
                <Image
                    src={book.postImages[0]}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                    alt={"Preview Image"}
                />
            </div>
            <div className={styles.content}>
                <div
                    className={`${styles.infos} ${styles[StatusType[book.status]]}`}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
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
                        <h3 className={`${styles.statusTitle} ${styles[StatusType[book.status]]}`}>
                            <span>{BookInfoTitles.status}: </span>
                            {statusOptions.find((option) => option.value === StatusType[book.status])?.title}
                        </h3>
                    </div>
                    <h2 className={styles.priceTitle}>{book.price.toLocaleString()} &#8376; / час</h2>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.leftSide}>
                        <MyButton
                            moreRounded
                            noPadding
                            onClick={(event) => {
                                event.stopPropagation();
                                setBookModal(true, book, "detailModal");
                            }}
                        >
                            Подробнее
                        </MyButton>
                        {book.status === StatusType["completed"] && (
                            <MyButton
                                moreRounded
                                noPadding
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setBookModal(true, book, "reviewModal");
                                }}
                            >
                                Оставить отзыв
                            </MyButton>
                        )}
                    </div>
                    <div className={styles.rightSide}>
                        {(book.status === StatusType["processing"] || book.status === StatusType["payment"]) && (
                            <MyButton
                                secondary
                                moreRounded
                                small
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setBookModal(true, book, "cancelModal");
                                }}
                            >
                                Отменить бронь
                            </MyButton>
                        )}
                        {book.status === StatusType["payment"] && (
                            <MyButton
                                primary
                                moreRounded
                                small
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setBookModal(true, book, "paymentModal");
                                }}
                            >
                                Перейти к оплате
                            </MyButton>
                        )}
                        {(book.status === StatusType["rejected"] || book.status === StatusType["completed"]) && (
                            <MyButton
                                secondary
                                moreRounded
                                small
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                Связаться с владельцем
                            </MyButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdBookCard };
