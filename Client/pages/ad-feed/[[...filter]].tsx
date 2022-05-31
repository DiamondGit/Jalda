import Layout from "../../components/Layout";
import styles from "./AdFeed.module.scss";
import { useRouter } from "next/router";
import { Filter } from "../../components/Filter";
import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "../../components/UI/Breadcrumbs";
import { Select } from "../../components/UI/Select";
import { DisplayModeSwitcher } from "../../components/UI/DisplayModeSwitcher";
import { useStaticDataContext } from "../../context/staticData";
import { GetServerSideProps } from "next";
import axios from "axios";
import { AdCardItem } from "../../components/AdCardItem";
import { MyPagination } from "../../components/UI/Pagination";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { AdCardType, OptionType } from "../../interfaces";
import { Loading } from "../../components/LoadingWindow";
import _categories from "../../data/categories";
import { _contacts, _socials } from "../../data/infos";
import { useAuthContext } from "../../context/auth";
import _paths from "../../data/paths";
import { getDecodeStorage } from "../../functions";

export const getServerSideProps: GetServerSideProps = async () => {
    const categories_URL = `${process.env.API_BACK}/categories`;
    const socials_URL = `${process.env.API_HOST}/infos/socials`;
    const contacts_URL = `${process.env.API_HOST}/infos/contacts`;

    try {
        const respCategories = await axios.get(categories_URL);
        const dataCategories = (await respCategories.data) || null;

        const respSocials = await axios.get(socials_URL);
        const dataSocials = (await respSocials.data) || null;

        const respContacts = await axios.get(contacts_URL);
        const dataContacts = (await respContacts.data) || null;

        return {
            props: {
                categories: dataCategories,
                socials: dataSocials,
                contacts: dataContacts,
            },
        };
    } catch (error) {
        return {
            props: { notFound: true },
        };
    }
};

