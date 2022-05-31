import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Loading } from "../../components/LoadingWindow";
import { ApplicationsTab } from "../../components/Profile/Tabs/ApplicationsTab";
import { FavoritesTab } from "../../components/Profile/Tabs/FavoritesTab";
import { MyAdsTab } from "../../components/Profile/Tabs/MyAdsTab";
import { MyBooksTab } from "../../components/Profile/Tabs/MyBooksTab";
import { ProfileTab } from "../../components/Profile/Tabs/ProfileTab";
import { TabsNavigation } from "../../components/UI/TabsNavigation";
import { useAuthContext } from "../../context/auth";
import { useStaticDataContext } from "../../context/staticData";
import _categories from "../../data/categories";
import { _contacts, _socials } from "../../data/infos";
import _paths from "../../data/paths";
import { getDecodeStorage } from "../../functions";
import { TabType } from "../../interfaces";
import styles from "./Profile.module.scss";

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

export default function Profile({ categories, contacts, socials }) {
    const authContext = useAuthContext();
    const staticData = useStaticDataContext();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { tab: queryTab = ["profile"] } = router.query;

    const defaultTabs: TabType[] = [
        { title: "Профиль", value: "profile" },
        { title: "Мои брони", value: "books" },
        { title: "Избранные", value: "favorites" },
    ];

    const authorTabs: TabType[] = [
        { title: "Мои объявления", value: "ads" },
        { title: "Заявки", value: "requests" },
    ];

    const [tabs, setTabs] = useState<TabType[]>(authContext.role === "Author" ? [...defaultTabs, ...authorTabs] : defaultTabs);

    const isAdmin = authContext.role === "Admin";
    if (authContext.isLogged && isAdmin) {
        (async () => {
            await router.push(_paths.admin);
        })();
    }

    const getProcessedQueryTab = () => {
        //converting url query to the array
        const queryTabTemp = typeof queryTab === "string" ? [queryTab] : typeof queryTab === "object" && [...queryTab];
        //create list of availabe tabs for user
        const tabValues = JSON.parse(JSON.stringify([...tabs].map((tab) => tab.value)));

        let temp = [];

        //if url query is not valid slice till valid or open first tab (profile)
        let i = 0;
        while (true) {
            if (!tabValues.includes(queryTabTemp[i])) {
                temp = queryTabTemp.slice(0, i);
                break;
            }
            i++;
        }
        if (temp.length === 0) temp.push("profile");

        return temp;
    };

    const [processedQueryTab, setProcessedQueryTab] = useState(getProcessedQueryTab());

    useEffect(() => {
        if (JSON.stringify(queryTab) !== JSON.stringify(processedQueryTab)) {
            setProcessedQueryTab(getProcessedQueryTab());
        }
    }, [queryTab]);

    //after processing url query, change browser's url by valid query
    useEffect(() => {
        const query = processedQueryTab[0];
        const pathname = query === "profile" ? [_paths.profile] : [_paths.profile, query];

        if (processedQueryTab.length !== 0) {
            router.push(
                {
                    pathname: pathname.join("/"),
                },
                undefined,
                { shallow: true }
            );
        }
    }, [processedQueryTab]);

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        if (!authContext.isLogged) {
            if (localStorage && !getDecodeStorage("logged_user-data") && !localStorage.getItem("logged_user-token")) {
                (async () => {
                    await router.push(_paths.login);
                })();
            } else {
                authContext.login();
            }
        }
    }, []);

    //do login check after authContext completely loaded
    useEffect(() => {
        if (authContext.isLogged) {
            if (!isAdmin && !JSON.parse(getDecodeStorage("logged_user-data"))?.roles?.some((userRole) => userRole.name === "Admin"))
                setLoading(false);
        } else {
            if (localStorage && !getDecodeStorage("logged_user-data") && !localStorage.getItem("logged_user-token")) {
                (async () => {
                    await router.push(_paths.login);
                })();
            } else {
                authContext.login();
            }
        }
    }, [authContext.isLogged]);

    const [selectedTab, setSelectedTab] = useState<TabType>(tabs.find((tab) => tab.value === processedQueryTab[0]));

    useEffect(() => {
        setSelectedTab(tabs.find((tab) => tab.value === processedQueryTab[0]));
    }, [processedQueryTab]);

    const handleTabChange = (tab: TabType) => {
        setSelectedTab(tab);
    };

    //change browser url based on active tab
    useEffect(() => {
        const pathname = [_paths.profile];
        if (selectedTab.value !== "profile") pathname.push(selectedTab.value);
        router.push(
            {
                pathname: pathname.join("/"),
            },
            undefined,
            { shallow: true }
        );
    }, [selectedTab]);

    const [selectedSort, setSelectedSort] = useState<string>();

    const onSortClick = (value: string) => {
        setSelectedSort(value);
    };

    const [selectedFilter, setSelectedFilter] = useState<string>();

    const onFilterClick = (value: string) => {
        setSelectedFilter(value);
    };

    const onConfirmFavSearch = (data) => {
        alert(JSON.stringify(data));
    };

    if (loading) return <Loading />;
    if (authContext.isLogged) {
        return (
            <Layout title={selectedTab?.title || "Loading..."}>
                <div className="wrapper">
                    <h1 className={styles.mainTitle}>Личный кабинет</h1>
                    <TabsNavigation tabs={tabs} selectedTab={selectedTab} setTab={handleTabChange} />

                    {tabs.map((tab, index) => (
                        <div className={`${styles.tabContent} ${tab.value === selectedTab?.value && styles.active}`} key={index}>
                            {tab.value === "profile" && <ProfileTab />}
                            {tab.value === "books" && <MyBooksTab />}
                            {tab.value === "favorites" && <FavoritesTab />}
                            {authContext.role !== "User" && tab.value === "ads" && <MyAdsTab />}
                            {authContext.role !== "User" && tab.value === "requests" && <ApplicationsTab />}
                        </div>
                    ))}
                </div>
            </Layout>
        );
    } else {
        return <Loading />;
    }
}
