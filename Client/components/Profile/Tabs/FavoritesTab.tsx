import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth";
import { AdCardType, OptionType } from "../../../interfaces";
import styles from "../../../pages/profile/Profile.module.scss";
import { AdCardItem } from "../../AdCardItem";
import { Loading } from "../../LoadingWindow";
import { Select } from "../../UI/Select";

const FavoritesTab = () => {
    const { register, handleSubmit, reset } = useForm();
    const authContext = useAuthContext();
    const [loading, setLoading] = useState(true);

    const [myFavPosts, setMyFavPosts] = useState<AdCardType[]>(null);

    useEffect(() => {
        if (!authContext.isLogged) {
            if (localStorage && localStorage.getItem("favorites")) {
                const ids = JSON.parse(localStorage.getItem("favorites"));
                axios
                    .patch(`${process.env.API_BACK}/posts/preview`, { posts: ids })
                    .then((response) => {
                        setMyFavPosts(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log(error.message || error);
                    });
            } else {
                setLoading(false);
            }
        } else {
            axios
                .get(`${process.env.API_BACK}/user/favorites`, {
                    headers: {
                        authorization: `token ${authContext.token}`,
                    },
                })
                .then((response) => {
                    setMyFavPosts(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error.message || error);
                });
        }
    }, []);

    const sortOptions: OptionType[] = [
        {
            title: "Сначала новые",
            value: "new",
        },
        {
            title: "Сначала старые",
            value: "old",
        },
    ];

    const [selectedSort, setSelectedSort] = useState<string>(null);
    const [searchQuery, setSearchQuery] = useState<string>(null);

    const onSortClick = (value: string) => {
        setSelectedSort(value);
    };

    const onConfirmBookSearch = (data: { search: string }) => {
        setSearchQuery(data.search);
    };

    const resetSearch = () => {
        setSearchQuery(null);
        reset();
    };

    return (
        <>
            {!loading ? (
                <>
                    {myFavPosts && myFavPosts.length > 0 ? (
                        <>
                            <div className={`${styles.controlPanel} ${styles.isFavTab}`}>
                                <div className={styles.group}>
                                    <h3>Сортировать по</h3>
                                    <Select options={sortOptions} callback={onSortClick} />
                                </div>
                                <form className={styles.searchForm} onSubmit={handleSubmit(onConfirmBookSearch)}>
                                    <input
                                        type="search"
                                        placeholder="Поиск по избранным"
                                        {...register("search", {
                                            required: false,
                                        })}
                                        defaultValue=""
                                        autoComplete="off"
                                    />
                                    <input type="submit" value={"Искать"} />
                                </form>
                            </div>
                            {searchQuery && (
                                <h3 className={styles.resetSearch} onClick={resetSearch}>
                                    Сбросить поиск "{searchQuery}" <FontAwesomeIcon icon={faCircleXmark} />
                                </h3>
                            )}
                            <div className={styles.favsContainer}>
                                {myFavPosts && myFavPosts.length > 0 ? (
                                    (selectedSort === "old" ? [...myFavPosts].reverse() : myFavPosts)
                                        .filter((post) => post.title.toLowerCase().includes(searchQuery?.toLowerCase() || ""))
                                        .map((myFavPost) => <AdCardItem post={myFavPost} isFavCardItem key={myFavPost._id} />)
                                ) : (
                                    <h4 className={styles.notFound}>По данному запросу ничего не найдено.</h4>
                                )}
                            </div>
                        </>
                    ) : (
                        <h4 className={styles.notFound}>У вас пока нет избранных.</h4>
                    )}
                </>
            ) : (
                <Loading fill />
            )}
        </>
    );
};

export { FavoritesTab };
