import Link from "next/link";
import _paths from "../../data/paths";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.scss";
import { CategoryDropdown } from "./Dropdown/UpLevel";
import { useStaticDataContext } from "../../context/staticData";

interface NavbarProps {
    isBurgerActive: boolean;
    closeBurger(): void;
}

const Navbar = ({ isBurgerActive, closeBurger }: NavbarProps) => {
    const staticData = useStaticDataContext();
    const categories = staticData.get.categories;

    return (
        <div className={styles.navbar}>
            <div className={styles.navLinkContainer}>
                <Link href={_paths.adFeed}>
                    <a className={styles.navLink}>Все объявления</a>
                </Link>
            </div>
            <div className={styles.categories}>
                <span>
                    Категории <FontAwesomeIcon icon={faAngleDown} className={styles.icon} />
                </span>
                <div className={styles.dropdown}>
                    <div className={styles.dropdownContainer}>
                        {categories?.map((category) => {
                            return (
                                <CategoryDropdown
                                    {...category}
                                    key={category._id}
                                    styles={styles}
                                    isBurgerActive={isBurgerActive}
                                    closeBurger={closeBurger}
                                    path={`${_paths.adFeed}/${category.path}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.navLinkContainer}>
                <Link href={_paths.aboutUs}>
                    <a className={styles.navLink}>О Нас</a>
                </Link>
            </div>
            <div className={styles.navLinkContainer}>
                <Link href={_paths.contacts}>
                    <a className={styles.navLink}>Контакты</a>
                </Link>
            </div>
            <div className={styles.navLinkContainer}>
                <Link href={_paths.howItWorks}>
                    <a className={styles.navLink}>Как это работает?</a>
                </Link>
            </div>
        </div>
    );
};

export { Navbar };
