import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/general.scss";
import { BreadcrumbNodeType, UpCategoryNavType, ContactType, SocialType, UserType, RoleType } from "../interfaces";
import StaticDataContext, { StaticContextType } from "../context/staticData";
import { useEffect, useState } from "react";
import BreadcrumbsContext, { Breadcrumbs, BreadcrumbsContext_I } from "../context/breadcrumbs";
import _paths from "../data/paths";
import { YMaps } from "react-yandex-maps";
import jwtDecode from "jwt-decode";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AuthContext, { AuthContextType } from "../context/auth";
import { CookieModal } from "../components/CookieModal";
import { getDecodeStorage, setEncryptStorage } from "../functions";
import { Loading } from "../components/LoadingWindow";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [categories, setCategories] = useState<UpCategoryNavType[]>(null);
    const [socials, setSocials] = useState<SocialType[]>(null);
    const [contacts, setContacts] = useState<ContactType>(null);

    const setDatas = ({ categories, socials, contacts }: StaticContextType["get"]) => {
        setCategories(categories);
        setSocials(socials);
        setContacts(contacts);
    };

    const valueStatic: StaticContextType = {
        get: {
            categories: categories,
            socials: socials,
            contacts: contacts,
        },
        setDatas: setDatas,
    };

    const breadcrumbsBase: BreadcrumbNodeType = { name: "Главная", path: _paths.main };
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumbs>({
        main: [breadcrumbsBase],
        search: null,
        post: null,
    });

    const setNewBreadcrumbs = (newBreadcrumbs: BreadcrumbNodeType[]) => {
        setBreadcrumbs((prevBread) => ({ ...prevBread, main: [breadcrumbsBase, ...newBreadcrumbs] }));
    };
    const setBreadcrumbsFromLocalstorage = (newBreadcrumbs: Breadcrumbs) => {
        setBreadcrumbs({ ...newBreadcrumbs });
    };
    const addNewBreadcrumbs = (newBreadcrumbs: BreadcrumbNodeType) => {
        const lastBread = breadcrumbs.main[breadcrumbs.main.length - 1];
        if (lastBread.name !== newBreadcrumbs.name && lastBread.path !== newBreadcrumbs.path)
            setBreadcrumbs((prevBread) => ({ ...prevBread, main: [...breadcrumbs.main, newBreadcrumbs] }));
    };
    const addSearchBreadcrumbs = (searchBread: BreadcrumbNodeType) => {
        setBreadcrumbs((prevBread) => ({ ...prevBread, search: searchBread }));
    };
    const deleteSearchBreadcrumbs = () => {
        setBreadcrumbs((prevBread) => ({ ...prevBread, search: null }));
    };
    const addPostBreadcrumbs = (postBread: BreadcrumbNodeType) => {
        setBreadcrumbs((prevBread) => ({ ...prevBread, post: postBread }));
    };
    const deletePostBreadcrumbs = () => {
        setBreadcrumbs((prevBread) => ({ ...prevBread, post: null }));
    };

    useEffect(() => {
        if (localStorage && breadcrumbs.main.length > 1) {
            localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));
        }
    }, [breadcrumbs]);

    useEffect(() => {
        if (localStorage && breadcrumbs.search) {
            localStorage.setItem("search_breadcrumbs", JSON.stringify(breadcrumbs.search));
        }
    }, [breadcrumbs.search]);

    const valueBread: BreadcrumbsContext_I = {
        breadcrumbs: breadcrumbs,
        setBreadcrumbs: setNewBreadcrumbs,
        setBreadcrumbsFromLocalstorage: setBreadcrumbsFromLocalstorage,
        addBreadcrumbs: addNewBreadcrumbs,
        addSearchBreadcrumbs: addSearchBreadcrumbs,
        deleteSearchBreadcrumbs: deleteSearchBreadcrumbs,
        addPostBreadcrumbs: addPostBreadcrumbs,
        deletePostBreadcrumbs: deletePostBreadcrumbs,
    };

    const [user, setUser] = useState<UserType>(null);
    const [token, setToken] = useState<string>(null);
    const [role, setRole] = useState<RoleType>(null);
    const [isLogged, setLogged] = useState(null);

    useEffect(() => {
        if (localStorage && getDecodeStorage("logged_user-data") && localStorage.getItem("logged_user-token")) {
            login();
        } else {
            logout();
        }
    }, []);

    const isAvailable = () => {
        const decodedToken: any = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < new Date().getTime();

        if (isExpired) logout();
        return !isExpired;
    };

    useEffect(() => {
        if (isLogged && token) {
            isAvailable();
        }
    });

    const refreshInfo = (updatedUser: UserType, updatedToken = token) => {
        if (isLogged && user) {
            setUser(updatedUser);
            setEncryptStorage("logged_user-data", JSON.stringify(updatedUser));

            setToken(updatedToken);
            localStorage.setItem("logged_user-token", updatedToken);
        }
    };

    const login = () => {
        setLogged(true);
        if (localStorage) {
            const receivedUser = JSON.parse(getDecodeStorage("logged_user-data"));
            setUser(receivedUser);
            setToken(localStorage.getItem("logged_user-token"));

            const isAdmin = receivedUser.roles?.some((userRole) => userRole.name === "Admin");
            const isAuthor = receivedUser.roles?.some((userRole) => userRole.name === "Author");

            setRole(isAdmin ? "Admin" : isAuthor ? "Author" : "User");
        }
    };

    const logout = () => {
        setLogged(false);
        setUser(null);
        setToken(null);
        setRole(null);
        if (localStorage) {
            localStorage.removeItem("logged_user-data");
            localStorage.removeItem("logged_user-token");
        }
    };

    const valueAuth: AuthContextType = {
        isLogged: isLogged,
        user: user,
        role: role,
        token: token,
        logout: logout,
        login: login,
        isAvailable: isAvailable,
        refreshInfo: refreshInfo,
    };

    if (isLogged === null) return <Loading />;
    return (
        <AuthContext.Provider value={valueAuth}>
            <StaticDataContext.Provider value={valueStatic}>
                <BreadcrumbsContext.Provider value={valueBread}>
                    <YMaps>
                        <Head>
                            <meta charSet="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <link rel="icon" href="/brand/logo.png" />
                        </Head>
                        <Component {...pageProps} />
                        <CookieModal />
                    </YMaps>
                </BreadcrumbsContext.Provider>
            </StaticDataContext.Provider>
        </AuthContext.Provider>
    );
};

export default MyApp;
