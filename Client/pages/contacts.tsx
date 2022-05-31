import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { Loading } from "../components/LoadingWindow";
import { Map } from "../components/Map";
import { Breadcrumbs } from "../components/UI/Breadcrumbs";
import { MyButton } from "../components/UI/MyButton";
import { useAuthContext } from "../context/auth";
import { useBreadcrumbsContext } from "../context/breadcrumbs";
import { useStaticDataContext } from "../context/staticData";
import _categories from "../data/categories";
import { _contacts, _socials } from "../data/infos";
import _paths from "../data/paths";
import { getDecodeStorage, scrollToSection } from "../functions";
import { BreadcrumbNodeType, UpCategoryNavType, ContactType, SocialType } from "../interfaces";
import styles from "../styles/Contacts.module.scss";

interface ContactsProps {
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

export default function Contacts({ categories, socials, contacts }: ContactsProps) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const authContext = useAuthContext();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const breadcrumbs: BreadcrumbNodeType[] = [{ name: "Контакты", path: router.pathname }];

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

    useEffect(() => {
        if (!loading) {
            scrollToSection(router);
        }
    }, [loading]);

    const onConfirmForm = (data) => {
        alert(JSON.stringify(data));
        reset();
    };

    if (loading) return <Loading />;
    return (
        <Layout title={"Контакты"}>
            <div className="wrapper">
                <div className={styles.mainContainer}>
                    <Breadcrumbs />
                    <div className={styles.container}>
                        <h1>Контакты</h1>
                        <div className={styles.contentConainer}>
                            <ul className={styles.contacts}>
                                <li>
                                    <span>Адрес:</span>
                                    {contacts.address}
                                </li>
                                <li>
                                    <span>E-mail:</span> {contacts.email}
                                </li>
                                <li>
                                    <span>Телефон:</span>
                                    {contacts.mobilePhoneNumber}
                                </li>
                                <li>
                                    <span>Телефон:</span>
                                    {contacts.phoneNumber}
                                </li>
                            </ul>
                            <div className={styles.socialsContainer}>
                                <h3>Социальные сети:</h3>
                                <div className={styles.socials}>
                                    {socials.map((social) => (
                                        <a className={styles.iconContainer} href={social.link} target="_blank" key={social.name}>
                                            <Image
                                                src={`/icons/socials/${social.name.toLowerCase()}_blue.svg`}
                                                layout={"fill"}
                                                objectFit={"contain"}
                                                alt={"Contact logo"}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.imageContainer}>
                            <Image src="/illustrations/contacts.svg" layout="fill" objectFit="contain" alt={"Illustration"} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.formSection} id="contactWithUs">
                <h2>Нужна консультация?</h2>
                <h3>Заполните заявку, и наш специалист свяжется с вами!</h3>
                <form className={styles.form} onSubmit={handleSubmit(onConfirmForm)}>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            defaultValue={authContext.isLogged ? authContext.user.name : null}
                            readOnly={authContext.isLogged}
                            {...register("name", {
                                required: "Введите имя",
                                pattern: {
                                    value: /^([^0-9]*)$/,
                                    message: "Имя не должно содержать цифры",
                                },
                            })}
                        />
                        {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="email"
                            placeholder="E-mail"
                            defaultValue={authContext.isLogged ? authContext.user.email : null}
                            readOnly={authContext.isLogged}
                            {...register("email", {
                                required: "Введите e-mail",
                                pattern: {
                                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Формат неверный",
                                },
                            })}
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                    </div>
                    <div className={styles.inputContainer}>
                        <textarea
                            placeholder="Сообщение"
                            {...register("text", {
                                required: "Введите Ваше сообщение",
                            })}
                        ></textarea>
                        {errors.text && <span className={styles.errorMessage}>{errors.text.message}</span>}
                    </div>
                    <MyButton primary stretch submit>
                        Отправить
                    </MyButton>
                </form>
            </div>
            <div className={styles.mapContainer}>
                <Map center={[43.22767, 76.859891]} marker text="Jalda" />
            </div>
        </Layout>
    );
}
