import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import _paths from "../../../../../data/paths";
import { BookType } from "../../../../../interfaces";
import { MyButton } from "../../../../UI/MyButton";
import { RatePicker } from "../../../../UI/RatePicker";
import styles from "./ReviewBook.module.scss";

interface ReviewBookProps {
    book: BookType;
    modalState: boolean;
    setModalState: Dispatch<SetStateAction<boolean>>;
}

const ReviewBook = ({ book, modalState, setModalState }: ReviewBookProps) => {
    const { register, handleSubmit, reset, watch } = useForm();

    const [selectedRate, setSelectedRate] = useState(null);

    useEffect(() => {
        reset();
    }, [modalState]);

    const onSendReview = (data) => {
        if (selectedRate) {
            alert(`Отзыв: ${data.comment}\nРейтинг: ${selectedRate}`);
            reset();
            setModalState(false);
        }
    };

    return (
        <div className={styles.body}>
            <Link href={`${_paths.post}/${book.postId}`}>
                <a className={styles.postCard}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={book.postImages[0]}
                            layout={"fill"}
                            objectFit={"cover"}
                            placeholder="blur"
                            blurDataURL="/placeholder-image.jpg"
                            alt={"Preview Image"}
                        />
                    </div>
                    <div className={styles.content}>
                        <h2>{book.title}</h2>
                        <p>{book.description}</p>
                    </div>
                </a>
            </Link>
            <div className={styles.ratePicker}>
                <RatePicker modalState={modalState} callback={setSelectedRate} />
            </div>
            <form onSubmit={handleSubmit(onSendReview)}>
                <div className={styles.commentContainer}>
                    <div className={styles.header}>
                        <h3>Напишите отзыв</h3>
                        <h3>{watch("comment")?.length || 0} / 1000</h3>
                    </div>
                    <textarea
                        {...register("comment", {
                            required: false,
                            maxLength: 1000,
                        })}
                    ></textarea>
                </div>
                <MyButton primary stretch submit>
                    Отправить
                </MyButton>
            </form>
        </div>
    );
};

export { ReviewBook };
