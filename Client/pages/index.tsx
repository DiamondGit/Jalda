import Image from "next/image";
import Link from "next/link";
import AliceCarousel from "react-alice-carousel";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Main.module.scss";
import { useEffect, useState } from "react";
import { Accordion } from "../components/UI/Accordion";
import axios from "axios";
import { GetServerSideProps } from "next";
import _paths from "../data/paths";
import { UpCategoryNavType, ContactType, FreqReqType, SocialType } from "../interfaces";
import { useStaticDataContext } from "../context/staticData";
import { SectionContainer } from "../components/UI/SectionContainer";
import { Advantages } from "../components/Advantages";
import { useForm } from "react-hook-form";
import { Loading } from "../components/LoadingWindow";
import { useRouter } from "next/router";
import { getDecodeStorage, scrollToSection, useDeclension } from "../functions";
import _faqs from "../data/faqs";
import { _contacts, _socials } from "../data/infos";
import _categories from "../data/categories";
import { _sizes } from "../data";
import { _frequentRequests } from "../data/frequentRequests";
import { useAuthContext } from "../context/auth";

interface MainProps {
    categories: UpCategoryNavType[];
    freqReqs: FreqReqType[];
    socials: SocialType[];
    contacts: ContactType;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const frequentRequests_URL = `${process.env.API_BACK}/frequentRequests`;
    const categories_URL = `${process.env.API_BACK}/categories`;
    const socials_URL = `${process.env.API_HOST}/infos/socials`;
    const contacts_URL = `${process.env.API_HOST}/infos/contacts`;

