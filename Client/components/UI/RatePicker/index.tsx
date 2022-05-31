import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styles from "./RatePicker.module.scss";

enum RateTitle {
    rate1 = "Плохо",
    rate2 = "Нормально",
    rate3 = "Хорошо",
    rate4 = "Отлично",
    rate5 = "Замечательно",
}

interface RatePickerProps {
    modalState: boolean;
    callback(selectedRate: number): void;
}

const RatePicker = ({ modalState, callback }: RatePickerProps) => {
    const [selectedRate, setSelectedRate] = useState(null);
    const [hoveredRate, setHoveredRate] = useState(null);
    const array = [1, 2, 3, 4, 5];

    useEffect(() => {
        setSelectedRate(null);
    }, [modalState]);

    useEffect(() => {
        if (selectedRate) callback(selectedRate);
    }, [selectedRate]);

    return (
        <div className={styles.mainContainer}>
            <div
                className={styles.starsContainer}
                onMouseLeave={() => {
                    setHoveredRate(null);
                }}
            >
                {array.map((element) => (
                    <div
                        className={styles.starContainer}
                        key={element}
                        onMouseOver={() => {
                            setHoveredRate(element);
                        }}
                        onClick={() => {
                            setSelectedRate(element);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faStar}
                            className={`${styles.star} ${
                                hoveredRate
                                    ? element <= hoveredRate
                                        ? styles.active
                                        : styles.inactive
                                    : selectedRate
                                    ? element <= selectedRate
                                        ? styles.active
                                        : styles.inactive
                                    : styles.inactive
                            }`}
                        />
                    </div>
                ))}
            </div>
            <span className={styles.title}>{RateTitle[`rate${hoveredRate || selectedRate}`] || null}</span>
        </div>
    );
};

export { RatePicker };
