import Image from "next/image";
import Link from "next/link";
import AliceCarousel from "react-alice-carousel";
import _paths from "../../../../../data/paths";
import { BookInfoTitles, BookType, ModalType, StatusType } from "../../../../../interfaces";
import { BookStatusBar } from "../../../../UI/BookStatusBar";
import { MyButton } from "../../../../UI/MyButton";
import styles from "./DetailedBook.module.scss";

interface DetailedBookProps {
    book: BookType;
    setBookModal(modalState: boolean, book: BookType, type: ModalType): void;
}

const DetailedBook = ({ book, setBookModal }: DetailedBookProps) => {
    if (!book) return null;
    return (
        <>
            <div className={styles.imageCarousel}>
                <AliceCarousel
                    animationType="fadeout"
                    animationDuration={200}
                    keyboardNavigation
                    responsive={{
                        0: {
                            items: 1,
                        },
                    }}
                    disableDotsControls
                >
                    {book.postImages.map((postImage, index) => (
                        <div className={styles.imageContainer} key={index}>
                            <Image
                                src={postImage}
                                layout={"fill"}
                                objectFit="cover"
                                placeholder="blur"
                                blurDataURL="/placeholder-image.jpg"
                                className={styles.image}
                                alt={"Image"}
                            />
                        </div>
                    ))}
                </AliceCarousel>
                <style>
                    {`
                        .alice-carousel__stage-item{
                            width: max-content !important;
                        }
                        .alice-carousel__prev-btn,
                        .alice-carousel__next-btn{
                            padding: 0;
                            position: absolute;
                            top: 50%;
                            width: max-content;
                            transform: translateY(-50%);
                            font-size: 40px;
                            font-weight: 600;
                        }
                        .alice-carousel__prev-btn{
                            left: 0;
                        }
                        .alice-carousel__next-btn{
                            right: 0;
                        }
                        .alice-carousel__prev-btn-item,
                        .alice-carousel__next-btn-item{
                            padding: 0;
                            width: 70px;
                            height: 150px;
                            display: flex;
                            justify-content: center;
                            align-items:center;
                            cursor: pointer;
                            color: rgba(255, 255, 255, 0.3);
                            background-color: rgba(0, 0, 0, 0.3);
                            transition: background-color 0.2s, color 0.2s;
                        }
                        .alice-carousel__prev-btn-item.__inactive,
                        .alice-carousel__next-btn-item.__inactive{
                            display: none;
                        }
                        .alice-carousel__prev-btn-item:hover,
                        .alice-carousel__next-btn-item:hover{
                            color: rgba(255, 255, 255, 1);
                            background-color: rgba(0, 0, 0, 0.6);
                        }
                    `}
                </style>
            </div>
            <div className={styles.content}>
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
                    <div className={styles.descriptionContainer}>
                        {book.description.includes("<br />") ? (
                            book.description.split("<br />").map((parag, index) => (
                                <p className={styles.description} key={index}>
                                    {parag}
                                </p>
                            ))
                        ) : (
                            <p className={styles.description}>{book.description}</p>
                        )}
                    </div>
                </div>

                <div className={styles.statusBarContainer}>
                    <BookStatusBar status={StatusType[book.status]} />
                </div>

                <div className={styles.buttonsContainer}>
                    <div className={styles.leftPart}>
                        {book.status === StatusType["completed"] && (
                            <MyButton
                                moreRounded
                                noPadding
                                onClick={() => {
                                    setBookModal(true, book, "reviewModal");
                                }}
                            >
                                Оставить отзыв
                            </MyButton>
                        )}
                    </div>
                    <div className={styles.rightPart}>
                        {(book.status === StatusType["processing"] || book.status === StatusType["payment"]) && (
                            <MyButton
                                secondary
                                moreRounded
                                small
                                onClick={() => {
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
                                onClick={() => {
                                    setBookModal(true, book, "paymentModal");
                                }}
                            >
                                Перейти к оплате
                            </MyButton>
                        )}
                        {(book.status === StatusType["rejected"] || book.status === StatusType["completed"]) && (
                            <MyButton secondary moreRounded small>
                                Связаться с владельцем
                            </MyButton>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export { DetailedBook };
