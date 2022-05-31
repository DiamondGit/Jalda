import { useRouter } from "next/router";
import styles from "./Auth.module.scss";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../components/UI/Breadcrumbs";
import { BreadcrumbNodeType } from "../../interfaces";
import _paths from "../../data/paths";
import { GetServerSideProps } from "next";
import axios from "axios";
import { useStaticDataContext } from "../../context/staticData";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";
import { LoginForm } from "../../components/Authorization/LoginForm";
import { SignupForm } from "../../components/Authorization/SignupForm";
import { PartnerForm } from "../../components/Authorization/PartnerForm";
import { useAuthContext } from "../../context/auth";
import { Loading } from "../../components/LoadingWindow";
import _categories from "../../data/categories";
import { _contacts, _socials } from "../../data/infos";
import { getDecodeStorage } from "../../functions";
import { ResetPassword } from "../../components/Authorization/ResetPassword";

enum AuthType {
    login = "login",
    signup = "signup",
    partner = "partner",
    resetPassword = "resetPassword",
}

const authBread: { readonly [key: string]: BreadcrumbNodeType } = {
    login: {
        name: "Войти",
        path: _paths.login,
    },
    signup: {
        name: "Регистрация",
        path: _paths.signup,
    },
    partner: {
        name: "Стать партнером",
        path: _paths.registerPartner,
    },
    resetPassword: {
        name: "Сброс пароля",
        path: _paths.registerPartner,
    },
};

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

export default function Auth({ categories, contacts, socials }) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const authContext = useAuthContext();
    const router = useRouter();

    const { type = [] } = router.query;
    const [authType, setAuthType] = useState<string>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = authContext.role === "Admin";
    if (authContext.isLogged && isAdmin) {
        (async () => {
            await router.push(_paths.admin);
        })();
    } else if (authContext.isLogged && type[0] !== AuthType.partner) {
        (async () => {
            await router.push(_paths.profile);
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
    });

    useEffect(() => {
        const authTypeTemp = type.length
            ? type[0] == AuthType.signup
                ? AuthType.signup
                : type[0] === AuthType.partner
                ? AuthType.partner
                : type[0] === AuthType.resetPassword
                ? AuthType.resetPassword
                : AuthType.login
            : AuthType.login;
        if (authType !== authTypeTemp) {
            setAuthType(authTypeTemp);
            breadcrumbsContext.setBreadcrumbs([
                {
                    name: authBread[authTypeTemp].name,
                    path: authBread[authTypeTemp].path,
                },
            ]);
            if (authTypeTemp === AuthType.resetPassword) {
                breadcrumbsContext.addBreadcrumbs({
                    name: authBread.resetPassword.name,
                    path: authBread.resetPassword.path,
                });
            }
        }
    }, [type]);

    useEffect(() => {
        //If user leave the login page after redirecting from post page,
        //user will not redirected back to the post page after next login.
        return () => {
            if (localStorage && localStorage.getItem("post_redirection")) localStorage.removeItem("post_redirection");
        };
    }, [router.asPath]);

    const lastBread = breadcrumbsContext.breadcrumbs?.main[breadcrumbsContext.breadcrumbs?.main.length - 1];

    if (loading) return <Loading />;
    if (!authContext.isLogged || type[0] === AuthType.partner) {
        return (
            <Layout title={lastBread?.name || "Загрузка..."}>
                <div className={`wrapper ${styles.wrapper}`}>
                    <div className={styles.container}>
                        <Breadcrumbs />
                        <div className={styles.window}>
                            <h1>{lastBread?.name}</h1>

                            {authType === AuthType.login ? (
                                <LoginForm />
                            ) : authType === AuthType.signup ? (
                                <SignupForm />
                            ) : authType === AuthType.partner ? (
                                <PartnerForm />
                            ) : (
                                authType === AuthType.resetPassword && <ResetPassword />
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    } else {
        return <Loading />;
    }
}
