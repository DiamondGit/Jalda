import Image from "next/image";
import Link from "next/link";
import _paths from "../../data/paths";
import { BookInfoTitles, OptionType, ApplicationStatusType, ApplicationModalType, ApplicationType } from "../../interfaces";
import { MyButton } from "../UI/MyButton";
import styles from "./AdApplicationCard.module.scss";

interface AdApplicationCardProps {
    application: ApplicationType;
    setApplicationModal(modalState: boolean, application: ApplicationType, type: ApplicationModalType): void;
}

const AdApplicationCard = ({ application, setApplicationModal }: AdApplicationCardProps) => {
    const statusOptions: OptionType[] = [
        {
            title: "Ожидает ответа",
            value: "waiting",
        },
        {
            title: "Оплачено",
            value: "paid",
        },
    ];

    return (
        <div className={styles.mainContainer}>
            <div className={styles.image}>
                <Image
                    src={application.postImages[0]}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                    alt={"Preview image"}
                />
            </div>
            <div className={styles.content}>
                <div className={`${styles.infos} ${styles[ApplicationStatusType[application.status]]}`}>
                    <Link href={`${_paths.post}/${application.postId}`}>
                        <a className={styles.mainTitle}>{application.title}</a>
                    </Link>
                    <div className={styles.bookInfos}>
                        {application.bookInfos.map((bookInfo, index) => (
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
                            {application.bookNumber}
                        </h3>
                        <h3 className={`${styles.statusTitle} ${styles[ApplicationStatusType[application.status]]}`}>
                            <span>{BookInfoTitles.status}: </span>
                            {statusOptions.find((option) => option.value === ApplicationStatusType[application.status])?.title}
                        </h3>
                    </div>
                    <h2 className={styles.priceTitle}>{application.price.toLocaleString()} &#8376; / час</h2>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.leftSide}>
                        <MyButton
                            moreRounded
                            noPadding
                            onClick={() => {
                                setApplicationModal(true, application, "detailModal");
                            }}
                        >
                            Подробнее
                        </MyButton>
                    </div>
                    <div className={styles.rightSide}>
                        {application.status === ApplicationStatusType["waiting"] ? (
                            <>
                                <MyButton
                                    secondary
                                    moreRounded
                                    small
                                    onClick={() => {
                                        setApplicationModal(true, application, "cancelModal");
                                    }}
                                >
                                    Отклонить
                                </MyButton>
                                <MyButton
                                    primary
                                    moreRounded
                                    small
                                    onClick={() => {
                                        setApplicationModal(true, application, "approveModal");
                                    }}
                                >
                                    Одобрить заявку
                                </MyButton>
                            </>
                        ) : (
                            <MyButton secondary moreRounded small>
                                Связаться с арендатором
                            </MyButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdApplicationCard };
