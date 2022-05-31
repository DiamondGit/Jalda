import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import styles from "../styles/Error.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Router from "next/router";
import { useEffect, useState } from "react";
import _paths from "../data/paths";
import { GetStaticProps } from "next";
import axios from "axios";
import { useStaticDataContext } from "../context/staticData";
import { Loading } from "../components/LoadingWindow";
import { useDeclension } from "../functions";
import _categories from "../data/categories";
import { _contacts, _socials } from "../data/infos";

export const getStaticProps: GetStaticProps = async () => {
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

export default function ErrorPage({ categories, socials, contacts }) {
    const staticData = useStaticDataContext();
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(10);

    const declensionNumeralsTimer = useDeclension("секунду", "секунды", "секунд");

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        const timerInterval = setInterval(async () => {
            await setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        setLoading(false);
        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        if (timer <= 0) Router.push(_paths.main);
    }, [timer]);

    if (loading) return <Loading />;
    return (
        <Layout title="Ошибка 404">
            <div className={styles.container}>
                <h1>Упссс!</h1>
                <div className={styles.imageContainer}>
                    <Image src="/illustrations/404.svg" layout="fill" priority objectFit="contain" alt={"Illustration"} />
                </div>
                <Link href="/">
                    <a className={styles.link}>
                        <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
                        <span>Вернуться на главную</span>
                    </a>
                </Link>
                <span className={styles.timer}>Авто перемещение через {declensionNumeralsTimer(timer)}...</span>
            </div>
        </Layout>
    );
}
