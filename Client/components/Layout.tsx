import React, { ReactNode } from "react";
import Head from "next/head";
import { Header } from "./Header";
import { Footer } from "./Footer";

type LayoutProps = {
    children?: ReactNode;
    title?: string;
    isMainPage?: boolean;
};

const Layout = ({ children, title, isMainPage = false }: LayoutProps) => (
    <>
        <Head>
            <title>{title ? `${title} | Jalda` : "Jalda"}</title>
        </Head>
        <Header isMainPage={isMainPage} />
        <article>{children}</article>
        <Footer />
    </>
);

export default Layout;
