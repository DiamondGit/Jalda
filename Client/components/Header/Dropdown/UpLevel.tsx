import Link from "next/link";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight as fasAngleRight } from "@fortawesome/free-solid-svg-icons";
import { MidLevel } from "./MidLevel";
import { UpCategoryNavType } from "../../../interfaces";

interface CategoryDropdownProps extends UpCategoryNavType {
    isBurgerActive: boolean;
    closeBurger(): void;
    styles: any;
}

const CategoryDropdown = ({ name, path, subcategories, isBurgerActive, closeBurger, styles }: CategoryDropdownProps) => {
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
        <div className={styles.upLevel}>
            <div className={`${styles.navLinkContainer} ${isTabActive && styles.active}`} onClick={toggleActive}>
                <Link href={path}>
                    <a className="upLevel" onClick={onTitleClick}>
                        {name}
                    </a>
                </Link>
                <FontAwesomeIcon icon={fasAngleRight} className={styles.arrowDown} />
            </div>
            <div className={styles.midLevel}>
                {subcategories &&
                    subcategories.map((midCategory) => {
                        return (
                            <MidLevel
                                key={midCategory._id}
                                {...midCategory}
                                styles={styles}
                                isBurgerActive={isBurgerActive}
                                closeBurger={closeBurger}
                                path={`${path}/${midCategory.path}`}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export { CategoryDropdown };
