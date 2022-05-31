import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight as fasAngleRight } from "@fortawesome/free-solid-svg-icons";
import { LowLevel } from "./LowLevel";
import { useEffect, useState } from "react";
import { MidCategoryNavType } from "../../../interfaces";

interface MidLevelProps extends MidCategoryNavType {
    isBurgerActive: boolean;
    closeBurger(): void;
    styles: any;
}

const MidLevel = ({ name, path, subcategories, isBurgerActive, closeBurger, styles }: MidLevelProps) => {
    const [isTabActive, setTabActive] = useState(false);

    const toggleActive = () => {
        setTabActive(!isTabActive);
    };

    useEffect(() => {
        if (!isBurgerActive) setTabActive(false);
    }, [isBurgerActive]);

    const onTitleClick = () => {
        closeBurger();
    };

    return (
        <>
            <div className={`${styles.navLinkContainer} ${isTabActive && styles.active}`} onClick={toggleActive}>
                <Link href={path}>
                    <a onClick={onTitleClick}>{name}</a>
                </Link>

                {subcategories && <FontAwesomeIcon icon={fasAngleRight} className={styles.arrowDown} />}
            </div>
            {subcategories && (
                <div className={styles.lowLevel}>
                    {" "}
                    <LowLevel categories={subcategories} styles={styles} closeBurger={closeBurger} parentPath={path} />
                </div>
            )}
        </>
    );
};
export { MidLevel };