    try {
        const respFreqReqs = await axios.get(frequentRequests_URL);
        const dataFreqReqs = (await respFreqReqs.data) || null;

        const respCategories = await axios.get(categories_URL);
        const dataCategories = (await respCategories.data) || null;

        const respSocials = await axios.get(socials_URL);
        const dataSocials = (await respSocials.data) || null;

        const respContacts = await axios.get(contacts_URL);
        const dataContacts = (await respContacts.data) || null;

        return {
            props: {
                freqReqs: dataFreqReqs,
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

const Main = ({ freqReqs, categories, socials, contacts }: MainProps) => {
    const staticData = useStaticDataContext();
    const { register, handleSubmit } = useForm();
    const authContext = useAuthContext();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [isUserInstruction, setInstruction] = useState(true);
    const onToggleInstruction = () => {
        setInstruction(!isUserInstruction);
    };

    const [isReqCarouselSliding, setReqCarouselSliding] = useState(false);
    const handleReqItemClick = (event) => {
        if (isReqCarouselSliding) event.preventDefault();
    };

    const declensionNumeralsReq = useDeclension("объявление", "объявления", "объявлений");

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

        if (!isAdmin && !JSON.parse(getDecodeStorage("logged_user-data"))?.roles.some((userRole) => userRole.name === "Admin"))
            setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            scrollToSection(router);
        }
    }, [loading]);

    const onSearchConfirm = (data: { search: string }) => {
        router.push(`${_paths.adFeed}?search=${data.search}`);
    };

    const available_freqReqs = freqReqs || _frequentRequests;

    if (loading) return <Loading />;
    return (
        <Layout title={"Платформа для аренды чего угодно"} isMainPage>
            <div className={styles.heroBlock}>
                <div>
                    <h1>Зачем покупать, когда можно арендовать?</h1>
                    <h2>Платформа для аренды чего угодно</h2>
                    <div className={styles.searchBar}>
                        <form onSubmit={handleSubmit(onSearchConfirm)}>
                            <input type="search" {...register("search", { required: true })} placeholder="Я ищу..." autoComplete="off" />
                            <input type="submit" value={"Найти"} />
                        </form>
                    </div>
                </div>
                <div className={styles.arrowContainer}>
                    <div
                        onClick={() => {
                            window.scrollTo({
                                top: window.innerHeight - 80,
                            });
                        }}
                    >
                        <span className={styles.arrowDown}>
                            <FontAwesomeIcon icon={faAngleDown} className={styles.icon} />
                        </span>
                        <span className={styles.arrowDown}>
                            <FontAwesomeIcon icon={faAngleDown} className={styles.icon} />
                        </span>
                        <span>Вниз</span>
                    </div>
                </div>
            </div>
            <div className="wrapper">
                <SectionContainer>
                    <div className={styles.categoriesContainer}>
                        {staticData.get.categories?.map((category) => (
                            <Link key={category._id} href={`${_paths.adFeed}/${category.path}`}>
                                <a className={styles.category}>
                                    <h3>{category.name}</h3>
                                    <div className={styles.overlay} />
                                    <Image
                                        src={category.previewUrl}
                                        layout="fill"
                                        objectFit="cover"
                                        objectPosition="center center"
                                        className={styles.image}
                                        placeholder="blur"
                                        blurDataURL="/placeholder-image.jpg"
                                        alt={"Category image"}
                                    />
                                </a>
                            </Link>
                        ))}
                    </div>
                </SectionContainer>
                <SectionContainer title={"Наши преимущества"} id={"advantages"}>
                    <Advantages />
                </SectionContainer>
            </div>
            <SectionContainer title={"Частые запросы"}>
                <div className={styles.requestsContainer}>
                    <AliceCarousel
                        autoWidth
                        mouseTracking
                        touchTracking
                        infinite
                        onSlideChange={() => {
                            setReqCarouselSliding(true);
                        }}
                        onSlideChanged={() => {
                            setReqCarouselSliding(false);
                        }}
                        disableButtonsControls
                        disableDotsControls
                    >
                        {available_freqReqs.map((freqReq) => (
                            <div key={freqReq._id} className={styles.card}>
                                <Link href={`${_paths.adFeed}?search=${freqReq.title.replaceAll(" ", "+")}`}>
                                    <a className={styles.link} onClick={handleReqItemClick}>
                                        <div className={styles.imageContainer}>
                                            <Image
                                                src={freqReq.previewUrl}
                                                layout="fill"
                                                objectFit="cover"
                                                className={styles.image}
                                                placeholder="blur"
                                                blurDataURL="/placeholder-image.jpg"
                                                alt={"Frequent request image"}
                                            />
                                        </div>
                                        <div className={styles.content}>
                                            <h3>{freqReq.title}</h3>
                                            <h4>{declensionNumeralsReq(freqReq.count)}</h4>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </AliceCarousel>
                </div>
            </SectionContainer>
            <div className="wrapper">
                <SectionContainer title={"Как это работает?"} id="instruction">
                    <div className={styles.instructionContainer}>
                        <div
                            className={`${styles.switch} ${isUserInstruction ? styles.user : styles.business}`}
                            onClick={onToggleInstruction}
                        >
                            <span>Арендатор</span>
                            <span>Владелец</span>
                        </div>
                        <div className={styles.tableContainer}>
                            {isUserInstruction ? (
                                <>
                                    {_sizes.map((size, index) => (
                                        <div className={styles[size]} key={index}>
                                            <Image
                                                src={`/illustrations/user_instruction${index + 1}.svg`}
                                                layout="fill"
                                                alt={"Instruction"}
                                            />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {_sizes.map((size, index) => (
                                        <div className={styles[size]} key={index}>
                                            <Image
                                                src={`/illustrations/business_instruction${index + 1}.svg`}
                                                layout="fill"
                                                alt={"Instruction"}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </SectionContainer>
                <SectionContainer title={"Часто задаваемые вопросы"} left id={"faq"}>
                    {_faqs && (
                        <div className={styles.questionsContainer}>
                            {_faqs.map((faq) => (
                                <Accordion key={faq.id} {...faq} />
                            ))}
                        </div>
                    )}
                </SectionContainer>
            </div>
        </Layout>
    );
};

export default Main;
