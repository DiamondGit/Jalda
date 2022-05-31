import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth";
import _paths from "../../../data/paths";
import { AdCardType, OptionType } from "../../../interfaces";
import styles from "../../../pages/profile/Profile.module.scss";
import { AdCardItem } from "../../AdCardItem";
import { MyButton } from "../../UI/MyButton";
import { Select } from "../../UI/Select";

const MyAdsTab = () => {
    const { register, handleSubmit } = useForm();
    const authContext = useAuthContext();
    const router = useRouter();

    const [myAds, setMyAds] = useState<AdCardType[]>(null);

    useEffect(() => {
        {
            axios
                .get(`${process.env.API_BACK}/posts`)
                .then((response) => {
                    setMyAds(response.data.data);
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

    const [selectedSort, setSelectedSort] = useState<string>();

    const onSortClick = (value: string) => {
        setSelectedSort(value);
    };

    const onConfirmBookSearch = (data) => {
        alert(JSON.stringify(data));
    };

    return (
        <>
            {myAds && myAds.length > 0 ? (
                <>
                    <div className={`${styles.controlPanel} ${styles.isFavTab}`}>
                        <div className={styles.group}>
                            <h3>Сортировать по</h3>
                            <Select options={sortOptions} callback={onSortClick} />
                            <MyButton
                                primary
                                adButton
                                onClick={() => {
                                    router.push(_paths.adCreate);
                                }}
                            >
                                Добавить объявление
                            </MyButton>
                        </div>
                        <form className={styles.searchForm} onSubmit={handleSubmit(onConfirmBookSearch)}>
                            <input
                                type="search"
                                placeholder="Поиск по брони"
                                {...register("search", {
                                    required: true,
                                })}
                                autoComplete="off"
                            />
                            <input type="submit" value={"Искать"} />
                        </form>
                    </div>
                    <div className={styles.adsContainer}>
                        {myAds.map((myAd, index) => (
                            <AdCardItem post={myAd} isGrid key={index} />
                        ))}
                    </div>
                </>
            ) : (
                <h4 className={styles.notFound}>У вас пока нет объявлений.</h4>
            )}
        </>
    );
};

export { MyAdsTab };
