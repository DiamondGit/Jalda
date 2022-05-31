import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Rating.module.scss";

interface RatingProps {
    rating: number;
    isGrid?: boolean;
    lg?: boolean;
    withoutNumbers?: boolean;
}

const RatingStars = ({ rating, isGrid = false, lg = false, withoutNumbers = false }: RatingProps) => {
    const isFloat = () => {
        return rating % 1 !== 0;
    };

    return (
        <div className={`${styles.ratingContainer} ${isGrid && styles.isGrid} ${lg && styles.large}`}>
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((element) => (
                    <div className={styles.starContainer} key={element}>
                        <FontAwesomeIcon icon={faStar} className={`${styles.star} ${rating >= element && styles.active}`} />
                        {isFloat() && Math.ceil(rating) <= 5 && Math.ceil(rating) === element && (
                            <FontAwesomeIcon
                                icon={faStarHalf}
                                className={`${styles.star} ${styles.halfStar} ${styles.active}`}
                                key={element}
                            />
                        )}
                    </div>
                ))}
            </div>
            {!withoutNumbers && <span>{rating || 0} / 5</span>}
        </div>
    );
};

export { RatingStars };
