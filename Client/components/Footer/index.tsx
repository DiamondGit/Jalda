import Image from "next/image";
import Link from "next/link";
import _paths from "../../data/paths";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./Footer.module.scss";
import { ReactNode, useState } from "react";
import { useStaticDataContext } from "../../context/staticData";
import { useAuthContext } from "../../context/auth";

interface FooterAccordionProps {
    classId: string;
    title: string;
    children: ReactNode;
}

const FooterAccordion = ({ classId, title, children }: FooterAccordionProps) => {
    const [isOpen, setOpen] = useState(false);

    const onToggle = () => {
        setOpen(!isOpen);
    };

    return (
        <div className={`${styles.tabLinks} ${styles[classId]} ${isOpen && styles.active}`}>
            <div onClick={onToggle} className={styles.tabTitle}>
                <h3>{title}</h3>
                <FontAwesomeIcon icon={faAngleDown} className={styles.arrowDown} />
            </div>
            {children}
        </div>
    );
};

const Footer = () => {
    const staticData = useStaticDataContext();
    const authContext = useAuthContext();

    const categories = staticData.get.categories;
    const contacts = staticData.get.contacts;
    const socials = staticData.get.socials;

    return (
        <footer className={styles.footer}>
            <div className={`${styles.wrapper} wrapper`}>
                <div className={styles.mainContainer}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logo}>
                            {authContext.role !== "Admin" ? (
                                <Link href={_paths.main}>
                                    <a>
                                        <Image
                                            src="/brand/logo&label_white.png"
                                            alt="Jalda logo"
                                            layout="fill"
                                            unoptimized={true}
                                            priority
                                        />
                                    </a>
                                </Link>
                            ) : (
                                <Image src="/brand/logo&label_white.png" alt="Jalda logo" layout="fill" unoptimized={true} priority />
                            )}
                        </div>
                        {authContext.role !== "Admin" && <h3>Платформа для аренды чего-угодно</h3>}
                    </div>
                    {authContext.role !== "Admin" && (
                        <>
                            <div className={styles.linksSection}>
                                <FooterAccordion title={"Объявления"} classId={"ads"}>
                                    <div className={styles.links}>
                                        <Link href={_paths.adFeed}>
                                            <a>Все объявления</a>
                                        </Link>
                                        {categories?.map((category) => (
                                            <Link href={`${_paths.adFeed}/${category.path}`} key={category._id}>
                                                <a>{category.name}</a>
                                            </Link>
                                        ))}
                                    </div>
                                </FooterAccordion>
                                <FooterAccordion title={"Партнерам"} classId={"partners"}>
                                    <div className={styles.links}>
                                        <Link href={_paths.registerPartner}>
                                            <a>Стать партнером</a>
                                        </Link>
                                        <Link href={_paths.partnerRules}>
                                            <a>Условия и правила</a>
                                        </Link>
                                    </div>
                                </FooterAccordion>
                                <FooterAccordion title={"О нас"} classId={"about"}>
                                    <div className={styles.links}>
                                        <Link href={_paths.faq}>
                                            <a>Кто мы и что мы делаем?</a>
                                        </Link>
                                        <Link href={_paths.advantages}>
                                            <a>Наши преимущества</a>
                                        </Link>
                                        <Link href={_paths.contacts}>
                                            <a>Контакты</a>
                                        </Link>
                                        <Link href={_paths.contactWithUs}>
                                            <a>Оставить заявку на консультацию</a>
                                        </Link>
                                    </div>
                                </FooterAccordion>
                            </div>
                            <div className={styles.contactsSection}>
                                <div className={styles.contacts}>
                                    <ul>
                                        <li>
                                            <div>
                                                <div className={styles.icon}>
                                                    <Image
                                                        src={`/icons/location_white.svg`}
                                                        layout={"fill"}
                                                        objectFit={"contain"}
                                                        priority
                                                        alt={"Logo"}
                                                    />
                                                </div>
                                                <h3>{contacts?.address}</h3>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <div className={styles.icon}>
                                                    <Image
                                                        src={`/icons/mail_white.svg`}
                                                        layout={"fill"}
                                                        objectFit={"contain"}
                                                        priority
                                                        alt={"Mail logo"}
                                                    />
                                                </div>
                                                <h3>{contacts?.email}</h3>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <div className={styles.icon}>
                                                    <Image
                                                        src={`/icons/phone_white.svg`}
                                                        layout={"fill"}
                                                        objectFit={"contain"}
                                                        priority
                                                        alt={"Phone logo"}
                                                    />
                                                </div>
                                                <h3>{contacts?.mobilePhoneNumber}</h3>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <div className={styles.icon}>
                                                    <Image
                                                        src={`/icons/phone_white.svg`}
                                                        layout={"fill"}
                                                        objectFit={"contain"}
                                                        priority
                                                        alt={"Phone logo"}
                                                    />
                                                </div>
                                                <h3>{contacts?.phoneNumber}</h3>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.socials}>
                                    {socials?.map((social) => (
                                        <a className={styles.iconContainer} href={social.link} target="_blank" key={social.name}>
                                            <Image
                                                src={`/icons/socials/${social.name.toLowerCase()}_white.svg`}
                                                layout={"fill"}
                                                objectFit={"contain"}
                                                priority
                                                alt={"Social logo"}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <h5 className={styles.copyright}>© 2022 Jalda. Все права защищены</h5>
            </div>
        </footer>
    );
};

export { Footer };
