import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Breadcrumbs } from "../components/UI/Breadcrumbs";
import { useStaticDataContext } from "../context/staticData";
import _paths from "../data/paths";
import { BreadcrumbNodeType, UpCategoryNavType, ContactType, SocialType, PartnerType } from "../interfaces";
import styles from "../styles/About.module.scss";
import Image from "next/image";
import { SectionContainer } from "../components/UI/SectionContainer";
import { Advantages } from "../components/Advantages";
import _partners from "../data/partners";
import AliceCarousel from "react-alice-carousel";
import { useBreadcrumbsContext } from "../context/breadcrumbs";
import { Loading } from "../components/LoadingWindow";
import _categories from "../data/categories";
import { _contacts, _socials } from "../data/infos";
import { useAuthContext } from "../context/auth";
import { getDecodeStorage } from "../functions";

interface AboutProps {
    categories: UpCategoryNavType[];
    socials: SocialType[];
    contacts: ContactType;
    partners: PartnerType[];
}

export const getServerSideProps: GetServerSideProps = async () => {
    const partners_URL = `${process.env.API_HOST}/basics/partners`;
    const categories_URL = `${process.env.API_BACK}/categories`;
    const socials_URL = `${process.env.API_HOST}/infos/socials`;
    const contacts_URL = `${process.env.API_HOST}/infos/contacts`;

    try {
        const respPartners = await axios.get(partners_URL);
        const dataPartners = (await respPartners.data) || null;

        const respCategories = await axios.get(categories_URL);
        const dataCategories = (await respCategories.data) || null;

        const respSocials = await axios.get(socials_URL);
        const dataSocials = (await respSocials.data) || null;

        const respContacts = await axios.get(contacts_URL);
        const dataContacts = (await respContacts.data) || null;

        return {
            props: {
                partners: dataPartners,
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

export default function About({ partners, categories, socials, contacts }: AboutProps) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const authContext = useAuthContext();

    const breadcrumbs: BreadcrumbNodeType[] = [{ name: "О нас", path: router.pathname }];

    const imageUrl = "/pictures/teamPicture.jpg";

    const mainText = `
    Основная идея сайта Jalda заключается в том, чтобы собрать все вещи и помещение которые можно арендовать в одном месте, и дать новый толчок рынку в Казахстане.
    <br />
    Наша задача - «передвинуть» ценовую планку возможностей у людей. То есть дать им в пользование вещи, которые они не могут себе купить или хотят пользоваться только один раз, лучше взять что-нибудь на время, но хорошего качество, чем купить дешевую вещь и выбросить ее.
    <br />
    Равным образом консультация с широким активом требует анализа направлений прогрессивного развития. С другой стороны высокотехнологичная концепция общественной системы позволяет выполнять важные задания по разработке направлений прогрессивного развития.
    `;

    const numberOfObjects = 400;
    const numberOfClients = 15000;
    const numberOfVisitors = 20000;
    const numberOfRents = 80;

    const available_partners = partners || _partners;

    const isAdmin = authContext.role === "Admin";
    if (authContext.isLogged && isAdmin) {
        (async () => {
            await router.push(_paths.admin);
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
    return (
        <Layout title="О Нас">
            <div className="wrapper">
                <div className={styles.mainContainer}>
                    <Breadcrumbs />
                    <div className={styles.container}>
                        <h1>О нас</h1>
                        <div className={styles.contentConainer}>
                            {mainText.split("<br />").map((parag, index) => (
                                <p key={index}>{parag}</p>
                            ))}
                        </div>
                        <div className={`${styles.imageContainer} ${styles.cover}`}>
                            <Image src={imageUrl} layout="fill" objectFit="cover" alt={"Image"} />
                        </div>
                        <div className={`${styles.imageContainer} ${styles.contain}`}>
                            <Image src={imageUrl} layout="fill" objectFit="contain" objectPosition={"top center"} alt={"Image"} />
                        </div>
                    </div>
                </div>
                <SectionContainer title="Jalda в цифрах">
                    <div className={styles.statisticsContainer}>
                        <div className={styles.statistic}>
                            <h1>{numberOfObjects.toLocaleString()}</h1>
                            <p>Вещей и помещений</p>
                        </div>
                        <div className={styles.statistic}>
                            <h1>{numberOfClients.toLocaleString()}</h1>
                            <p>Довольных клиентов</p>
                        </div>
                        <div className={styles.statistic}>
                            <h1>{numberOfVisitors.toLocaleString()}</h1>
                            <p>Посетителей ежемесячно</p>
                        </div>
                        <div className={styles.statistic}>
                            <h1>{numberOfRents.toLocaleString()} +</h1>
                            <p>Прокатов размещают свои вещи на Jalda</p>
                        </div>
                    </div>
                </SectionContainer>
                <SectionContainer title="Наши преимущества">
                    <Advantages />
                </SectionContainer>
                <SectionContainer title="Наши партнеры">
                    <div className={styles.partnersSection}>
                        <AliceCarousel
                            autoWidth
                            autoPlay
                            mouseTracking
                            infinite
                            animationDuration={400}
                            autoPlayInterval={2000}
                            disableButtonsControls
                            disableDotsControls
                        >
                            {[...available_partners, ...available_partners].map((partner, index) => (
                                <div key={`${index}${partner.id}`} className={styles.partnerCard}>
                                    <div className={styles.imageContainer}>
                                        <Image
                                            src={partner.imageUrl}
                                            layout="fill"
                                            objectFit="contain"
                                            className={styles.image}
                                            alt={partner.name}
                                            placeholder="blur"
                                            blurDataURL="/placeholder-image.jpg"
                                        />
                                    </div>
                                </div>
                            ))}
                        </AliceCarousel>
                    </div>
                </SectionContainer>
            </div>
        </Layout>
    );
}
