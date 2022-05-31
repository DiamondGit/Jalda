import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Loading } from "../components/LoadingWindow";
import { FavoritesTab } from "../components/Profile/Tabs/FavoritesTab";
import { Breadcrumbs } from "../components/UI/Breadcrumbs";
import { useAuthContext } from "../context/auth";
import { useBreadcrumbsContext } from "../context/breadcrumbs";
import { useStaticDataContext } from "../context/staticData";
import _categories from "../data/categories";
import { _contacts, _socials } from "../data/infos";
import _paths from "../data/paths";
import { getDecodeStorage } from "../functions";
import { BreadcrumbNodeType, ContactType, SocialType, UpCategoryNavType } from "../interfaces";
import styles from "../styles/Favorites.module.scss";
import tabStyles from "./profile/Profile.module.scss";

interface FavoritesProps {
    categories: UpCategoryNavType[];
    socials: SocialType[];
    contacts: ContactType;
}

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

export default function Favorites({ categories, socials, contacts }: FavoritesProps) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const authContext = useAuthContext();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const breadcrumbs: BreadcrumbNodeType[] = [{ name: "Избранные", path: router.pathname }];

    const isAdmin = authContext.role === "Admin";
    if (authContext.isLogged && isAdmin) {
        (async () => {
            await router.push(_paths.admin);
        })();
    } else if (authContext.isLogged) {
        (async () => {
            await router.push(_paths.profileFavorites);
        })();
    }

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        breadcrumbsContext.setBreadcrumbs(breadcrumbs);

        if (!isAdmin && !JSON.parse(getDecodeStorage("logged_user-data"))?.roles.some((userRole) => userRole.name === "Admin"))
            setLoading(false);
    }, []);

    if (loading) return <Loading />;
    if (!authContext.isLogged) {
        return (
            <Layout title="Избранные">
                <div className="wrapper">
                    <div className={styles.mainContainer}>
                        <Breadcrumbs />
                        <div className={`${tabStyles.tabContent} ${tabStyles.active}`}>
                            <FavoritesTab />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    } else {
        return <Loading />;
    }
}
