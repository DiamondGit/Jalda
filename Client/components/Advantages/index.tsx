import Image from "next/image";
import { AdvantageType } from "../../interfaces";
import styles from "./Advantages.module.scss";

const Advantages = () => {
    const advantages: AdvantageType[] = [
        {
            id: "8kzky1hu",
            iconName: "convenience",
            title: "Удобство",
            text: "Даём возможность арендовать, бронировать всё на одном удобном сайте.",
        },
        {
            id: "ohr8wtk3",
            iconName: "savingTime",
            title: "Экономия времени",
            text: "Сэкономим ваше время для поиска нужного ассортимента.",
        },
        {
            id: "1v6jqjsx",
            iconName: "safely",
            title: "Безопасно",
            text: "Помогаем владельцам и арендаторам находить друг друга и совершать безопасные сделки онлайн.",
        },
        {
            id: "trn2nyqt",
            iconName: "commission",
            title: "Бронирование без комиссии",
            text: "Мы не взимаем комиссию за оформление бронирования или другие услуги.",
        },
    ];

    return (
        <>
            {advantages && (
                <div className={styles.advantagesContainer}>
                    {advantages.map(({ id, iconName, title, text }) => (
                        <div className={styles.advantage} key={id}>
                            <div className={styles.pictureContainer}>
                                <div className={styles.iconContainer}>
                                    <div>
                                        <Image src={`/icons/advantages/${iconName}.svg`} layout="fill" alt={"Advantage logo"} />
                                    </div>
                                </div>
                                <div className={styles.circle} />
                            </div>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export { Advantages };
