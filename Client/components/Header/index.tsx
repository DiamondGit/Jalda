import Image from "next/image";
import Link from "next/link";
import { Navbar } from "./Navbar";
import _paths from "../../data/paths";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart, faUser as farUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket, faBars as fasBars, faXmark as fasXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.scss";
import React, { useEffect, useState } from "react";
import { Notification } from "./Notification";
import { useStaticDataContext } from "../../context/staticData";
import { Seacrh } from "./Search";
import { useAuthContext } from "../../context/auth";
import { useRouter } from "next/router";

interface HeaderProps {
    isMainPage: boolean;
}

const Header = ({ isMainPage }: HeaderProps) => {
    const staticData = useStaticDataContext();
    const authContext = useAuthContext();
    const router = useRouter();

    const contacts = staticData.get.contacts;
    const socials = staticData.get.socials;

    const [isAdmin, setAdmin] = useState(authContext.role === "Admin");
    const isLogged = authContext.isLogged;
    const user = authContext.user;

    const [isBurgerActive, setBurgerActive] = useState(false);

    const onToggleBurger = () => {
        setBurgerActive(!isBurgerActive);
    };

    const closeBurger = () => {
        setBurgerActive(false);
    };

    useEffect(() => {
        return () => {
            setAdmin(false);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={`${styles.wrapper}  ${isAdmin && styles.admin} wrapper`}>
                {isAdmin ? (
                    <div className={styles.logo} style={{ cursor: "default" }}>
                        <Image src="/brand/logo&label.png" alt="Jalda logo" layout="fill" unoptimized={true} priority />
                    </div>
                ) : (
                    <div className={styles.logo}>
                        <Link href={_paths.main}>
                            <a>
                                <Image src="/brand/logo&label.png" alt="Jalda logo" layout="fill" unoptimized={true} priority />
                            </a>
                        </Link>
                    </div>
                )}
                {!isAdmin ? (
                    <>
                        <div className={styles.mobileBtns}>
                            {!isMainPage && !isBurgerActive && <Seacrh isMobile />}
                            <FontAwesomeIcon
                                icon={isBurgerActive ? fasXmark : fasBars}
                                className={styles.burgerBtn}
                                onClick={onToggleBurger}
                            />
                        </div>
                        <div className={`${styles.burgerMenu} ${isBurgerActive && styles.active}`}>
                            <Navbar isBurgerActive={isBurgerActive} closeBurger={closeBurger} />
                            <div className={styles.rightSide}>
                                <div className={styles.buttons}>
                                    {!isMainPage && <Seacrh />}
                                    <div className={styles.navLinkContainer}>
                                        <Link href={authContext.isLogged ? _paths.profileFavorites : _paths.favorites}>
                                            <a className={styles.heart}>
                                                <FontAwesomeIcon icon={farHeart} className={styles.icon} />
                                                <span className={styles.title}>Избранные</span>
                                            </a>
                                        </Link>
                                    </div>
                                    {isLogged && (
                                        <div className={styles.navLinkContainer}>
                                            <Notification toggleBurger={onToggleBurger} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.navLinkContainer}>
                                    {isLogged ? (
                                        <div className={styles.login}>
                                            <Link href={_paths.profile}>
                                                <a>
                                                    <FontAwesomeIcon icon={farUser} className={styles.icon} />
                                                    <span className={styles.title}>{user?.name}</span>
                                                    <span className={styles.title__mobile}>Личный кабинет</span>
                                                </a>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className={styles.login}>
                                            <Link href={_paths.login}>
                                                <a>
                                                    <FontAwesomeIcon icon={farUser} className={styles.icon} />
                                                    <span className={`${styles.title} ${styles.notAuthorized}`}>Войти</span>
                                                </a>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.contacts}>
                                    <ul>
                                        <li>
                                            <div>
                                                <div className={styles.icon}>
                                                    <Image
                                                        src={"/icons/phone_blue.svg"}
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
                                                        src={"/icons/phone_blue.svg"}
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
                                                src={`/icons/socials/${social.name.toLowerCase()}_blue.svg`}
                                                layout={"fill"}
                                                objectFit={"contain"}
                                                priority
                                                alt={"Social logo"}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2
                            className={styles.logout}
                            onClick={() => {
                                authContext.logout();
                                router.push(_paths.main);
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className={styles.icon} />
                            Выйти
                        </h2>
                    </>
                )}
            </div>
            <style>
                {`
                ${
                    isBurgerActive &&
                    `
                body{
                    overflow: hidden;
                }
                `
                }
                `}
            </style>
        </header>
    );
};

export { Header };
