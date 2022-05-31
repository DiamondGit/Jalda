import Image from "next/image";
import { AuthorType } from "../../interfaces";
import styles from "./AuthorCard.module.scss";

interface AuthorCardProps {
    author: AuthorType;
    isMobile?: boolean;
}

const AuthorCard = ({ author, isMobile = false }: AuthorCardProps) => {
    const defaultPictureUrl =
        "https://images.unsplash.com/photo-1614063930598-56a8b347342d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

    const contactNames = ["whatsapp", "telegram", "phoneNumber"];

    if (!author) return null;
    return (
        <div className={`${styles.authorCard} ${isMobile && styles.modile}`}>
            <div className={styles.imageContainer}>
                <Image
                    src={author.image || defaultPictureUrl}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                    alt={"Author Image"}
                />
            </div>
            <div className={styles.content}>
                <h3>Автор объявления</h3>
                <h2>{author.companyName}</h2>
                <div className={styles.contacts}>
                    {contactNames.map((contactName, index) => {
                        if (author[contactName]) {
                            return (
                                <div key={index}>
                                    <div className={styles.icon}>
                                        <Image
                                            src={`/icons/contacts/${contactName}.svg`}
                                            layout={"fill"}
                                            objectFit={"contain"}
                                            alt={"Contact logo"}
                                        />
                                    </div>
                                    <h3>{author[contactName]}</h3>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export { AuthorCard };
