import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDeclension } from "../../../functions";
import { ReviewRatingType } from "../../../interfaces";
import { RatingStars } from "../RatingStars";
import styles from "./ReviewRating.module.scss";

interface NodeProps {
    rate: number;
    count: string;
    percent: number;
}

const Node = ({ rate, count, percent }: NodeProps) => {
    return (
        <div className={styles.ratingItem}>
            <span className={styles.rate}>
                {rate}
                <FontAwesomeIcon className={styles.icon} icon={faStar} />
            </span>
            <div className={`${styles.indicator} indicator`}></div>
            <span className={styles.count}>{count}</span>
            <style jsx>
                {`
                    .indicator::after {
                        width: ${percent * 100}%;
                    }
                `}
            </style>
        </div>
    );
};

interface ReviewRatingProps {
    rating: ReviewRatingType;
}

const ReviewRating = ({ rating }: ReviewRatingProps) => {
    if (!rating) return null;

    const arraySize = [5, 4, 3, 2, 1];

    const declensionNumeralsRatings = useDeclension("отзыв", "отзыва", "отзывов");

    const reviewCount = () => {
        let temp = 0;
        arraySize.forEach((element) => (temp += rating[`${element}`]));
        return temp;
    };

    const [allNumber, setAllNumber] = useState(reviewCount());

    useEffect(() => {
        setAllNumber(reviewCount());
    }, [rating]);

    return (
        <div className={styles.reviewRating}>
            <div className={styles.leftPart}>
                <h3>
                    {rating.avg || 0}
                    <span>/</span>5
                </h3>
                <div className={styles.starsContainer}>
                    <RatingStars rating={rating.avg} lg withoutNumbers />
                </div>
                <span>{declensionNumeralsRatings(allNumber)}</span>
            </div>
            <div className={styles.rightPart}>
                {arraySize.map((element) => (
                    <Node key={element} rate={element} count={rating[`${element}`]} percent={rating[`${element}`] / allNumber} />
                ))}
            </div>
        </div>
    );
};

export { ReviewRating };
