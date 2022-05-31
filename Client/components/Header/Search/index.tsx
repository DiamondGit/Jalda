import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useBreadcrumbsContext } from "../../../context/breadcrumbs";
import _paths from "../../../data/paths";
import styles from "../Header.module.scss";

interface SearchProps {
    isMobile?: boolean;
}

const Seacrh = ({ isMobile = false }: SearchProps) => {
    const router = useRouter();
    const breadcrumbsContext = useBreadcrumbsContext();

    const [isActive, setActive] = useState(false);
    const dropdown = useRef(null);
    const { register, handleSubmit } = useForm();

    const onToggleSearch = () => {
        setActive(!isActive);
    };

    useEffect(() => {
        if (!isActive) return;
        function handleClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setActive(false);
            }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isActive]);

    const onHandleSubmit = (data) => {
        setActive(false);
        const { filter } = router.query;
        const isFilter = typeof filter === "object";

        breadcrumbsContext.addSearchBreadcrumbs({ name: "Результат поиска", path: `${router.asPath}?search=${data.search}` });

        if (router.asPath.includes(_paths.adFeed))
            router.push(`${_paths.adFeed}${isFilter ? `/${filter.join("/")}` : ""}?search=${data.search}`);
        else router.push(`${_paths.adFeed}?search=${data.search}`);
    };

    return (
        <div className={`${styles.navLinkContainer} ${styles.searchNavLink}`}>
            <span className={`${styles.searchBtn} ${isActive && styles.active} ${isMobile && styles.mobile}`}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} onClick={onToggleSearch} />
                <div className={`${styles.dropdown} ${isMobile && "wrapper"}`} ref={dropdown}>
                    <form onSubmit={handleSubmit(onHandleSubmit)}>
                        <input type="search" {...register("search", { required: true })} placeholder="Я ищу..." autoComplete="off" />
                        <input type="submit" value={"Найти"} />
                    </form>
                </div>
            </span>
        </div>
    );
};

export { Seacrh };
