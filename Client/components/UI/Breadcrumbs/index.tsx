import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useBreadcrumbsContext } from "../../../context/breadcrumbs";
import _paths from "../../../data/paths";
import { BreadcrumbNodeType } from "../../../interfaces";
import styles from "./Breadcrumbs.module.scss";

const Node = ({ node }: { node: BreadcrumbNodeType }) => (
    <>
        <Link href={node.path}>
            <a className={styles.node}>{node.name}</a>
        </Link>
        <span key={node.name + "/"} className={styles.separator}>
            {"/"}
        </span>
    </>
);

const Breadcrumbs = () => {
    const router = useRouter();
    const breadcrumbsContext = useBreadcrumbsContext();

    const [breads, setBreads] = useState<BreadcrumbNodeType[]>([]);

    useEffect(() => {
        setBreads(breadcrumbsContext.breadcrumbs.main);
        if (router.asPath.includes(_paths.adFeed) || router.asPath.includes(_paths.post)) {
            if (breadcrumbsContext.breadcrumbs.search) setBreads((prevBread) => [...prevBread, breadcrumbsContext.breadcrumbs.search]);
            if (breadcrumbsContext.breadcrumbs.post) setBreads((prevBread) => [...prevBread, breadcrumbsContext.breadcrumbs.post]);
        }
    }, [breadcrumbsContext.breadcrumbs, breadcrumbsContext.breadcrumbs.search]);

    const isLastNode = (index: number) => {
        return index === breads.length - 1;
    };

    return (
        <div className={styles.breadcrumbs}>
            {breads?.map((node, index) => {
                return isLastNode(index) ? (
                    <span className={`${styles.node} ${styles.last}`} key={node.name + index}>
                        {node.name}
                    </span>
                ) : (
                    <Node node={node} key={node.name + index} />
                );
            })}
        </div>
    );
};

export { Breadcrumbs };
