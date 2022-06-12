import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { _monthNames } from "../../data";
import { CommentType } from "../../interfaces";
import { RatingStars } from "../UI/RatingStars";
import styles from "./CommentCard.module.scss";

const CommentCard = ({ user, postDate, rating, text }: CommentType) => {
    const defaultPictureUrl = "/defaultUserPicture.png";

    const [isOpened, setOpen] = useState<boolean>(false);
    const [isOverflown, setOverflown] = useState<boolean>(false);
    const textRef = useRef(null);

    const onToggleOpen = () => {
        setOpen(!isOpened);
    };

    useEffect(() => {
        setOverflown(checkOverflow(textRef.current));
    }, []);

    const checkOverflow = (element) => {
        if (element === null) return;
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    };

    const getDateNumberWithZero = (number: number) => {
        const strNum = number.toString();
        if (strNum.length === 1) return `0${strNum}`;
        return strNum;
    };

    const getProcessedDate = (postDateString: string) => {
        const date = new Date(postDateString);

        let DayMonthYear = "";
        [...postDateString.slice(0, 10).split("-")].reverse().map((element, index) => {
            switch (index) {
                case 0: //day
                    DayMonthYear += `${element.startsWith("0") ? element.slice(1) : element} `;
                    break;
                case 1: //month
                    DayMonthYear += `${_monthNames[Number.parseInt(element) - 1].toLowerCase()} `;
                    break;
                case 2: //year
                    DayMonthYear += `${element}, `;
                    break;
            }
        });

        const time = `${getDateNumberWithZero(date.getHours())}:${getDateNumberWithZero(date.getMinutes())}`;

        return DayMonthYear + time;
    };

    return (
        <div className={styles.container}>
            <div className={styles.comment}>
                <div className={styles.header}>
                    <div className={styles.pictureContainer}>
                        <Image
                            src={user.image || defaultPictureUrl}
                            layout="fill"
                            objectFit="cover"
                            placeholder="blur"
                            blurDataURL="/placeholder-image.jpg"
                            alt={"User image"}
                        />
                    </div>
                    <div className={styles.title}>
                        <h3 className={styles.name}>{`${user.name} ${user.surname || ""} ${user.fathername || ""}`.trim()}</h3>
                        <h3 className={styles.date}>{getProcessedDate(postDate)}</h3>
                        <RatingStars rating={rating} withoutNumbers />
                    </div>
                </div>
                <div className={styles.content}>
                    <p ref={textRef} className={`${isOpened && styles.fullText}`}>
                        {text}
                    </p>
                    {isOverflown && (
                        <button className={styles.openButton} onClick={onToggleOpen}>
                            {isOpened ? "Скрыть" : "Читать больше"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export { CommentCard };
