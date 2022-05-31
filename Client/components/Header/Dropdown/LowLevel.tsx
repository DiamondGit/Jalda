import Link from "next/link";
import { LowCategoryNavType } from "../../../interfaces";

interface LowLevelProps {
    categories: LowCategoryNavType[];
    parentPath: string;
    closeBurger(): void;
    styles: any;
}

const LowLevel = ({ categories, parentPath, closeBurger, styles }: LowLevelProps) => {
    return (
        <>
            {categories.map(({ _id, name, path }) => (
                <div key={_id} className={styles.navLinkContainer}>
                    <Link href={`${parentPath}/${path}`}>
                        <a onClick={closeBurger}>{name}</a>
                    </Link>
                </div>
            ))}
        </>
    );
};

export { LowLevel };