export default function AdFeed({ categories, contacts, socials }) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const authContext = useAuthContext();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    const { filter = [], search = null } = router.query;
    const [currentFilterPath, setCurrentFilterPath] = useState<string | string[]>(filter);

    const [isFilterVisible, setFilterVisible] = useState<boolean>(true);
    const filterRef = useRef(null);

    const isAdmin = authContext.role === "Admin";
    if (authContext.isLogged && isAdmin) {
        (async () => {
            await router.push(_paths.admin);
        })();
    }

    const sortOptions: OptionType[] = [
        {
            title: "По дате добавления",
            value: "date",
        },
        {
            title: "По рейтингу",
            value: "rating",
        },
        {
            title: "Цена по возрастанию",
            value: "priceInc",
        },
        {
            title: "Цена по убыванию",
            value: "priceDec",
        },
    ];

    const [sortType, setSortType] = useState<string>();
    const [isGridMode, setGridMode] = useState<boolean>(true);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<AdCardType[]>(null);

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        breadcrumbsContext.deletePostBreadcrumbs();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [currentFilterPath, sortType]);

    useEffect(() => {
        router.push(router.asPath);

        setPostsLoading(true);
        let queryUrl = `${process.env.API_BACK}/posts?`;

        const category = typeof currentFilterPath === "object" ? currentFilterPath.join("/") : currentFilterPath;

        if (category) queryUrl += `category=${category}&`;
        if (search) queryUrl += `search=${search}&`;

        queryUrl += `page=${currentPage}&`;
        queryUrl += `sort=${sortType}&`;

        axios
            .get(queryUrl)
            .then((response) => {
                setPosts(response.data.data);
                setPageCount(response.data.numberOfPages);

                setTimeout(() => {
                    setPostsLoading(false);
                });

                if (!isAdmin && !JSON.parse(getDecodeStorage("logged_user-data"))?.roles.some((userRole) => userRole.name === "Admin"))
                    setLoading(false);
            })
            .catch((error) => {
                console.log(error.message || error);
            });
    }, [currentFilterPath, currentPage, search, sortType]);

    useEffect(() => {
        if (JSON.stringify(currentFilterPath) !== JSON.stringify(filter)) setCurrentFilterPath(filter);
    }, [filter]);

    useEffect(() => {
        if (!breadcrumbsContext.breadcrumbs.search && search && localStorage) {
            //Get search query after page refreshing
            breadcrumbsContext.addSearchBreadcrumbs(JSON.parse(localStorage.getItem("search_breadcrumbs")));
        } else if (breadcrumbsContext.breadcrumbs.search && !search && localStorage) {
            //Removing search query
            breadcrumbsContext.deleteSearchBreadcrumbs();
            localStorage.removeItem("search_breadcrumbs");
        }
    }, [currentFilterPath, search]);

    const changeUrl = (path: string) => {
        router.push(
            {
                pathname: path,
            },
            undefined,
            { shallow: true }
        );
    };

    const getSortType = (value: string) => {
        setSortType(value);
    };

    const getDisplayMode = (gridMode: boolean) => {
        setGridMode(gridMode);
    };

    const onToggleFilter = (outsideProp = null) => {
        if (outsideProp === null) setFilterVisible(!isFilterVisible);
        else setFilterVisible(outsideProp);
    };

    const handleClick = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setFilterVisible(false);
        }
    };

    const onPageChange = (number: number) => {
        setCurrentPage(number);
    };

    useEffect(() => {
        if (!isFilterVisible) return;
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isFilterVisible]);

    if (loading) return <Loading />;
    return (
        <Layout
            title={
                breadcrumbsContext.breadcrumbs.search?.name ||
                breadcrumbsContext.breadcrumbs.main[breadcrumbsContext.breadcrumbs.main.length - 1].name
            }
        >
            <div className="wrapper">
                <div className={styles.mainContainer}>
                    <Breadcrumbs />
                    {search && (
                        <h1 className={`${styles.searchTitle} ${posts.length === 0 && styles.notFount}`}>
                            Результат(-ы) по запросу "{search}"
                        </h1>
                    )}
                    <div className={styles.container}>
                        <div className={`${styles.filterContainer} ${isFilterVisible && styles.active}`} ref={filterRef}>
                            <Filter
                                categories={categories}
                                changeUrl={changeUrl}
                                currentFilterPath={currentFilterPath}
                                toggleVisible={onToggleFilter}
                            />
                        </div>
                        {isFilterVisible && <div className={styles.shadowCover} />}
                        <div className={styles.headingContainer}>
                            <div className={styles.filterToggler} onClick={onToggleFilter}>
                                <FontAwesomeIcon icon={faSliders} />
                            </div>
                            <div className={styles.sort}>
                                <h3>Сортировать по</h3>
                                <Select options={sortOptions} callback={getSortType} />
                            </div>

                            <DisplayModeSwitcher onClickSwitch={getDisplayMode} />
                        </div>
                        <div className={styles.contentContainer}>
                            {!postsLoading ? (
                                <>
                                    {posts?.length > 0 ? (
                                        <div className={`${styles.adFeed} ${isGridMode ? styles.grid : styles.row}`}>
                                            {posts.map((post) => (
                                                <AdCardItem post={post} key={post._id} isGrid={isGridMode} />
                                            ))}
                                        </div>
                                    ) : (
                                        <h3 className={styles.notFountTitle}>По вашему запросу ничего не найдено.</h3>
                                    )}
                                </>
                            ) : (
                                <Loading fill />
                            )}
                            {pageCount > 1 && !postsLoading && (
                                <MyPagination currentPage={currentPage} totalCount={pageCount} onPageChange={onPageChange} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                ${
                    isFilterVisible &&
                    `
                    body{
                        overflow: hidden;
                    }
                    `
                }
                `}
            </style>
            <style jsx global>
                {`
                    article {
                        overflow-x: unset;
                    }
                `}
            </style>
        </Layout>
    );
}
